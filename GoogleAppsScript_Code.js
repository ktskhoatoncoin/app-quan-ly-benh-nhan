/**
 * ==============================================================================
 * HỆ THỐNG QUẢN LÝ PHÒNG KHÁM MEDICARE CLINIC PRO (v2.10)
 * Google Apps Script Web App API & Bảng Điều Khiển Tự Động Hóa (#ktskhoa365)
 * ==============================================================================
 * TÍNH NĂNG NỔI BẬT:
 * 1. SMART MERGE / UPSERT: Tự động cập nhật nếu đã có, thêm mới nếu chưa có.
 *    -> TUYỆT ĐỐI KHÔNG DÙNG sheet.clearContent() gây mất dữ liệu.
 * 2. BẢO TOÀN LINK GOOGLE DRIVE:
 *    -> Nếu trên Sheets đã có Link Drive ảnh xét nghiệm mà bản gửi lên bị trống,
 *       hệ thống giữ nguyên 100% link cũ quý giá của Bác sĩ!
 * 3. HỖ TRỢ ĐỌC/GHI 2 CHIỀU (doGet & doPost) tương thích Web App Vercel & script tiện ích.
 * 4. TÍCH HỢP QUÉT THƯ MỤC GOOGLE DRIVE TỰ ĐỘNG.
 * ==============================================================================
 */

// ID Thư mục gốc chứa ảnh cận lâm sàng/xét nghiệm bệnh nhân trên Google Drive
const ROOT_IMAGE_FOLDER_ID = "18BJKFc3Xoqtoiwx_5f5GTJbfjPT_U1T4";

// Cấu trúc tiêu đề chuẩn cho các Sheets
const HEADERS_BENH_NHAN = [
  "Ma_BN", "Ho_Ten", "Ngay_Sinh", "Gioi_Tinh", "SDT", "SDT_Nguoi_Than",
  "Can_Nang_Ban_Dau", "Nghe_Nghiep", "Dia_Chi", "Tien_Su_Benh", "Di_Ung_Thuoc",
  "CLS_Da_Lam", "Thuoc_Da_Dung", "Link_Drive_Anh", "Trang_Thai_Ho_So", "Ngay_Tao"
];

const HEADERS_LUOT_KHAM = [
  "Ma_Luot_Kham", "Ma_BN", "Ngay_Kham", "Chieu_Cao", "Can_Nang", "Huyet_Ap", "Mach",
  "Trieu_Chung", "Chan_Doan", "Chuyen_Khoa", "Hen_Tai_Kham", "Loi_Dan",
  "Dieu_Tri_Nguyen_Van", "Cong_Kham", "Trang_Thai_Thu"
];

const HEADERS_DON_THUOC = [
  "Ma_Luot_Kham", "Ma_BN", "Ten_Thuoc", "DVT", "Sang", "Trua", "Chieu", "Toi",
  "So_Ngay", "Don_Gia", "Cach_Dung"
];

const HEADERS_XET_NGHIEM = [
  "Ma_Luot_Kham", "Ma_BN", "Loai_Dich_Vu", "Ten_Chi_Dinh", "Ket_Qua", "Chi_Phi", "Trang_Thai"
];

const HEADERS_NHAT_KY = [
  "Thoi_Gian", "Ten_Bac_Si", "Ten_Phong_Kham", "So_Dien_Thoai", "Hanh_Dong", "So_Benh_Nhan", "Thiet_Bi"
];

// ==============================================================================
// 1. MENU TIỆN ÍCH TRÊN GOOGLE SHEETS
// ==============================================================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🏥 MediCare Clinic")
    .addItem("⚡ Quét & Gắn Link Drive Ảnh Bệnh Nhân", "quetVaCapNhatLinkDriveAnh")
    .addItem("📂 Mở Thư Mục Ảnh Gốc Trên Drive", "moThuMucAnhGoc")
    .addSeparator()
    .addItem("🔍 Khởi Tạo & Chuẩn Hóa Cấu Trúc Bảng", "khoiTaoCauTrucSheets")
    .addToUi();
}

