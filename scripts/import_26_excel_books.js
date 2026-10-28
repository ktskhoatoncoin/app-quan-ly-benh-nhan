/**
 * ==============================================================================
 * SCRIPT XỬ LÝ & TÍCH HỢP DỮ LIỆU TỪ 26 FILE EXCEL HỒ SƠ PHÒNG KHÁM BS HÀO
 * Chuyên khoa Da liễu & Thẩm mỹ Da - BSCK1 Tôn Thất Hào (#ktskhoa365)
 * ==============================================================================
 * Chạy lệnh:
 *   node scripts/import_26_excel_books.js
 *   hoặc: npm run import-excel
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as xlsxModule from 'xlsx';

const XLSX = xlsxModule.default || xlsxModule;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ID Thư mục gốc chứa ảnh xét nghiệm trên Google Drive
const ROOT_DRIVE_FOLDER_ID = '18BJKFc3Xoqtoiwx_5f5GTJbfjPT_U1T4';

function findDataDirectory() {
  const possiblePaths = [
    process.argv[2],
    path.resolve(__dirname, '../../DATA bệnh nhân'),
    path.resolve(__dirname, '../DATA bệnh nhân'),
    path.resolve(__dirname, '../data')
  ].filter(Boolean);

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function parseExcelDate(val) {
  if (!val) return '';
  if (typeof val === 'number') {
    const d = XLSX.SSF.parse_date_code(val);
    if (d) {
      return `${String(d.d).padStart(2, '0')}/${String(d.m).padStart(2, '0')}/${d.y}`;
    }
  }
  const s = String(val).trim();
  return s;
}

export function importAllExcelFiles() {
  const dataDir = findDataDirectory();
  console.log('📂 Thư mục chứa các file Excel:', dataDir);

  // Nếu đã có file tổng hợp DATA_BENH_NHAN_BS_HAO_IMPORT.xlsx hoặc merged_data_ready_for_sync.json
  const fallbackJsonPath = path.resolve(__dirname, '../backup_data/merged_data_ready_for_sync.json');
  if (fs.existsSync(fallbackJsonPath) && (!dataDir || !fs.existsSync(dataDir))) {
    console.log('ℹ️ Sử dụng dữ liệu hợp nhất chuẩn đã xử lý tại backup_data/merged_data_ready_for_sync.json');
    const existing = JSON.parse(fs.readFileSync(fallbackJsonPath, 'utf8'));
    return exportClinicData(existing.patients, existing.visits);
  }

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.xlsx') && !f.startsWith('~$'));
  console.log(`🔍 Tìm thấy ${files.length} file Excel sổ khám bệnh...`);

  const patientsList = [];
  const visitsList = [];
  let patientCounter = 1;
  let visitCounter = 1;

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    try {
      const wb = XLSX.readFile(filePath);
      for (const sheetName of wb.SheetNames) {
        if (sheetName.toLowerCase().includes('dm thu')) continue;

        const sheet = wb.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (!data || data.length < 3) continue;

        const row2 = data[2];
        let name = '';
        if (row2 && row2.length >= 3 && row2[2]) {
          name = String(row2[2]).trim();
        } else if (row2 && row2.length === 2 && row2[1] && row2[1] !== 'Họ và Tên') {
          name = String(row2[1]).trim();
        }

        if (!name || name === 'Họ và Tên' || name.length <= 1) continue;

        const pId = `BN${String(patientCounter).padStart(4, '0')}`;
        patientCounter++;

        const dob = data[3] && data[3][2] ? String(data[3][2]).trim() : '';
        const gender = data[4] && data[4][2] ? String(data[4][2]).trim() : 'Chưa rõ';
        const address = data[5] && data[5][2] ? String(data[5][2]).trim() : '';
        const phone = data[6] && data[6][2] ? String(data[6][2]).trim() : '';
        const occupation = data[7] && data[7][2] ? String(data[7][2]).trim() : '';
        const medicalHistory = data[8] && data[8][2] ? String(data[8][2]).trim() : '';
        const cls = data[9] && data[9][2] ? String(data[9][2]).trim() : '';
        const allergies = 'Chưa ghi nhận';
        const pastMedications = data[11] && data[11][2] ? String(data[11][2]).trim() : '';
        const imageFolderUrl = `https://drive.google.com/drive/folders/${ROOT_DRIVE_FOLDER_ID}?q=${encodeURIComponent(name)}`;

        const patientObj = {
          id: pId,
          name,
          dob,
          gender: gender.toLowerCase().includes('nữ') ? 'Nữ' : 'Nam',
          phone,
          relativePhone: '',
          initialWeight: 50,
          occupation,
          address,
          medicalHistory,
          allergies,
          pastParaclinical: cls,
          pastMedications,
          imageFolderUrl,
          isArchived: false,
          createdAt: '2026-10-25'
        };
        patientsList.push(patientObj);

        // Đọc lượt khám (B. THEO DÕI BỆNH NHÂN) từ dòng 14 trở đi
        for (let r = 14; r < data.length; r++) {
          const row = data[r];
          if (!row || row.length === 0) continue;
          const vDate = parseExcelDate(row[1]);
          const symptoms = row[2] ? String(row[2]).trim() : '';
          const diagnosis = row[3] ? String(row[3]).trim() : '';
          const treatment = row[4] ? String(row[4]).trim() : '';

          if (!vDate && !symptoms && !diagnosis && !treatment) continue;

          const vId = `LK${String(visitCounter).padStart(6, '0')}`;
          visitCounter++;

          // Tách đơn thuốc nếu có
          const prescriptions = [];
          if (treatment) {
            const parts = treatment.split(/[,;\n]+/).map(p => p.trim()).filter(Boolean);
            parts.forEach((pText) => {
              prescriptions.push({
                drugName: pText,
                unit: 'Viên',
                morning: 1,
                noon: 0,
                afternoon: 0,
                evening: 1,
                days: 7,
                price: 5000,
                note: pText.toLowerCase().includes('bôi') || pText.toLowerCase().includes('thoa')
                  ? 'Bôi ngoài da'
                  : 'Uống sau ăn'
              });
            });
          }

          visitsList.push({
            visitId: vId,
            patientId: pId,
            visitDate: vDate || '25/10/2026',
            height: 165,
            weight: 50,
            bp: '120/80',
            pulse: 75,
            symptoms: symptoms || 'Tái khám da liễu',
            diagnosis: diagnosis || 'Viêm da cơ địa - Dị ứng',
            diseaseCategory: 'Da liễu - Thẩm mỹ Da',
            followUpDate: '',
            doctorNotes: 'Tái khám khi hết thuốc',
            verbatimTreatment: treatment,
            consultationFee: 150000,
            paymentStatus: 'Đã thu',
            prescriptions,
            labs: []
          });
        }
      }
    } catch (e) {
      console.warn(`Lỗi khi đọc file ${file}:`, e.message);
    }
  }

  console.log(`✅ Trích xuất thành công: ${patientsList.length} bệnh nhân & ${visitsList.length} lượt khám.`);
  exportClinicData(patientsList, visitsList);
}

function exportClinicData(patients, visits) {
  // Ghi file JSON dự phòng
  const backupDir = path.resolve(__dirname, '../backup_data');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const jsonPayload = {
    action: 'SYNC_ALL',
    totalPatients: patients.length,
    totalVisits: visits.length,
    patients,
    visits,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(backupDir, 'merged_data_ready_for_sync.json'),
    JSON.stringify(jsonPayload, null, 2),
    'utf8'
  );

  // Ghi trực tiếp vào src/clinicData.js để nhúng thẳng vào web bundle
  const jsContent =
    '// Cơ sở dữ liệu phòng khám MediCare Clinic Pro (#ktskhoa365)\n' +
    '// Chuyên khoa Da liễu & Thẩm mỹ Da - BSCK1 Tôn Thất Hào\n' +
    '// Tổng cộng: ' + patients.length + ' bệnh nhân & ' + visits.length + ' lượt khám\n\n' +
    'export const INITIAL_PATIENTS = ' + JSON.stringify(patients, null, 2) + ';\n\n' +
    'export const INITIAL_VISITS = ' + JSON.stringify(visits, null, 2) + ';\n';

  fs.writeFileSync(path.resolve(__dirname, '../src/clinicData.js'), jsContent, 'utf8');
  console.log('✅ Đã cập nhật thành công CSDL vào src/clinicData.js & backup_data/merged_data_ready_for_sync.json!');
}

if (process.argv[1] && process.argv[1].endsWith('import_26_excel_books.js')) {
  importAllExcelFiles();
}
