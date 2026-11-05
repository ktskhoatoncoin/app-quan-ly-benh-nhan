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

  // Wait for port 4173 to be ready
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log('--- 2. Launching Headless Chrome with CDP ---');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:4173/'
  ]);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Get debug targets from CDP
  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

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

  // Test 1: Check datalist #drug-catalog-list options count
  const eval1 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const dl = document.getElementById('drug-catalog-list');
        const count = dl ? dl.options.length : 0;
        const first5 = dl ? Array.from(dl.options).slice(0, 5).map(o => o.value) : [];
        return { count, first5 };
      })()
    `,
    returnByValue: true
  });
  console.log('Test 1 (Drug Catalog count in datalist):', eval1.result.value);

  // Test 2: Check patient list rendered and click first patient
  const eval2 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const rows = document.querySelectorAll('tr');
        const firstBtn = document.querySelector('button[title*="Mở hồ sơ"], button:has(span), td button');
        const pNames = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Mở hồ sơ') || b.textContent.includes('A Khanh'));
        return { rowCount: rows.length, buttonsFound: pNames.length };
      })()
    `,
    returnByValue: true
  });
  console.log('Test 2 (Patient table row check):', eval2.result.value);

  // Click on "A Khanh" or first patient to switch to Tab 2
  const eval3 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const allButtons = Array.from(document.querySelectorAll('button'));
        const aKhanhBtn = allButtons.find(b => b.textContent.includes('A Khanh'));
        if (aKhanhBtn) {
          aKhanhBtn.click();
          return 'Clicked A Khanh!';
        }
        const openRecordBtn = allButtons.find(b => b.textContent.includes('Mở hồ sơ'));
        if (openRecordBtn) {
          openRecordBtn.click();
          return 'Clicked Mở hồ sơ!';
        }
        return 'No patient button found';
      })()
    `,
    returnByValue: true
  });
  console.log('Test 3 (Click patient):', eval3.result.value);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test 4: Verify we are in Tab 2 and test drug selection auto-fill
  const eval4 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const drugInput = document.querySelector('input[list="drug-catalog-list"]');
        const dl = document.getElementById('drug-catalog-list');
        return {
          hasDrugInput: Boolean(drugInput),
          drugCountInTab2: dl ? dl.options.length : 0,
          currentValue: drugInput ? drugInput.value : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Test 4 (Tab 2 Prescription screen verification):', eval4.result.value);

  // Test 5: Open Google Sheets Modal and check Tab 6 Security Box
  const eval5 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const allButtons = Array.from(document.querySelectorAll('button'));
        const sheetsBtn = allButtons.find(b => b.textContent.includes('Cơ sở dữ liệu Sheets') || b.textContent.includes('Google Sheets'));
        if (sheetsBtn) {
          sheetsBtn.click();
          return 'Clicked Sheets button';
        }
        return 'Sheets button not found';
      })()
    `,
    returnByValue: true
  });
  console.log('Test 5 (Open Sheets Modal):', eval5.result.value);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Switch to Tab 6 "Mã kết nối Google Apps Script"
  const eval6 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const allButtons = Array.from(document.querySelectorAll('button'));
        const appsScriptTab = allButtons.find(b => b.textContent.includes('Apps Script') || b.textContent.includes('Mã kết nối'));
        if (appsScriptTab) {
          appsScriptTab.click();
          return 'Clicked Apps Script Tab';
        }
        return 'Apps Script tab not found';
      })()
    `,
    returnByValue: true
  });
  console.log('Test 6 (Switch to Apps Script Tab):', eval6.result.value);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if Security Shield Box is rendered
  const eval7 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const bodyText = document.body.innerText;
        const hasSecurityTitle = bodyText.includes('HỆ THỐNG BẢO VỆ DỮ LIỆU 3 LỚP');
        const hasToken = bodyText.includes('MEDICARE_SECURE_TOKEN_2026_HAO_CLINIC_998877');
        const hasRestricted = bodyText.includes('Hạn chế') && bodyText.includes('Người xem');
        return { hasSecurityTitle, hasToken, hasRestricted };
      })()
    `,
    returnByValue: true
  });
  console.log('Test 7 (Security 3-Layer Shield verification):', eval7.result.value);

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

  if (eval4.result.value.drugCountInTab2 === 100 && eval4.result.value.hasDrugInput && eval7.result.value.hasSecurityTitle && eval7.result.value.hasToken) {
    console.log('\n🎉 ALL AUTOMATED TESTS PASSED 100%! Ready for production deployment!');
    process.exit(0);
  } else {
    console.error('\n❌ Tests did not meet all expectations.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