function moThuMucAnhGoc() {
  const html = '<script>window.open("https://drive.google.com/drive/folders/' + ROOT_IMAGE_FOLDER_ID + '", "_blank");google.script.host.close();</script>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(250).setHeight(60), "Đang mở Drive...");
}

// ==============================================================================
// 2. HTTP GET API (Đọc dữ liệu từ Google Sheets về App hoặc Script)
// ==============================================================================
function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(15000);
  const callback = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : null;

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action.toLowerCase() : "read";

    if (action === "ping" || action === "health") {
      return jsonResponse({
        status: "success",
        message: "MediCare Clinic API online và sẵn sàng kết nối!",
        doctorName: "BSCK1. Tôn Thất Hào",
        specialty: "Chuyên khoa Da liễu & Thẩm mỹ Da",
        version: "2.10",
        timestamp: new Date().toISOString()
      }, callback);
    }

    // Đọc toàn bộ danh sách bệnh nhân, lượt khám, đơn thuốc
    const patients = readSheetAsJson(ss, "Benh_Nhan", HEADERS_BENH_NHAN);
    const visits = readSheetAsJson(ss, "Luot_Kham", HEADERS_LUOT_KHAM);
    const prescriptions = readSheetAsJson(ss, "Don_Thuoc_Chi_Tiet", HEADERS_DON_THUOC);
    const labs = readSheetAsJson(ss, "Xet_Nghiem_Chi_Phi", HEADERS_XET_NGHIEM);

    return jsonResponse({
      status: "success",
      doctorName: "BSCK1. Tôn Thất Hào",
      clinicName: "Phòng khám Da liễu & Thẩm mỹ Da - BSCK1 Tôn Thất Hào",
      totalPatients: patients.length,
      totalVisits: visits.length,
      totalPrescriptions: prescriptions.length,
      totalLabs: labs.length,
      patients: patients,
      visits: visits,
      prescriptions: prescriptions,
      labs: labs,
      timestamp: new Date().toISOString()
    }, callback);
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() }, callback);
  } finally {
    lock.releaseLock();
  }
}

