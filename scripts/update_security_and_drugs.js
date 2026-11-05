import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOP_100_DRUGS } from './generate_100_drugs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_SECRET_KEY = "MEDICARE_SECURE_TOKEN_2026_HAO_CLINIC_998877";

console.log('--- 1. Updating GoogleAppsScript_Code.js ---');

const gasPath = path.join(__dirname, '..', 'GoogleAppsScript_Code.js');
let gasCode = fs.readFileSync(gasPath, 'utf8');

// Ensure API_SECRET_KEY is at the top
if (!gasCode.includes('API_SECRET_KEY')) {
  gasCode = gasCode.replace(
    '// ID Thư mục gốc chứa ảnh',
    `// Khóa bảo mật API bắt buộc (Chỉ ứng dụng MediCare Clinic Pro có khóa này mới được phép đồng bộ/đọc/ghi dữ liệu)
const API_SECRET_KEY = "${API_SECRET_KEY}";

// ID Thư mục gốc chứa ảnh`
  );
}

// Add snapshot backup to onOpen
if (!gasCode.includes('taoBanSaoLuuDuPhong')) {
  gasCode = gasCode.replace(
    '.addItem("📂 Mở Thư Mục Ảnh Gốc Trên Drive", "moThuMucAnhGoc")',
    `.addItem("📂 Mở Thư Mục Ảnh Gốc Trên Drive", "moThuMucAnhGoc")
    .addItem("🛡️ Tạo Bản Sao Lưu Dự Phòng Tức Thì (Snapshot Backup)", "taoBanSaoLuuDuPhong")`
  );
}

// Add taoBanSaoLuuDuPhong function
if (!gasCode.includes('function taoBanSaoLuuDuPhong()')) {
  const backupFunc = `
// ==============================================================================
// 1.1 TỰ ĐỘNG TẠO BẢN SAO LƯU DỰ PHÒNG (SNAPSHOT BACKUP)
// ==============================================================================
function taoBanSaoLuuDuPhong() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const now = new Date();
  const timeStr = Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT+7", "yyyyMMdd_HHmm");
  const backupPrefix = "Backup_" + timeStr;

  let createdCount = 0;
  const sheetsToBackup = ["Benh_Nhan", "Luot_Kham", "Don_Thuoc_Chi_Tiet"];
  
  sheetsToBackup.forEach(function(sheetName) {
    const s = ss.getSheetByName(sheetName);
    if (s && s.getLastRow() > 0) {
      const copy = s.copyTo(ss);
      copy.setName(sheetName.substring(0, 3) + "_" + backupPrefix);
      copy.setTabColor("#7FA9DE");
      createdCount++;
    }
  });

  SpreadsheetApp.getUi().alert(
    "ĐÃ TẠO BẢN SAO LƯU DỰ PHÒNG AN TOÀN!\\n\\n" +
    "- Mã bản sao lưu: " + backupPrefix + "\\n" +
    "- Đã nhân bản " + createdCount + " bảng dữ liệu (Bệnh nhân, Lượt khám, Đơn thuốc).\\n" +
    "- Toàn bộ dữ liệu của Bác sĩ đã được đóng băng an toàn thành các Sheet riêng biệt."
  );
}
`;
  gasCode = gasCode.replace('// 1. MENU TIỆN ÍCH TRÊN GOOGLE SHEETS', backupFunc + '\n// 1. MENU TIỆN ÍCH TRÊN GOOGLE SHEETS');
}

// Add doGet security token check
if (!gasCode.includes('API_SECRET_KEY hợp lệ để đọc dữ liệu bệnh nhân')) {
  const doGetAuthCheck = `
    if (action === "ping" || action === "health") {
      return jsonResponse({
        status: "success",
        message: "MediCare Clinic API online và sẵn sàng kết nối!",
        doctorName: "BSCK1. Tôn Thất Hào",
        specialty: "Chuyên khoa Da liễu & Thẩm mỹ Da",
        version: "2.11 - Secure Shield",
        timestamp: new Date().toISOString()
      }, callback);
    }

    // Xác thực khóa bảo mật API_SECRET_KEY (Chống lộ thông tin bệnh nhân ra bên ngoài)
    const clientKey = (e && e.parameter && (e.parameter.apiKey || e.parameter.key || e.parameter.token)) || "";
    if (API_SECRET_KEY && clientKey !== API_SECRET_KEY) {
      return jsonResponse({
        status: "error",
        code: 403,
        message: "Truy cập bị từ chối: Cần có Khóa bảo mật API_SECRET_KEY hợp lệ để đọc dữ liệu bệnh nhân!"
      }, callback);
    }`;

  gasCode = gasCode.replace(
    /if \(action === "ping" \|\| action === "health"\) \{[\s\S]*?timestamp: new Date\(\)\.toISOString\(\)\s*\}, callback\);\s*\}/,
    doGetAuthCheck
  );
}

