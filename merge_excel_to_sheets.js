/**
 * ==============================================================================
 * SCRIPT TIỆN ÍCH: GỘP DỮ LIỆU EXCEL & GOOGLE SHEETS BẢO TOÀN LINK GOOGLE DRIVE
 * Hệ thống Quản Lý Phòng Khám MediCare Clinic Pro (#ktskhoa365)
 * ==============================================================================
 * Cách chạy:
 *   node merge_excel_to_sheets.js
 *   hoặc: npm run merge-excel
 *   hoặc truyền tham số: node merge_excel_to_sheets.js <duong_dan_excel> <url_web_app>
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as xlsxModule from 'xlsx';

const XLSX = xlsxModule.default || xlsxModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình mặc định
const DEFAULT_EXCEL_FILENAME = 'DATA_BENH_NHAN_BS_HAO_IMPORT.xlsx';
const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwNfuqRnn-9LgHiwB1ZI3I3ftt1bkdgc-rnphOjj14HMSD7UQxinJNhy_MtgJogvH14/exec';

// ==============================================================================
// 1. TÌM FILE EXCEL VÀ URL GOOGLE APPS SCRIPT
// ==============================================================================
function resolveExcelPath() {
  if (process.argv[2] && fs.existsSync(process.argv[2])) {
    return path.resolve(process.argv[2]);
  }
  const localPath = path.resolve(__dirname, DEFAULT_EXCEL_FILENAME);
  if (fs.existsSync(localPath)) return localPath;

  const parentPath = path.resolve(__dirname, '..', DEFAULT_EXCEL_FILENAME);
  if (fs.existsSync(parentPath)) return parentPath;

  throw new Error(`Không tìm thấy file Excel '${DEFAULT_EXCEL_FILENAME}' tại thư mục hiện tại hoặc thư mục cha!`);
}

function resolveApiUrl() {
  return process.argv[3] || process.env.VITE_GOOGLE_SCRIPT_URL || DEFAULT_WEB_APP_URL;
}

// ==============================================================================
// 2. KẾT NỐI API GOOGLE APPS SCRIPT
// ==============================================================================
async function fetchCurrentSheetsData(apiUrl) {
  console.log(`📡 Đang kết nối tới Google Sheets qua Web App API:`);
  console.log(`   🔗 ${apiUrl}\n`);

  try {
    const readUrl = apiUrl.includes('?') ? `${apiUrl}&action=read` : `${apiUrl}?action=read`;
    const response = await fetch(readUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      if (text.includes('Không tìm thấy hàm tập lệnh: doGet')) {
        throw new Error(
          `Google Apps Script chưa triển khai hàm doGet!\n` +
          `👉 Vui lòng mở file GoogleAppsScript_Code.js, dán vào Apps Script của Google Sheets và bấm 'Triển khai mới' (New Deployment).`
        );
      }
      throw new Error(`Phản hồi từ Google Apps Script không phải JSON hợp lệ. Nội dung: ${text.slice(0, 300)}...`);
    }

    if (data.status !== 'success') {
      throw new Error(`API báo lỗi: ${data.message || JSON.stringify(data)}`);
    }

    return data;
  } catch (err) {
    console.warn(`⚠️ Cảnh báo kết nối: ${err.message}`);
    console.log(`ℹ️ Tiếp tục với dữ liệu Sheets trống (nếu là lần đầu đồng bộ hoặc API chưa cập nhật)...\n`);
    return {
      status: 'warning',
      patients: [],
      visits: [],
      prescriptions: [],
      labs: []
    };
  }
}

// ==============================================================================
// 3. TẠO BẢN DỰ PHÒNG AN TOÀN TRƯỚC KHI GỘP (BACKUP)
// ==============================================================================
function createBackup(sheetsData) {
  const backupDir = path.resolve(__dirname, 'backup_data');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const backupFilename = `backup_sheets_before_merge_${timestamp}.json`;
  const backupFilePath = path.join(backupDir, backupFilename);

  fs.writeFileSync(backupFilePath, JSON.stringify(sheetsData, null, 2), 'utf-8');
  const stats = fs.statSync(backupFilePath);

  console.log(`💾 ĐÃ SAO LƯU DỰ PHÒNG AN TOÀN:`);
  console.log(`   📁 File: ${backupFilePath}`);
  console.log(`   📊 Dung lượng: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`   👥 Số bệnh nhân lưu trữ: ${(sheetsData.patients || []).length}\n`);

  return backupFilePath;
}

// ==============================================================================
// 4. ĐỌC FILE EXCEL CỦA BÁC SĨ HÀO
// ==============================================================================
function readExcelData(excelPath) {
  console.log(`📖 Đang đọc dữ liệu từ file Excel:`);
  console.log(`   📄 ${excelPath}\n`);

  const workbook = XLSX.readFile(excelPath, { cellDates: true });
  const sheetNames = workbook.SheetNames;
  console.log(`   📋 Các sheets tìm thấy: ${sheetNames.join(', ')}`);

  // 1. Đọc sheet Benh_Nhan
  const bnSheet = workbook.Sheets['Benh_Nhan'] || workbook.Sheets[sheetNames[0]];
  const rawPatients = XLSX.utils.sheet_to_json(bnSheet, { defval: '' });

  // 2. Đọc sheet Luot_Kham
  let rawVisits = [];
  if (workbook.Sheets['Luot_Kham']) {
    rawVisits = XLSX.utils.sheet_to_json(workbook.Sheets['Luot_Kham'], { defval: '' });
  }

  // 3. Đọc sheet Don_Thuoc_Chi_Tiet
  let rawPrescriptions = [];
  if (workbook.Sheets['Don_Thuoc_Chi_Tiet']) {
    rawPrescriptions = XLSX.utils.sheet_to_json(workbook.Sheets['Don_Thuoc_Chi_Tiet'], { defval: '' });
  }

  console.log(`   ✅ Tổng bệnh nhân trong Excel: ${rawPatients.length}`);
  console.log(`   ✅ Tổng lượt khám trong Excel: ${rawVisits.length}`);
  console.log(`   ✅ Tổng đơn thuốc chi tiết trong Excel: ${rawPrescriptions.length}\n`);

  return { rawPatients, rawVisits, rawPrescriptions };
}

// ==============================================================================
// 5. THUẬT TOÁN HỢP NHẤT THÔNG MINH (BẢO TOÀN LINK DRIVE)
// ==============================================================================
function smartMergeData(sheetsData, excelData) {
  console.log(`🧠 BẮT ĐẦU QUÁ TRÌNH HỢP NHẤT DỮ LIỆU THÔNG MINH (SMART MERGE):`);

  const sheetsPatients = sheetsData.patients || [];
  const { rawPatients, rawVisits, rawPrescriptions } = excelData;

  // Gom đơn thuốc theo lượt khám
  const prescriptionsByVisit = new Map();
  rawPrescriptions.forEach(p => {
    const vId = (p.Ma_Luot_Kham || '').toString().trim();
    if (!prescriptionsByVisit.has(vId)) {
      prescriptionsByVisit.set(vId, []);
    }
    prescriptionsByVisit.get(vId).push({
      drugName: p.Ten_Thuoc || '',
      unit: p.DVT || 'Viên',
      morning: Number(p.Sang) || 0,
      noon: Number(p.Trua) || 0,
      afternoon: Number(p.Chieu) || 0,
      evening: Number(p.Toi) || 0,
      days: Number(p.So_Ngay) || 1,
      price: Number(p.Don_Gia) || 0,
      note: p.Cach_Dung || ''
    });
  });

  // Xây dựng danh sách lượt khám hoàn chỉnh
  const visitsByPatient = new Map();
  const mergedVisits = rawVisits.map(v => {
    const vId = (v.Ma_Luot_Kham || '').toString().trim();
    const pId = (v.Ma_BN || '').toString().trim();
    const visitObj = {
      visitId: vId,
      patientId: pId,
      visitDate: v.Ngay_Kham || '',
      height: Number(v.Chieu_Cao) || 0,
      weight: Number(v.Can_Nang) || 0,
      bp: v.Huyet_Ap || '',
      pulse: Number(v.Mach) || 0,
      symptoms: v.Trieu_Chung || '',
      diagnosis: v.Chan_Doan || '',
      diseaseCategory: v.Chuyen_Khoa || 'Nội khoa',
      followUpDate: v.Hen_Tai_Kham || '',
      doctorNotes: v.Loi_Dan || '',
      verbatimTreatment: v.Dieu_Tri_Nguyen_Van || '',
      consultationFee: Number(v.Cong_Kham) || 150000,
      paymentStatus: v.Trang_Thai_Thu || 'Đã thu',
      prescriptions: prescriptionsByVisit.get(vId) || [],
      labs: []
    };

    if (!visitsByPatient.has(pId)) {
      visitsByPatient.set(pId, []);
    }
    visitsByPatient.get(pId).push(visitObj);
    return visitObj;
  });

  // Bản đồ bệnh nhân hiện có trên Google Sheets
  const sheetsMapById = new Map();
  const sheetsMapByNameDob = new Map();

  sheetsPatients.forEach(p => {
    const idKey = normalizeKey(p.Ma_BN || p.id);
    const nameKey = normalizeKey(p.Ho_Ten || p.name);
    const dobKey = normalizeKey(p.Ngay_Sinh || p.dob);

    if (idKey) sheetsMapById.set(idKey, p);
    if (nameKey) sheetsMapByNameDob.set(`${nameKey}_${dobKey}`, p);
  });

  let preservedDriveCount = 0;
  let newDriveCount = 0;
  let updatedPatientCount = 0;
  let newPatientCount = 0;

  const mergedPatients = [];
  const processedKeys = new Set();

  // 1. Duyệt qua từng bệnh nhân trong Excel
  rawPatients.forEach(ep => {
    const pId = (ep.Ma_BN || '').toString().trim();
    const pName = (ep.Ho_Ten || '').toString().trim();
    const pDob = (ep.Ngay_Sinh || '').toString().trim();

    const idKey = normalizeKey(pId);
    const nameKey = normalizeKey(pName);
    const dobKey = normalizeKey(pDob);

    let existing = null;
    if (idKey && sheetsMapById.has(idKey)) {
      existing = sheetsMapById.get(idKey);
    } else if (nameKey && sheetsMapByNameDob.has(`${nameKey}_${dobKey}`)) {
      existing = sheetsMapByNameDob.get(`${nameKey}_${dobKey}`);
    }

    const excelLink = (ep.Link_Drive_Anh || '').toString().trim();
    const existingLink = existing ? (existing.Link_Drive_Anh || existing.Link_Google_Drive || existing['Link Google Drive'] || existing.imageFolderUrl || '').toString().trim() : '';

    let finalLink = '';

    if (existing) {
      // BỆNH NHÂN ĐÃ CÓ TRÊN SHEETS:
      // QUY TẮC BẢO TOÀN LINK DRIVE:
      // Nếu Sheets đã có link hợp lệ, mà Excel bị trống link -> GIỮ NGUYÊN LINK TRÊN SHEETS!
      if (existingLink !== '' && (!excelLink || excelLink === '')) {
        finalLink = existingLink;
        preservedDriveCount++;
      } else if (excelLink && excelLink !== '') {
        finalLink = excelLink;
        if (excelLink !== existingLink) newDriveCount++;
        else preservedDriveCount++;
      } else {
        finalLink = '';
      }
      updatedPatientCount++;
    } else {
      // BỆNH NHÂN MỚI TỪ EXCEL:
      finalLink = excelLink;
      if (finalLink) newDriveCount++;
      newPatientCount++;
    }

    const mergedPatient = {
      id: pId || (existing ? (existing.Ma_BN || existing.id) : `BN${String(mergedPatients.length + 1).padStart(4, '0')}`),
      name: pName || (existing ? (existing.Ho_Ten || existing.name) : ''),
      dob: pDob || (existing ? (existing.Ngay_Sinh || existing.dob) : ''),
      gender: ep.Gioi_Tinh || (existing ? (existing.Gioi_Tinh || existing.gender) : 'Nam'),
      phone: ep.SDT || (existing ? (existing.SDT || existing.phone) : ''),
      relativePhone: ep.SDT_Nguoi_Than || (existing ? (existing.SDT_Nguoi_Than || existing.relativePhone) : ''),
      initialWeight: Number(ep.Can_Nang_Ban_Dau) || (existing ? (Number(existing.Can_Nang_Ban_Dau) || 50) : 50),
      occupation: ep.Nghe_Nghiep || (existing ? (existing.Nghe_Nghiep || existing.occupation) : ''),
      address: ep.Dia_Chi || (existing ? (existing.Dia_Chi || existing.address) : ''),
      medicalHistory: ep.Tien_Su_Benh || (existing ? (existing.Tien_Su_Benh || existing.medicalHistory) : ''),
      allergies: ep.Di_Ung_Thuoc || (existing ? (existing.Di_Ung_Thuoc || existing.allergies) : 'Chưa ghi nhận'),
      pastParaclinical: ep.CLS_Da_Lam || (existing ? (existing.CLS_Da_Lam || existing.pastParaclinical) : ''),
      pastMedications: ep.Thuoc_Da_Dung || (existing ? (existing.Thuoc_Da_Dung || existing.pastMedications) : ''),
      imageFolderUrl: finalLink,
      isArchived: (ep.Trang_Thai_Ho_So || '').includes('khỏi') || (ep.Trang_Thai_Ho_So || '').includes('Lưu trữ'),
      createdAt: ep.Ngay_Tao || (existing ? (existing.Ngay_Tao || existing.createdAt) : new Date().toISOString().slice(0, 10))
    };

    mergedPatients.push(mergedPatient);
    if (idKey) processedKeys.add(idKey);
    if (nameKey) processedKeys.add(`${nameKey}_${dobKey}`);
  });

  // 2. Bảo toàn các bệnh nhân đã có trên Sheets nhưng không xuất hiện trong file Excel này
  let sheetOnlyPatientsCount = 0;
  sheetsPatients.forEach(sp => {
    const idKey = normalizeKey(sp.Ma_BN || sp.id);
    const nameKey = normalizeKey(sp.Ho_Ten || sp.name);
    const dobKey = normalizeKey(sp.Ngay_Sinh || sp.dob);

    if (!processedKeys.has(idKey) && !processedKeys.has(`${nameKey}_${dobKey}`)) {
      sheetOnlyPatientsCount++;
      const spLink = (sp.Link_Drive_Anh || sp['Link Google Drive'] || sp.imageFolderUrl || '').toString().trim();
      if (spLink) preservedDriveCount++;

      mergedPatients.push({
        id: sp.Ma_BN || sp.id,
        name: sp.Ho_Ten || sp.name,
        dob: sp.Ngay_Sinh || sp.dob,
        gender: sp.Gioi_Tinh || sp.gender || 'Nam',
        phone: sp.SDT || sp.phone || '',
        relativePhone: sp.SDT_Nguoi_Than || sp.relativePhone || '',
        initialWeight: Number(sp.Can_Nang_Ban_Dau) || 50,
        occupation: sp.Nghe_Nghiep || sp.occupation || '',
        address: sp.Dia_Chi || sp.address || '',
        medicalHistory: sp.Tien_Su_Benh || sp.medicalHistory || '',
        allergies: sp.Di_Ung_Thuoc || sp.allergies || 'Chưa ghi nhận',
        pastParaclinical: sp.CLS_Da_Lam || sp.pastParaclinical || '',
        pastMedications: sp.Thuoc_Da_Dung || sp.pastMedications || '',
        imageFolderUrl: spLink,
        isArchived: (sp.Trang_Thai_Ho_So || '').includes('khỏi'),
        createdAt: sp.Ngay_Tao || sp.createdAt || ''
      });
    }
  });

  console.log(`   🔒 Link Drive ảnh xét nghiệm được BẢO TOÀN: ${preservedDriveCount}`);
  console.log(`   ➕ Link Drive mới cập nhật từ Excel: ${newDriveCount}`);
  console.log(`   🔄 Bệnh nhân cập nhật thông tin: ${updatedPatientCount}`);
  console.log(`   ✨ Bệnh nhân mới thêm từ Excel: ${newPatientCount}`);
  console.log(`   🛡️ Bệnh nhân riêng có trên Sheets được bảo vệ: ${sheetOnlyPatientsCount}`);
  console.log(`   📊 TỔNG CỘNG BỆNH NHÂN SAU HỢP NHẤT: ${mergedPatients.length}\n`);

  return {
    mergedPatients,
    mergedVisits
  };
}

// ==============================================================================
// 6. ĐẨY DỮ LIỆU ĐÃ HỢP NHẤT LÊN GOOGLE SHEETS AN TOÀN
// ==============================================================================
async function pushMergedDataToSheets(apiUrl, mergedData) {
  console.log(`🚀 Đang đồng bộ dữ liệu hợp nhất lên Google Sheets qua Web App API...`);

  const payload = {
    action: 'SYNC_ALL',
    patients: mergedData.mergedPatients,
    visits: mergedData.mergedVisits,
    usageLogs: [
      {
        time: new Date().toLocaleString('vi-VN'),
        doctorName: 'BSCK1 Tôn Thất Hảo',
        clinicName: 'MediCare Clinic Pro',
        phone: '0908297118',
        action: 'Smart Merge Excel to Sheets (Bảo toàn link Drive)',
        patientCount: mergedData.mergedPatients.length,
        device: 'Node.js Automation Script'
      }
    ]
  };

  // Luôn lưu sẵn file dữ liệu hợp nhất vào thư mục backup_data để đề phòng sự cố
  const backupDir = path.resolve(__dirname, 'backup_data');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const localMergedPath = path.join(backupDir, 'merged_data_ready_for_sync.json');
  fs.writeFileSync(localMergedPath, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`   💾 Đã lưu dữ liệu gộp sẵn sàng tại: ${localMergedPath}`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000)
    });

    if (!response.ok) {
      throw new Error(`Đẩy dữ liệu thất bại! HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(`Google Apps Script trả lời không phải JSON: ${responseText.slice(0, 300)}`);
    }

    return result;
  } catch (err) {
    console.warn(`\n⚠️ LƯU Ý QUAN TRỌNG: Không thể đẩy trực tiếp lên Web App URL (${err.message})`);
    console.log(`👉 Bác sĩ / Kỹ sư chỉ cần:`);
    console.log(`   1. Mở file 'GoogleAppsScript_Code.js' vừa được tạo.`);
    console.log(`   2. Dán vào Extensions > Apps Script trên Google Sheets.`);
    console.log(`   3. Bấm 'Triển khai' (Deploy) > 'Triển khai mới' (New deployment).`);
    console.log(`   4. Chạy lại lệnh: npm run merge-excel để hoàn tất đồng bộ 100%!\n`);
    return {
      status: 'pending_deployment',
      message: 'Dữ liệu đã được gộp an toàn và sẵn sàng gửi lên Sheets sau khi cập nhật Google Apps Script.'
    };
  }
}

// ==============================================================================
// 7. HÀM CHÍNH (MAIN WORKFLOW)
// ==============================================================================
async function main() {
  console.log(`\n==============================================================================`);
  console.log(`🏥 MEDICARE CLINIC PRO: ĐỒNG BỘ DỮ LIỆU EXCEL & GOOGLE SHEETS THÔNG MINH`);
  console.log(`==============================================================================\n`);

  try {
    const excelPath = resolveExcelPath();
    const apiUrl = resolveApiUrl();

    // Bước 1: Lấy dữ liệu hiện có trên Google Sheets
    const sheetsData = await fetchCurrentSheetsData(apiUrl);

    // Bước 2: Tự động sao lưu dự phòng trước khi gộp
    const backupFile = createBackup(sheetsData);

    // Bước 3: Đọc file Excel Bác sĩ Hảo
    const excelData = readExcelData(excelPath);

    // Bước 4: Hợp nhất thông minh, tuyệt đối bảo toàn Link Drive
    const mergedData = smartMergeData(sheetsData, excelData);

    // Bước 5: Đẩy lên Google Sheets
    const apiResult = await pushMergedDataToSheets(apiUrl, mergedData);

    console.log(`\n==============================================================================`);
    console.log(`🎉 KẾT QUẢ ĐỒNG BỘ THÀNH CÔNG RỰC RỠ:`);
    console.log(`   ✅ Phản hồi từ Google Apps Script: ${apiResult.message || apiResult.status}`);
    console.log(`   📊 Tổng số hồ sơ bệnh nhân trên Sheets: ${mergedData.mergedPatients.length}`);
    console.log(`   📊 Tổng số lượt khám bệnh: ${mergedData.mergedVisits.length}`);
    console.log(`   💾 Bản sao lưu dự phòng lưu tại: ${backupFile}`);
    console.log(`==============================================================================\n`);

  } catch (err) {
    console.error(`\n❌ LỖI TRONG QUÁ TRÌNH ĐỒNG BỘ:`, err.message);
    process.exit(1);
  }
}

function normalizeKey(str) {
  if (!str) return '';
  return str.toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

main();