// ==============================================================================
// 3. HTTP POST API (Ghi và Hợp nhất dữ liệu thông minh - Smart Upsert)
// ==============================================================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Khóa tối đa 30s để đảm bảo không xung đột khi nhiều thiết bị đồng bộ cùng lúc
  const hasLock = lock.tryLock(30000);
  if (!hasLock) {
    return jsonResponse({ status: "error", message: "Hệ thống đang bận xử lý một lượt đồng bộ khác, vui lòng thử lại sau 5 giây." });
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let payload = {};

    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter && e.parameter.data) {
      payload = JSON.parse(e.parameter.data);
    }

    const action = (payload.action || "").toUpperCase();

    // --------------------------------------------------------------------------
    // A. ĐỒNG BỘ THÔNG MINH BẢO TOÀN LINK DRIVE (SYNC_ALL / UPSERT / MERGE)
    // --------------------------------------------------------------------------
    if (action === "SYNC_ALL" || action === "UPSERT" || action === "MERGE" || action === "WRITE") {
      const incomingPatients = payload.patients || [];
      const incomingVisits = payload.visits || [];
      const incomingUsageLogs = payload.usageLogs || [];

      // 1. XỬ LÝ SHEET BENH_NHAN: SMART UPSERT DỰA TRÊN MA_BN & HO_TEN+NGAY_SINH
      const sBN = ensureSheetWithHeaders(ss, "Benh_Nhan", HEADERS_BENH_NHAN);
      const bnResult = smartMergePatients(sBN, incomingPatients);

      // 2. XỬ LÝ LƯỢT KHÁM, ĐƠN THUỐC, XÉT NGHIỆM
      const sLK = ensureSheetWithHeaders(ss, "Luot_Kham", HEADERS_LUOT_KHAM);
      const sDT = ensureSheetWithHeaders(ss, "Don_Thuoc_Chi_Tiet", HEADERS_DON_THUOC);
      const sDV = ensureSheetWithHeaders(ss, "Xet_Nghiem_Chi_Phi", HEADERS_XET_NGHIEM);
      const visitResult = smartMergeVisits(sLK, sDT, sDV, incomingVisits);

      // 3. GHI NHẬT KÝ ĐỒNG BỘ NẾU CÓ
      if (incomingUsageLogs.length > 0) {
        const sNK = ensureSheetWithHeaders(ss, "Nhat_Ky_Su_Dung", HEADERS_NHAT_KY);
        incomingUsageLogs.forEach(log => {
          sNK.appendRow([
            log.time || new Date().toLocaleString("vi-VN"),
            log.doctorName || "BSCK1 Tôn Thất Hảo",
            log.clinicName || "Phòng khám MediCare Clinic",
            "'" + (log.phone || ""),
            log.action || "Đồng bộ dữ liệu",
            log.patientCount || incomingPatients.length,
            log.device || "Web Vercel"
          ]);
        });
      }

      return jsonResponse({
        status: "success",
        message: "Hợp nhất dữ liệu thông minh thành công! Bảo toàn toàn bộ Link Drive ảnh xét nghiệm.",
        details: {
          patientsUpdated: bnResult.updatedCount,
          patientsInserted: bnResult.insertedCount,
          driveLinksPreserved: bnResult.preservedLinksCount,
          totalPatientsInSheet: bnResult.totalRows,
          visitsProcessed: visitResult.processedVisits
        },
        timestamp: new Date().toISOString()
      });
    }

    // --------------------------------------------------------------------------
    // A2. GHI TỨC THÌ 1 PHIẾU KHÁM & ĐƠN THUỐC (SAVE_VISIT / GHI_PHIEU)
    // --------------------------------------------------------------------------
    if (action === "SAVE_VISIT" || action === "GHI_PHIEU") {
      const patient = payload.patient;
      const visit = payload.visit;
      if (!patient || !visit) {
        return jsonResponse({ status: "error", message: "Thiếu thông tin bệnh nhân hoặc lượt khám" });
      }

      const sBN = ensureSheetWithHeaders(ss, "Benh_Nhan", HEADERS_BENH_NHAN);
      const bnResult = smartMergePatients(sBN, [patient]);

      const sLK = ensureSheetWithHeaders(ss, "Luot_Kham", HEADERS_LUOT_KHAM);
      const sDT = ensureSheetWithHeaders(ss, "Don_Thuoc_Chi_Tiet", HEADERS_DON_THUOC);
      const sDV = ensureSheetWithHeaders(ss, "Xet_Nghiem_Chi_Phi", HEADERS_XET_NGHIEM);
      const visitResult = smartMergeVisits(sLK, sDT, sDV, [visit]);

      return jsonResponse({
        status: "success",
        message: "Đã ghi nhận phiếu khám bệnh & đơn thuốc thành công vào Google Sheets!",
        patientName: patient.name,
        visitId: visit.visitId,
        timestamp: new Date().toISOString()
      });
    }

    // --------------------------------------------------------------------------
    // B. GHI NHẬT KÝ TRUY CẬP (LOG_ACCESS)
    // --------------------------------------------------------------------------
    if (action === "LOG_ACCESS" && payload.log) {
      const sNK = ensureSheetWithHeaders(ss, "Nhat_Ky_Su_Dung", HEADERS_NHAT_KY);
      const l = payload.log;
      sNK.appendRow([
        l.time || new Date().toLocaleString("vi-VN"),
        l.doctorName || "",
        l.clinicName || "",
        "'" + (l.phone || ""),
        l.action || "Truy cập ứng dụng",
        l.patientCount || 0,
        l.device || "Browser"
      ]);
      return jsonResponse({ status: "success", message: "Đã lưu nhật ký" });
    }

    return jsonResponse({ status: "error", message: "Hành động (action) không hợp lệ: " + action });

  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