// Add doPost security token check and forbid deletion
if (!gasCode.includes('Khóa bảo mật API_SECRET_KEY không hợp lệ')) {
  const doPostAuthCheck = `
    const action = (payload.action || "").toUpperCase();

    // 0. BẢO MẬT: XÁC THỰC KHÓA API_SECRET_KEY
    const clientKey = payload.apiKey || (e && e.parameter && e.parameter.apiKey) || "";
    if (API_SECRET_KEY && clientKey !== API_SECRET_KEY) {
      return jsonResponse({
        status: "error",
        code: 403,
        message: "Truy cập bị từ chối: Khóa bảo mật API_SECRET_KEY không hợp lệ hoặc bị thiếu!"
      });
    }

    // 0.1 BẢO MẬT: CHẶN TOÀN BỘ CÁC LỆNH XÓA DỮ LIỆU HÀNG LOẠT
    if (action === "CLEAR" || action === "DELETE" || action === "DROP" || action === "TRUNCATE") {
      return jsonResponse({
        status: "error",
        code: 400,
        message: "Thao tác xóa hàng loạt bị cấm tuyệt đối vì lý do an toàn dữ liệu phòng khám!"
      });
    }
`;

  gasCode = gasCode.replace(
    'const action = (payload.action || "").toUpperCase();',
    doPostAuthCheck
  );
}

fs.writeFileSync(gasPath, gasCode, 'utf8');
console.log('✅ GoogleAppsScript_Code.js updated successfully!');


console.log('\n--- 2. Updating src/medicare_clinic_pro.jsx ---');

const jsxPath = path.join(__dirname, '..', 'src', 'medicare_clinic_pro.jsx');
let jsxCode = fs.readFileSync(jsxPath, 'utf8');

// Replace DRUG_CATALOG with 100 medications + add API_SECRET_KEY
let drugCatalogStart = jsxCode.indexOf('// Danh mục thuốc mẫu phục vụ kê toa nhanh');
if (drugCatalogStart === -1) {
  drugCatalogStart = jsxCode.indexOf('// Khóa bảo mật API đồng bộ Google Sheets');
}
const drugCatalogEnd = jsxCode.indexOf('// Danh mục xét nghiệm / X-Quang mẫu');

if (drugCatalogStart !== -1 && drugCatalogEnd !== -1) {
  const formatted100Drugs = `// Khóa bảo mật API đồng bộ Google Sheets (Chống người lạ can thiệp hoặc sửa xóa dữ liệu trái phép)
export const API_SECRET_KEY = "${API_SECRET_KEY}";

// Danh mục 100 loại thuốc thực tế thường dùng nhất của BSCK1 Tôn Thất Hào (Chuyên khoa Da liễu & Đa khoa)
export const DRUG_CATALOG = ` + JSON.stringify(TOP_100_DRUGS, null, 2) + `;\n\n`;

  jsxCode = jsxCode.slice(0, drugCatalogStart) + formatted100Drugs + jsxCode.slice(drugCatalogEnd);
}

// Update handleSaveCurrentVisitToSheet to include apiKey
if (!jsxCode.includes("apiKey: API_SECRET_KEY,\n            action: 'SAVE_VISIT'")) {
  jsxCode = jsxCode.replace(
    "action: 'SAVE_VISIT',",
    "apiKey: API_SECRET_KEY,\n            action: 'SAVE_VISIT',"
  );
}

// Update handleSyncToGoogleSheets to include apiKey
if (!jsxCode.includes("apiKey: API_SECRET_KEY,\n            action: 'SYNC_ALL'")) {
  jsxCode = jsxCode.replace(
    "action: 'SYNC_ALL',",
    "apiKey: API_SECRET_KEY,\n            action: 'SYNC_ALL',"
  );
}

