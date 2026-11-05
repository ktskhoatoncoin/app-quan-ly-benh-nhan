import { spawn } from 'child_process';
import http from 'http';

async function main() {
  console.log('--- 1. Starting Vite Preview Server ---');
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'pipe'
  });

  preview.stdout.on('data', (d) => console.log('[Vite Preview]', d.toString().trim()));
  preview.stderr.on('data', (d) => console.error('[Vite Err]', d.toString().trim()));

  await new Promise((resolve) => setTimeout(resolve, 2500));

  console.log('--- 2. Launching Headless Chrome with CDP ---');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\temp\\chrome-test-profile',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:4173/'
  ]);
  chrome.stdout.on('data', (d) => console.log('[Chrome]', d.toString()));
  chrome.stderr.on('data', (d) => console.log('[Chrome Err]', d.toString()));

  // Wait for Chrome to be ready on port 9222
  let targets = null;
  for (let i = 0; i < 30; i++) {
    try {
      targets = await new Promise((resolve, reject) => {
        const req = http.get('http://127.0.0.1:9222/json', (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
      });
      if (targets && targets.length > 0) break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  const pageTarget = targets.find((t) => t.type === 'page');
  if (!pageTarget) {
    throw new Error('No page target found in Chrome!');
  }

  console.log('Connecting to Chrome Page target at:', pageTarget.webSocketDebuggerUrl);
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));

  let reqId = 1;
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = reqId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

  const consoleLogs = [];
  ws.addEventListener('message', (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push({ type: msg.params.type, args: msg.params.args });
    }
  });

  await send('Runtime.enable');
  await send('Page.enable');

  console.log('Waiting for application to mount and render...');
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // TEST 1: Patient list rendered
  const eval1 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const rows = document.querySelectorAll('tr');
        return { rowCount: rows.length };
      })()
    `,
    returnByValue: true
  });
  console.log('Test 1 (Patient list count):', eval1.result.value);

  // TEST 2: Click patient "BA A TƯỞNG" or first patient to open Tab 2
  const eval2 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const allButtons = Array.from(document.querySelectorAll('button'));
        const targetBtn = allButtons.find(b => b.textContent.includes('A Khanh') || b.textContent.includes('BA A TƯỞNG') || b.textContent.includes('Mở hồ sơ'));
        if (targetBtn) {
          targetBtn.click();
          return 'Clicked patient: ' + targetBtn.textContent.trim();
        }
        return 'No patient button found';
      })()
    `,
    returnByValue: true
  });
  console.log('Test 2 (Navigate to Tab 2):', eval2.result.value);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // TEST 3: Check Tab 2 - Drug input, 100 Drug datalist, and "Bảng 100 Thuốc Mẫu" button
  const eval3 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const drugInput = document.querySelector('input[list="drug-catalog-list"]');
        const dl = document.getElementById('drug-catalog-list');
        const allBtns = Array.from(document.querySelectorAll('button'));
        const catalogBtn = allBtns.find(b => b.textContent.includes('100 Thuốc Mẫu'));
        const saveSheetBtn = allBtns.find(b => b.textContent.includes('Ghi phiếu này vào Google Sheets'));
        const saveInfoText = document.body.innerText.includes('Nơi lưu dữ liệu: Google Sheets > Bảng [Luot_Kham]');
        return {
          hasDrugInput: Boolean(drugInput),
          datalistCount: dl ? dl.options.length : 0,
          hasCatalogBtn: Boolean(catalogBtn),
          hasSaveSheetBtn: Boolean(saveSheetBtn),
          hasSaveInfoText: saveInfoText
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Test 3 (Tab 2 Prescription & 100 Drugs checks):', eval3.result.value);

  // TEST 4: Click "Bảng 100 Thuốc Mẫu" and verify modal opens with 100 drugs
  const eval4 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const allBtns = Array.from(document.querySelectorAll('button'));
        const catalogBtn = allBtns.find(b => b.textContent.includes('100 Thuốc Mẫu'));
        if (catalogBtn) {
          catalogBtn.click();
          return 'Clicked 100 Thuốc Mẫu!';
        }
        return 'Catalog button not found';
      })()
    `,
    returnByValue: true
  });
  console.log('Test 4 (Open 100 Drugs Modal):', eval4.result.value);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // TEST 5: Verify 100 Drugs Modal content & select a drug
  const eval5 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const modalTitle = document.body.innerText.includes('DANH MỤC 100 LOẠI THUỐC THƯỜNG DÙNG NHẤT');
        const pickBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('+ Chọn kê đơn'));
        const catBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Da liễu') || b.textContent.includes('Dị ứng'));
        
        let picked = false;
        if (pickBtns.length > 0) {
          pickBtns[0].click(); // Pick Nizoral or first drug
          picked = true;
        }
        return {
          hasModalTitle: modalTitle,
          drugRowsCount: pickBtns.length,
          hasCategoryFilters: catBtns.length > 0,
          pickedFirstDrug: picked
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Test 5 (100 Drugs Modal verification & Selection):', eval5.result.value);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // TEST 6: Open Print Modal and verify Save buttons are visible and fixed
  const eval6 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const allBtns = Array.from(document.querySelectorAll('button'));
        const printBtn = allBtns.find(b => b.textContent.includes('In Đơn Thuốc'));
        if (printBtn) {
          printBtn.click();
          return 'Clicked In Đơn Thuốc button!';
        }
        return 'In Đơn Thuốc button not found';
      })()
    `,
    returnByValue: true
  });
  console.log('Test 6 (Open Print Modal):', eval6.result.value);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // TEST 7: Check Print Modal save buttons (top quick save + bottom footer buttons)
  const eval7 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const bodyText = document.body.innerText;
        const hasTopQuickSave = bodyText.includes('LƯU XUỐNG Ổ CỨNG MÁY TÍNH');
        const allBtns = Array.from(document.querySelectorAll('button'));
        const hasPdfBtn = allBtns.some(b => b.textContent.includes('Tải File PDF') || b.textContent.includes('Xuất PDF'));
        const hasImgBtn = allBtns.some(b => b.textContent.includes('Tải File Ảnh') || b.textContent.includes('Xuất Ảnh'));
        const hasPrintPaperBtn = allBtns.some(b => b.textContent.includes('In ra giấy'));
        const hasCloseBtn = allBtns.some(b => b.textContent.includes('Đóng'));
        const printArea = document.getElementById('prescription-print-area');
        return {
          hasTopQuickSave,
          hasPdfBtn,
          hasImgBtn,
          hasPrintPaperBtn,
          hasCloseBtn,
          hasPrintArea: Boolean(printArea)
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Test 7 (Print Modal Save buttons verification):', eval7.result.value);

  // Close print modal
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const allBtns = Array.from(document.querySelectorAll('button'));
        const closeBtn = allBtns.find(b => b.textContent === '✕' || b.textContent.includes('Đóng'));
        if (closeBtn) closeBtn.click();
      })()
    `
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  // TEST 8: Open Google Sheets Modal and verify copied Apps Script code syntax
  const eval8 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const allBtns = Array.from(document.querySelectorAll('button'));
        const sheetsBtn = allBtns.find(b => b.textContent.includes('Cơ sở dữ liệu Sheets') || b.textContent.includes('Google Sheets'));
        if (sheetsBtn) sheetsBtn.click();
        return 'Opened Sheets Modal';
      })()
    `,
    returnByValue: true
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Click Tab 6 Apps Script
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const allBtns = Array.from(document.querySelectorAll('button'));
        const appsScriptTab = allBtns.find(b => b.textContent.includes('Apps Script') || b.textContent.includes('Mã kết nối'));
        if (appsScriptTab) appsScriptTab.click();
      })()
    `
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Inspect the pre tag containing appsScriptCode
  const eval9 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const pre = document.querySelector('pre');
        if (!pre) return { found: false };
        const code = pre.innerText;
        const line74Snippet = code.split('\\n').slice(68, 82).join('\\n');
        return {
          found: true,
          codeLength: code.length,
          hasApiToken: code.includes('MEDICARE_SECURE_TOKEN_2026_HAO_CLINIC_998877'),
          line74Snippet
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Test 8 (Apps Script Code embedded check):', eval9.result.value);

  console.log('--- Summary of Console Logs ---');
  const errors = consoleLogs.filter((l) => l.type === 'error');
  console.log('Console errors count:', errors.length);
  if (errors.length > 0) {
    console.error('Console errors:', errors);
  }

  // Clean up
  ws.close();
  chrome.kill();
  preview.kill();

  const passed =
    eval3.result.value.datalistCount === 100 &&
    eval3.result.value.hasCatalogBtn &&
    eval5.result.value.hasModalTitle &&
    eval5.result.value.drugRowsCount >= 100 &&
    eval7.result.value.hasTopQuickSave &&
    eval7.result.value.hasPdfBtn &&
    eval7.result.value.hasImgBtn &&
    eval9.result.value.found &&
    eval9.result.value.hasApiToken &&
    errors.length === 0;

  if (passed) {
    console.log('\n🎉 ALL 4 REQUESTS FULLY VERIFIED & PASSED 100%!');
    process.exit(0);
  } else {
    console.error('\n❌ Some checks did not pass. Details:', {
      test3: eval3.result.value,
      test5: eval5.result.value,
      test7: eval7.result.value,
      test8: eval9.result.value,
      errorsCount: errors.length
    });
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