// ==============================================================================
// 4. THUẬT TOÁN HỢP NHẤT THÔNG MINH BẢO TOÀN LINK DRIVE (CORE LOGIC)
// ==============================================================================
function smartMergePatients(sheet, incomingPatients) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => (h || "").toString().trim());

  // Tìm chỉ mục các cột quan trọng
  const colIdIdx = findColIndex(headers, ["Ma_BN", "Ma BN", "id"]);
  const colNameIdx = findColIndex(headers, ["Ho_Ten", "Họ và tên", "HoTen", "name"]);
  const colDobIdx = findColIndex(headers, ["Ngay_Sinh", "Năm sinh", "dob", "birthYear"]);
  const colLinkIdx = findColIndex(headers, ["Link_Drive_Anh", "Link Google Drive", "driveUrl", "imageFolderUrl"]);

  // Nạp toàn bộ bệnh nhân hiện có trên Google Sheets vào bộ nhớ đệm
  // Map 1: Theo Mã BN (ví dụ: 'bn0001')
  // Map 2: Theo Tên + Năm sinh chuẩn hóa (dùng khi Mã BN bị lệch)
  const existingRowsMapById = new Map();
  const existingRowsMapByNameDob = new Map();

  const allRows = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowId = normalizeKey(row[colIdIdx]);
    const rowName = normalizeKey(row[colNameIdx]);
    const rowDob = normalizeKey(row[colDobIdx]);
    const rowObj = { rowIndex: i - 1, rowData: [...row] };

    if (rowId) existingRowsMapById.set(rowId, rowObj);
    if (rowName) existingRowsMapByNameDob.set(rowName + "_" + rowDob, rowObj);
    allRows.push([...row]);
  }

  let updatedCount = 0;
  let insertedCount = 0;
  let preservedLinksCount = 0;

  incomingPatients.forEach(p => {
    const pId = normalizeKey(p.id || p.Ma_BN || "");
    const pName = normalizeKey(p.name || p.Ho_Ten || "");
    const pDob = normalizeKey(p.dob || p.Ngay_Sinh || p.birthYear || "");
    const incomingLink = (p.imageFolderUrl || p.driveUrl || p.Link_Drive_Anh || "").toString().trim();

    // Kiểm tra xem bệnh nhân đã tồn tại trên Sheet hay chưa
    let existingObj = null;
    if (pId && existingRowsMapById.has(pId)) {
      existingObj = existingRowsMapById.get(pId);
    } else if (pName && existingRowsMapByNameDob.has(pName + "_" + pDob)) {
      existingObj = existingRowsMapByNameDob.get(pName + "_" + pDob);
    }

    if (existingObj) {
      // ------------------------------------------------------------------------
      // TRƯỜNG HỢP 1: BỆNH NHÂN ĐÃ TỒN TẠI -> THỰC HIỆN SMART UPDATE
      // ------------------------------------------------------------------------
      const targetRow = allRows[existingObj.rowIndex];
      const existingDriveLink = (targetRow[colLinkIdx] || "").toString().trim();

      // NGUYÊN TẮC BẢO TOÀN LINK DRIVE:
      // - Nếu trên Sheets đã có link và dữ liệu mới gửi lên bị trống -> GIỮ NGUYÊN LINK TRÊN SHEETS!
      // - Chỉ cập nhật link mới nếu dữ liệu mới THỰC SỰ có đường dẫn hợp lệ.
      let finalLink = existingDriveLink;
      if (incomingLink && incomingLink !== "") {
        finalLink = incomingLink;
      } else if (existingDriveLink !== "") {
        preservedLinksCount++;
      }

      // Cập nhật thông tin y khoa và cá nhân mới
      setCellByHeader(targetRow, headers, ["Ho_Ten", "Họ và tên"], p.name || p.Ho_Ten || targetRow[colNameIdx]);
      setCellByHeader(targetRow, headers, ["Ngay_Sinh", "Năm sinh"], p.dob || p.Ngay_Sinh || targetRow[colDobIdx]);
      setCellByHeader(targetRow, headers, ["Gioi_Tinh", "Giới tính"], p.gender || p.Gioi_Tinh || "");
      setCellByHeader(targetRow, headers, ["SDT", "Điện thoại"], "'" + (p.phone || p.SDT || ""));
      setCellByHeader(targetRow, headers, ["SDT_Nguoi_Than"], "'" + (p.relativePhone || p.SDT_Nguoi_Than || ""));
      setCellByHeader(targetRow, headers, ["Can_Nang_Ban_Dau"], p.initialWeight || p.Can_Nang_Ban_Dau || "");
      setCellByHeader(targetRow, headers, ["Nghe_Nghiep"], p.occupation || p.Nghe_Nghiep || "");
      setCellByHeader(targetRow, headers, ["Dia_Chi", "Địa chỉ"], p.address || p.Dia_Chi || "");
      setCellByHeader(targetRow, headers, ["Tien_Su_Benh", "Tiền sử bệnh"], p.medicalHistory || p.Tien_Su_Benh || "");
      setCellByHeader(targetRow, headers, ["Di_Ung_Thuoc"], p.allergies || p.Di_Ung_Thuoc || "");
      setCellByHeader(targetRow, headers, ["CLS_Da_Lam"], p.pastParaclinical || p.CLS_Da_Lam || "");
      setCellByHeader(targetRow, headers, ["Thuoc_Da_Dung"], p.pastMedications || p.Thuoc_Da_Dung || "");
      setCellByHeader(targetRow, headers, ["Link_Drive_Anh", "Link Google Drive"], finalLink);
      setCellByHeader(targetRow, headers, ["Trang_Thai_Ho_So"], p.isArchived ? "Đã khỏi (Lưu trữ)" : (p.Trang_Thai_Ho_So || "Đang điều trị"));

      updatedCount++;
    } else {
      // ------------------------------------------------------------------------
      // TRƯỜNG HỢP 2: BỆNH NHÂN MỚI HOÀN TOÀN -> TẠO DÒNG MỚI (INSERT)
      // ------------------------------------------------------------------------
      const newRow = new Array(headers.length).fill("");
      const generatedId = (p.id || p.Ma_BN) ? (p.id || p.Ma_BN) : ("BN" + String(allRows.length + 1).padStart(4, "0"));

      setCellByHeader(newRow, headers, ["Ma_BN", "Ma BN", "id"], generatedId);
      setCellByHeader(newRow, headers, ["Ho_Ten", "Họ và tên"], p.name || p.Ho_Ten || "");
      setCellByHeader(newRow, headers, ["Ngay_Sinh", "Năm sinh"], p.dob || p.Ngay_Sinh || "");
      setCellByHeader(newRow, headers, ["Gioi_Tinh", "Giới tính"], p.gender || p.Gioi_Tinh || "");
      setCellByHeader(newRow, headers, ["SDT", "Điện thoại"], "'" + (p.phone || p.SDT || ""));
      setCellByHeader(newRow, headers, ["SDT_Nguoi_Than"], "'" + (p.relativePhone || p.SDT_Nguoi_Than || ""));
      setCellByHeader(newRow, headers, ["Can_Nang_Ban_Dau"], p.initialWeight || p.Can_Nang_Ban_Dau || "");
      setCellByHeader(newRow, headers, ["Nghe_Nghiep"], p.occupation || p.Nghe_Nghiep || "");
      setCellByHeader(newRow, headers, ["Dia_Chi", "Địa chỉ"], p.address || p.Dia_Chi || "");
      setCellByHeader(newRow, headers, ["Tien_Su_Benh", "Tiền sử bệnh"], p.medicalHistory || p.Tien_Su_Benh || "");
      setCellByHeader(newRow, headers, ["Di_Ung_Thuoc"], p.allergies || p.Di_Ung_Thuoc || "");
      setCellByHeader(newRow, headers, ["CLS_Da_Lam"], p.pastParaclinical || p.CLS_Da_Lam || "");
      setCellByHeader(newRow, headers, ["Thuoc_Da_Dung"], p.pastMedications || p.Thuoc_Da_Dung || "");
      setCellByHeader(newRow, headers, ["Link_Drive_Anh", "Link Google Drive"], incomingLink);
      setCellByHeader(newRow, headers, ["Trang_Thai_Ho_So"], p.isArchived ? "Đã khỏi (Lưu trữ)" : "Đang điều trị");
      setCellByHeader(newRow, headers, ["Ngay_Tao", "Thời gian cập nhật"], p.createdAt || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd"));

      allRows.push(newRow);

      const newObj = { rowIndex: allRows.length - 1, rowData: newRow };
      existingRowsMapById.set(normalizeKey(generatedId), newObj);
      if (pName) existingRowsMapByNameDob.set(pName + "_" + pDob, newObj);

      insertedCount++;
    }
  });

  // Ghi đồng loạt toàn bộ dữ liệu vào Sheet với 1 thao tác duy nhất (Tránh timeout)
  if (allRows.length > 0) {
    sheet.getRange(2, 1, allRows.length, headers.length).setValues(allRows);
  }

  return {
    updatedCount: updatedCount,
    insertedCount: insertedCount,
    preservedLinksCount: preservedLinksCount,
    totalRows: allRows.length
  };
}