// Update LOG_ACCESS fetch to include apiKey
if (!jsxCode.includes("apiKey: API_SECRET_KEY,\n            action: 'LOG_ACCESS'")) {
  jsxCode = jsxCode.replace(
    "action: 'LOG_ACCESS',",
    "apiKey: API_SECRET_KEY,\n            action: 'LOG_ACCESS',"
  );
}

// Update the embedded appsScriptCode string in the JSX component
const appsScriptDecl = 'const appsScriptCode = `';
const appsScriptStart = jsxCode.indexOf(appsScriptDecl);
if (appsScriptStart !== -1) {
  const nextBacktick = jsxCode.indexOf('`;', appsScriptStart + appsScriptDecl.length);
  if (nextBacktick !== -1) {
    // Escape backticks or template strings in gasCode if any
    const safeGasCode = gasCode.replace(/`/g, '\\`').replace(/\${/g, '\\${');
    jsxCode = jsxCode.slice(0, appsScriptStart + appsScriptDecl.length) + safeGasCode + jsxCode.slice(nextBacktick);
    console.log('✅ appsScriptCode in JSX modal updated!');
  }
}

// Insert security banner in Tab 6 if not already present
if (!jsxCode.includes('HỆ THỐNG BẢO VỆ DỮ LIỆU 3 LỚP')) {
  const matchAppsTab = jsxCode.match(/sheetPreviewTab === 'Apps_Script' && \(\s*<div className="space-y-3">/);
  if (matchAppsTab) {
    const banner = `${matchAppsTab[0]}
                    {/* HỘP BẢO MẬT & BẢO VỆ DỮ LIỆU */}
                    <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                        <span className="text-base">🛡️</span>
                        <span>HỆ THỐNG BẢO VỆ DỮ LIỆU 3 LỚP (BẢO VỆ GOOGLE DRIVE & GOOGLE SHEETS)</span>
                        <span className="ml-auto text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">Đang bật bảo vệ</span>
                      </div>
                      <p className="text-amber-800 text-[11.5px] leading-relaxed">
                        Để bảo vệ tuyệt đối dữ liệu phòng khám, chống nguy cơ người lạ có đường link xóa hoặc phá hoại dữ liệu của Bác sĩ:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
                        <div className="bg-white p-2.5 border border-amber-200 rounded shadow-xs">
                          <div className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                            <span className="text-emerald-600 font-black">1.</span> Khóa xác thực API riêng:
                          </div>
                          <div className="text-slate-600">Đã tích hợp mã bí mật trong App và Google Apps Script. Bất kỳ ai không có khóa này đều bị từ chối 403 Forbidden.</div>
                          <div className="mt-1 font-mono text-[9.5px] bg-slate-100 p-1 text-slate-700 select-all rounded border border-slate-200">{API_SECRET_KEY}</div>
                        </div>
                        <div className="bg-white p-2.5 border border-amber-200 rounded shadow-xs">
                          <div className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                            <span className="text-blue-600 font-black">2.</span> Google Sheets: "Hạn chế"
                          </div>
                          <div className="text-slate-600">Mở Google Sheets &gt; Chia sẻ &gt; Đặt quyền thành <b>"Hạn chế" (Restricted)</b>. Chỉ có tài khoản BS Hào mới mở được, không ai trên mạng vào xem/sửa được!</div>
                        </div>
                        <div className="bg-white p-2.5 border border-amber-200 rounded shadow-xs">
                          <div className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                            <span className="text-purple-600 font-black">3.</span> Thư mục Drive: "Người xem"
                          </div>
                          <div className="text-slate-600">Mở thư mục ảnh Drive &gt; Chia sẻ &gt; Chọn <b>"Người xem" (Viewer)</b>. Người ngoài có link chỉ được xem và tải ảnh, TUYỆT ĐỐI KHÔNG XÓA ĐƯỢC!</div>
                        </div>
                      </div>
                    </div>`;

    jsxCode = jsxCode.replace(matchAppsTab[0], banner);
    console.log('✅ Added Security Banner to modal Tab 6!');
  }
}

fs.writeFileSync(jsxPath, jsxCode, 'utf8');
console.log('✅ src/medicare_clinic_pro.jsx updated successfully!');
