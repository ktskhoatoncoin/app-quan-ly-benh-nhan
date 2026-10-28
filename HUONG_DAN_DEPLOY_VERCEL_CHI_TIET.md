# 🏥 HƯỚNG DẪN TRIỂN KHAI VERCEL & ĐỒNG BỘ DỮ LIỆU GOOGLE SHEETS
## Hệ thống Quản Lý Phòng Khám Da Liễu & Thẩm Mỹ Da — BSCK1 Tôn Thất Hào (v2.10)
**Tác giả & Bản quyền:** `#ktskhoa365` — **Hotline/Zalo:** `0908297118`

---

## 📌 MỤC LỤC
1. [Tổng quan Kiến trúc Hệ thống](#1-tổng-quan-kiến-trúc-hệ-thống)
2. [Cập nhật Google Apps Script API v2.10 (Đồng bộ 2 chiều & Bảo toàn Link Drive)](#2-cập-nhật-google-apps-script-api-v210)
3. [Xử lý & Nhúng dữ liệu từ 26 file Excel vào Hệ thống](#3-xử-lý--nhúng-dữ-liệu-từ-26-file-excel-vào-hệ-thống)
4. [Chuẩn hóa Mẫu In Đơn Thuốc A5/A4 & Xuất PDF Vector](#4-chuẩn-hóa-mẫu-in-đơn-thuốc-a5a4--xuất-pdf-vector)
5. [Đẩy mã nguồn lên GitHub & Tự động Deploy trên Vercel](#5-đẩy-mã-nguồn-lên-github--tự-động-deploy-trên-vercel)
6. [Cơ chế Bảo toàn Dữ liệu & Khắc phục Sự cố](#6-cơ-chế-bảo-toàn-dữ-liệu--khắc-phục-sự-cố)

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG

Dự án được xây dựng theo mô hình **Cloud-Native Serverless** hiện đại:
* **Bác sĩ phụ trách:** **BSCK1. Tôn Thất Hào** (Chuyên khoa Da liễu & Thẩm mỹ Da).
* **Frontend Web App**: React 18 + Vite + Tailwind CSS (Deploy trên Vercel CDN toàn cầu, tốc độ tải trang < 0.5s).
* **Database Backend**: Google Sheets (truy cập qua Google Apps Script Web App API 2 chiều `doGet` / `doPost`).
* **Medical Imaging Storage**: Google Drive (Thư mục ảnh cận lâm sàng, X-Quang, da liễu gắn trực tiếp vào từng hồ sơ bệnh nhân).
  - Thư mục gốc Drive: `https://drive.google.com/drive/folders/18BJKFc3Xoqtoiwx_5f5GTJbfjPT_U1T4?usp=drive_link`
* **Mẫu In & Xuất Đơn Thuốc**: Chuẩn CSS `@media print` A5/A4 và xuất ảnh PNG/PDF vector 300 DPI sắc nét gửi Zalo.
* **CSDL Nhúng Sẵn**: Tích hợp toàn bộ 522 bệnh nhân thật và 2.321 lượt khám thực tế từ 26 file Excel của BS Hào.

---

## 2. CẬP NHẬT GOOGLE APPS SCRIPT API v2.10
*(BƯỚC BẮT BUỘC ĐỂ KẾT NỐI VỚI GOOGLE SHEETS & BẢO TOÀN LINK DRIVE)*

Bản nâng cấp v2.10 bổ sung:
* `doGet`: Đọc toàn bộ danh sách bệnh nhân, lượt khám, đơn thuốc, hỗ trợ JSONP chống chặn CORS.
* `doPost`: Hỗ trợ cả 2 chế độ:
  - `action: "SAVE_VISIT"`: Ghi tức thì 1 phiếu khám & đơn thuốc khi bấm nút **"Ghi phiếu này vào Google Sheets"** (tốc độ < 1 giây).
  - `action: "SYNC_ALL"`: Đồng bộ hàng loạt bảo toàn 100% link Drive ảnh xét nghiệm.

### Các bước thực hiện:
1. Mở file **Google Sheets** của phòng khám trên trình duyệt.
2. Trên thanh menu, chọn: **Tiện ích mở rộng (Extensions)** → **Apps Script**.
3. Mở file mã nguồn `GoogleAppsScript_Code.js` trong thư mục dự án này, copy toàn bộ nội dung.
4. Xóa hết mã cũ trong trình soạn thảo Apps Script và dán toàn bộ mã mới vào.
5. Bấm biểu tượng **💾 Lưu dự án (Save)**.
6. Bấm nút **Triển khai (Deploy)** ở góc trên bên phải → Chọn **Quản lý bản triển khai (Manage deployments)**:
   * Chọn bản triển khai Web App hiện tại → Bấm biểu tượng **Chỉnh sửa (Bút chì)**.
   * Tại mục **Phiên bản (Version)**: Chọn **Phiên bản mới (New version)**.
   * Tại mục **Ai có quyền truy cập (Who has access)**: Đảm bảo là **Bất kỳ ai (Anyone)**.
   * Bấm **Triển khai (Deploy)**.
   *(Nếu tạo mới, chọn Triển khai mới → Chọn loại Ứng dụng web → Quyền truy cập: Bất kỳ ai).*
7. Sao chép lại **URL Ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).
8. Dán URL này vào mục **Cài đặt Google Sheets** tại Tab 5 hoặc cửa sổ cấu hình của ứng dụng.

---

## 3. XỬ LÝ & NHÚNG DỮ LIỆU TỪ 26 FILE EXCEL VÀO HỆ THỐNG

Dự án cung cấp script tự động đọc và chuẩn hóa gói 26 file Excel của Bác sĩ Hào (`BOOK A.xlsx` đến `BOOK Y1.xlsx`):

### Chạy lệnh trích xuất:
```bash
npm run import-excel
```
*hoặc:*
```bash
node scripts/import_26_excel_books.js
```

### Cơ chế hoạt động:
1. **Quét 26 file Excel**: Đọc tự động tất cả các sheet bệnh án (loại bỏ sheet danh mục thuốc).
2. **Chuẩn hóa thông tin**: Tách thông tin hành chính (Họ tên, Tuổi, Giới tính, Địa chỉ, SĐT, Tiền sử, Dị ứng) và danh sách lượt khám (Ngày khám, Lâm sàng da liễu, Chẩn đoán, Đơn thuốc, Viện phí).
3. **Gắn tự động Link Drive**: Tạo đường dẫn trực tiếp mở thư mục ảnh theo tên bệnh nhân:
   `https://drive.google.com/drive/folders/18BJKFc3Xoqtoiwx_5f5GTJbfjPT_U1T4?q=[Tên_BN]`
4. **Nhúng trực tiếp vào App**: Tạo file [src/clinicData.js](file:///j:/AI-LAB/app-quan-ly-benh-nhan/app-quan-ly-benh-nhan-github/src/clinicData.js) giúp người dùng mở app là có sẵn 522 bệnh nhân mà không bao giờ bị trắng trang.

---

## 4. CHUẨN HÓA MẪU IN ĐƠN THUỐC A5/A4 & XUẤT PDF VECTOR

Mẫu in đơn thuốc được chuẩn hóa theo đúng market đã duyệt (`Mau_Don_Thuoc_BSCK1_Ton_That_Hao.png`):
- **Header**:
  - Logo chữ thập đỏ chuẩn y tế.
  - Thông tin đơn vị: `SỞ Y TẾ TP. HỒ CHÍ MINH`, `BỆNH VIỆN ĐA KHOA NHÀ BÈ`, `B. Khám Nội 1 • BSCK1. Tôn Thất Hào`.
  - **Bỏ hoàn toàn mã vạch Barcode**, thay bằng Số toa, Mã BN, BHYT gọn gàng.
- **Thân đơn thuốc**:
  - Bảng thuốc chứa từ 6 đến 12 loại thuốc trên cùng một trang A5 mà không bị nhảy trang.
  - Đường chấm nối giữa Tên thuốc và Số lượng (`. . . . . . 30 Viên`).
  - Hướng dẫn dùng thuốc phân biệt rõ: `Uống: Sáng...` hoặc `Bôi ngoài da: Sáng... Tối...`.
- **Footer**:
  - Lời dặn dò, lưu ý sinh hoạt da liễu, ngày hẹn tái khám.
  - QR Code hỗ trợ quét đặt lịch hẹn tái khám.
  - Ngày tháng năm, BÁC SĨ ĐIỀU TRỊ, chữ ký mực xanh và họ tên in hoa: **BSCK1. TÔN THẤT HÀO**.
- **In ấn & Xuất file**:
  - Bấm **"In ra giấy"**: Gọi `window.print()` chuẩn CSS `@page { size: A5 portrait; }`, chỉ in đúng đơn thuốc.
  - Bấm **"Xuất Ảnh (.png)"**: Xuất ảnh 300 DPI sắc nét gửi ngay qua Zalo.
  - Bấm **"Xuất file PDF"**: Tạo file PDF A5 chuẩn vector rõ chữ không mờ scan.

---

## 5. ĐẨY MÃ NGUỒN LÊN GITHUB & TỰ ĐỘNG DEPLOY TRÊN VERCEL

### Các lệnh thực hiện:
```bash
# 1. Kiểm tra trạng thái
git status

# 2. Thêm file vào staging
git add .

# 3. Commit phiên bản
git commit -m "feat: chuẩn hóa hệ thống phòng khám Da liễu BSCK1 Tôn Thất Hào"

# 4. Đẩy lên nhánh main của GitHub
git push origin main
```

### Tự động hóa CI/CD trên Vercel:
* Mỗi khi bạn chạy `git push origin main`, Vercel sẽ tự động kích hoạt Webhook, biên dịch mã nguồn với Vite (`npm run build`) và cập nhật trang web trong vòng **12 đến 15 giây**.
* Trang web chính thức: **https://app-quan-ly-benh-nhan-github.vercel.app/**

---

## 6. CƠ CHẾ BẢO TOÀN DỮ LIỆU & KHẮC PHỤC SỰ CỐ

### A. Dữ liệu khám bệnh hàng ngày có bị mất khi Deploy Vercel lại không?
* **KHÔNG BAO GIỜ!**
* Dữ liệu khám bệnh hàng ngày, toa thuốc và sinh hiệu được lưu trực tiếp trên **Google Sheets** và bộ nhớ máy trạm (**LocalStorage**).
* Việc cập nhật code trên GitHub & Vercel chỉ thay đổi phần giao diện hiển thị, hoàn toàn độc lập với dữ liệu bệnh nhân.

### B. Mở thư mục ảnh Drive của từng bệnh nhân:
* Tại Danh sách bệnh nhân (Tab 1) hoặc Hồ sơ chi tiết (Tab 2), bác sĩ chỉ cần bấm vào biểu tượng **📁 Ảnh Drive ↗** để xem ngay các hình ảnh da liễu, xét nghiệm, X-Quang của bệnh nhân đó trên Google Drive.

### C. Nút nạp CSDL 522 BN Gốc:
* Nếu mở app trên một máy mới hoặc muốn khôi phục kho dữ liệu 522 bệnh nhân và 2.321 lượt khám gốc, chỉ cần vào **Tab 5 (Thiết lập)** và bấm nút **`🏥 Nạp CSDL 522 BN Gốc`**.

---
*Phần mềm được thiết kế và phát triển bởi `#ktskhoa365` — Hotline/Zalo: `0908297118`*