// ==============================================================================
// 5. HỢP NHẤT LƯỢT KHÁM & ĐƠN THUỐC (Upsert theo Ma_Luot_Kham)
// ==============================================================================
function smartMergeVisits(sLK, sDT, sDV, incomingVisits) {
  if (!incomingVisits || incomingVisits.length === 0) {
    return { processedVisits: 0 };
  }

  const lkData = sLK.getDataRange().getValues();
  const lkHeaders = lkData[0].map(h => (h || "").toString().trim());
  const colVisitIdIdx = findColIndex(lkHeaders, ["Ma_Luot_Kham", "visitId"]);

  const existingVisitMap = new Map();
  const allVisits = [];
  for (let i = 1; i < lkData.length; i++) {
    const vId = normalizeKey(lkData[i][colVisitIdIdx]);
    if (vId) existingVisitMap.set(vId, i - 1);
    allVisits.push([...lkData[i]]);
  }

  const dtRowsToAppend = [];
  const dvRowsToAppend = [];

  incomingVisits.forEach(v => {
    const vId = normalizeKey(v.visitId || v.Ma_Luot_Kham || "");
    const vRow = new Array(lkHeaders.length).fill("");

    setCellByHeader(vRow, lkHeaders, ["Ma_Luot_Kham", "visitId"], v.visitId || v.Ma_Luot_Kham || "");
    setCellByHeader(vRow, lkHeaders, ["Ma_BN", "patientId"], v.patientId || v.Ma_BN || "");
    setCellByHeader(vRow, lkHeaders, ["Ngay_Kham", "visitDate"], v.visitDate || v.Ngay_Kham || "");
    setCellByHeader(vRow, lkHeaders, ["Chieu_Cao", "height"], v.height || v.Chieu_Cao || "");
    setCellByHeader(vRow, lkHeaders, ["Can_Nang", "weight"], v.weight || v.Can_Nang || "");
    setCellByHeader(vRow, lkHeaders, ["Huyet_Ap", "bp"], v.bp || v.Huyet_Ap || "");
    setCellByHeader(vRow, lkHeaders, ["Mach", "pulse"], v.pulse || v.Mach || "");
    setCellByHeader(vRow, lkHeaders, ["Trieu_Chung", "symptoms"], v.symptoms || v.Trieu_Chung || "");
    setCellByHeader(vRow, lkHeaders, ["Chan_Doan", "diagnosis"], v.diagnosis || v.Chan_Doan || "");
    setCellByHeader(vRow, lkHeaders, ["Chuyen_Khoa", "diseaseCategory"], v.diseaseCategory || v.Chuyen_Khoa || "");
    setCellByHeader(vRow, lkHeaders, ["Hen_Tai_Kham", "followUpDate"], v.followUpDate || v.Hen_Tai_Kham || "");
    setCellByHeader(vRow, lkHeaders, ["Loi_Dan", "doctorNotes"], v.doctorNotes || v.Loi_Dan || "");
    setCellByHeader(vRow, lkHeaders, ["Dieu_Tri_Nguyen_Van"], v.verbatimTreatment || v.Dieu_Tri_Nguyen_Van || "");
    setCellByHeader(vRow, lkHeaders, ["Cong_Kham", "consultationFee"], v.consultationFee || v.Cong_Kham || 0);
    setCellByHeader(vRow, lkHeaders, ["Trang_Thai_Thu", "paymentStatus"], v.paymentStatus || v.Trang_Thai_Thu || "Đã thu");

    if (vId && existingVisitMap.has(vId)) {
      allVisits[existingVisitMap.get(vId)] = vRow;
    } else {
      allVisits.push(vRow);
      existingVisitMap.set(vId, allVisits.length - 1);
    }

    // Thu thập đơn thuốc chi tiết
    if (v.prescriptions && Array.isArray(v.prescriptions)) {
      v.prescriptions.forEach(d => {
        dtRowsToAppend.push([
          v.visitId || v.Ma_Luot_Kham,
          v.patientId || v.Ma_BN,
          d.drugName || d.Ten_Thuoc || "",
          d.unit || d.DVT || "Viên",
          d.morning || d.Sang || 0,
          d.noon || d.Trua || 0,
          d.afternoon || d.Chieu || 0,
          d.evening || d.Toi || 0,
          d.days || d.So_Ngay || 1,
          d.price || d.Don_Gia || 0,
          d.note || d.Cach_Dung || ""
        ]);
      });
    }

    // Thu thập xét nghiệm chi tiết
    if (v.labs && Array.isArray(v.labs)) {
      v.labs.forEach(l => {
        dvRowsToAppend.push([
          v.visitId || v.Ma_Luot_Kham,
          v.patientId || v.Ma_BN,
          l.type || l.Loai_Dich_Vu || "Xét nghiệm",
          l.name || l.Ten_Chi_Dinh || "",
          l.result || l.Ket_Qua || "",
          l.cost || l.Chi_Phi || 0,
          l.status || l.Trang_Thai || "Đã có KQ"
        ]);
      });
    }
  });

  if (allVisits.length > 0) {
    sLK.getRange(2, 1, allVisits.length, lkHeaders.length).setValues(allVisits);
  }
  if (dtRowsToAppend.length > 0) {
    sDT.getRange(sDT.getLastRow() + 1, 1, dtRowsToAppend.length, HEADERS_DON_THUOC.length).setValues(dtRowsToAppend);
  }
  if (dvRowsToAppend.length > 0) {
    sDV.getRange(sDV.getLastRow() + 1, 1, dvRowsToAppend.length, HEADERS_XET_NGHIEM.length).setValues(dvRowsToAppend);
  }

  return { processedVisits: incomingVisits.length };
}

// ==============================================================================
// 6. QUÉT TỰ ĐỘNG THƯ MỤC GOOGLE DRIVE ĐỂ GẮN LINK ẢNH XÉT NGHIỆM
// ==============================================================================
function quetVaCapNhatLinkDriveAnh() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ensureSheetWithHeaders(ss, "Benh_Nhan", HEADERS_BENH_NHAN);

  let rootFolder;
  try {
    rootFolder = DriveApp.getFolderById(ROOT_IMAGE_FOLDER_ID);
  } catch (err) {
    SpreadsheetApp.getUi().alert("Lỗi truy cập thư mục Google Drive: " + err.message);
    return;
  }

  const patientFolders = rootFolder.getFolders();
  const driveMap = {};

  while (patientFolders.hasNext()) {
    const f = patientFolders.next();
    const folderName = f.getName().trim();
    driveMap[folderName.toLowerCase()] = {
      rawName: folderName,
      url: f.getUrl()
    };
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => (h || "").toString().trim());
  const colNameIdx = findColIndex(headers, ["Ho_Ten", "Họ và tên"]);
  const colLinkIdx = findColIndex(headers, ["Link_Drive_Anh", "Link Google Drive"]);

  const matchedNames = new Set();
  let updatedCount = 0;
  let preservedCount = 0;

  for (let i = 1; i < data.length; i++) {
    const pName = (data[i][colNameIdx] || "").toString().trim().toLowerCase();
    const currentLink = (data[i][colLinkIdx] || "").toString().trim();

    if (pName && driveMap[pName]) {
      // Cập nhật link mới từ Drive folder
      sheet.getRange(i + 1, colLinkIdx + 1).setValue(driveMap[pName].url);
      matchedNames.add(pName);
      updatedCount++;
    } else if (currentLink !== "") {
      preservedCount++;
    }
  }

  SpreadsheetApp.getUi().alert(
    "ĐÃ HOÀN TẤT ĐỒNG BỘ ẢNH GOOGLE DRIVE!\n\n" +
    "- Đã gắn link ảnh Drive cho: " + updatedCount + " bệnh nhân.\n" +
    "- Số bệnh nhân giữ nguyên link cũ: " + preservedCount + "\n" +
    "- Tổng số thư mục đã quét trong Drive: " + Object.keys(driveMap).length
  );
}

// ==============================================================================
// 7. CÁC HÀM TIỆN ÍCH HỖ TRỢ
// ==============================================================================
function ensureSheetWithHeaders(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#EBF2FB");
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#EBF2FB");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readSheetAsJson(ss, name, fallbackHeaders) {
  const sheet = ss.getSheetByName(name);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => (h || "").toString().trim());
  const rows = data.slice(1);

  return rows.map(row => {
    const item = {};
    headers.forEach((h, idx) => {
      item[h] = row[idx];
    });
    return item;
  });
}

function findColIndex(headers, possibleNames) {
  for (let i = 0; i < headers.length; i++) {
    const col = headers[i].toLowerCase();
    for (let j = 0; j < possibleNames.length; j++) {
      if (col === possibleNames[j].toLowerCase()) return i;
    }
  }
  return -1;
}

function setCellByHeader(row, headers, possibleNames, value) {
  const idx = findColIndex(headers, possibleNames);
  if (idx !== -1) {
    row[idx] = value;
  }
}

function normalizeKey(str) {
  if (!str) return "";
  return str.toString().trim().toLowerCase().replace(/\s+/g, " ");
}

function jsonResponse(data, callback) {
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(data) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function khoiTaoCauTrucSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheetWithHeaders(ss, "Benh_Nhan", HEADERS_BENH_NHAN);
  ensureSheetWithHeaders(ss, "Luot_Kham", HEADERS_LUOT_KHAM);
  ensureSheetWithHeaders(ss, "Don_Thuoc_Chi_Tiet", HEADERS_DON_THUOC);
  ensureSheetWithHeaders(ss, "Xet_Nghiem_Chi_Phi", HEADERS_XET_NGHIEM);
  ensureSheetWithHeaders(ss, "Nhat_Ky_Su_Dung", HEADERS_NHAT_KY);
  SpreadsheetApp.getUi().alert("Đã khởi tạo chuẩn 5 bảng dữ liệu cho MediCare Clinic Pro!");
}
