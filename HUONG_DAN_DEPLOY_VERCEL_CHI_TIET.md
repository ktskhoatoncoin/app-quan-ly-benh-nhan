# 🏥 HƯỚNG DẪN TRIỂN KHAI VERCEL & ĐỒNG BỘ DỮ LIỆU GOOGLE SHEETS
## Hệ thống Quản Lý Phòng Khám MediCare Clinic Pro (v2.10)
**Tác giả & Bản quyền:** `#ktskhoa365` — **Hotline/Zalo:** `0908297118`

---

## 📌 MỤC LỤC
1. [Tổng quan Kiến trúc Hệ thống](#1-tổng-quan-kiến-trúc-hệ-thống)
2. [Cập nhật Google Apps Script API v2.10 (Bảo toàn Link Google Drive)](#2-cập-nhật-google-apps-script-api-v210)
3. [Gộp dữ liệu Excel vào Google Sheets (Smart Merge)](#3-gộp-dữ-liệu-excel-vào-google-sheets-smart-merge)
4. [Đẩy mã nguồn lên GitHub](#4-đẩy-mã-nguồn-lên-github)
5. [Cấu hình & Tự động Deploy trên Vercel](#5-cấu-hình--tự-động-deploy-trên-vercel)
6. [Cơ chế Bảo toàn Dữ liệu & Khắc phục Sự cố](#6-cơ-chế-bảo-toàn-dữ-liệu--khắc-phục-sự-cố)

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG

Dự án được xây dựng theo mô hình **Cloud-Native Serverless** hiện đại:
* **Frontend Web App**: React 18 + Vite + Tailwind CSS (Deploy trên Vercel CDN toàn cầu, tốc độ tải trang < 0.5s).
* **Database Backend**: Google Sheets (truy cập qua Google Apps Script Web App API 2 chiều `doGet` / `doPost`).
* **Medical Imaging Storage**: Google Drive (Thư mục ảnh cận lâm sàng, X-Quang, siêu âm, xét nghiệm gắn trực tiếp vào từng hồ sơ bệnh nhân).
* **Bản Offline / Standalone**: File `MediCare_Clinic_Pro_Standalone.html` chạy độc lập khi mất mạng internet.

---

## 2. CẬP NHẬT GOOGLE APPS SCRIPT API v2.10
*(BƯỚC BẮT BUỘC ĐỂ BẢO VỆ LINK DRIVE ẢNH XÉT NGHIỆM)*

Cơ chế cũ dùng lệnh `sheet.clearContent()` sẽ xóa sạch link Google Drive mà bác sĩ đã nhập tay khi import file Excel mới. Bản nâng cấp v2.10 sử dụng cơ chế **Smart Upsert** (Update nếu có, Insert nếu mới):

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

---

## 3. GỘP DỮ LIỆU EXCEL VÀO GOOGLE SHEETS (SMART MERGE)

Khi có file Excel dữ liệu mới từ Bác sĩ Hảo (`DATA_BENH_NHAN_BS_HAO_IMPORT.xlsx`), bạn KHÔNG CẦN copy-paste thủ công. Hãy sử dụng script tự động hóa:

### Chạy lệnh:
```bash
npm run merge-excel
```
*hoặc:*
```bash
node merge_excel_to_sheets.js
```

### Cơ chế hoạt động của Script:
1. **Tự động sao lưu**: Đọc toàn bộ dữ liệu hiện có trên Google Sheets và lưu thành file dự phòng tại `backup_data/backup_sheets_before_merge_[timestamp].json`.
2. **Đọc file Excel**: Quét cả 3 sheets: `Benh_Nhan`, `Luot_Kham`, `Don_Thuoc_Chi_Tiet`.
3. **Smart Merge**:
   * Nếu bệnh nhân đã có trên Sheets và đã có Link Google Drive: **Giữ nguyên 100% link Drive cũ**.
   * Cập nhật các thông tin y khoa mới: chẩn đoán, toa thuốc, ngày khám, sinh hiệu.
   * Nếu là bệnh nhân mới: Thêm dòng mới vào cuối bảng.
   * Không bao giờ xóa bất kỳ bệnh nhân nào đang có trên Sheets.
4. **Đồng bộ hàng loạt**: Đẩy toàn bộ dữ liệu hợp nhất lên Google Sheets an toàn và nhanh chóng.

---

## 4. ĐẨY MÃ NGUỒN LÊN GITHUB

Mã nguồn đã được lọc sạch các file rác, file nhị phân và file dữ liệu nhạy cảm qua `.gitignore`.

### Các lệnh thực hiện:
```bash
# 1. Kiểm tra trạng thái
git status

# 2. Thêm toàn bộ code sạch vào staging
git add .

# 3. Commit phiên bản đóng gói chuẩn
git commit -m "feat: standard Vite+React packaging & smart merge preserving Drive links (#ktskhoa365)"

# 4. Đẩy lên nhánh main của GitHub
git push origin main
```

---

## 5. CẤU HÌNH & TỰ ĐỘNG DEPLOY TRÊN VERCEL

Dự án đã được chuẩn hóa để Vercel tự động nhận diện và build tối ưu:

### Thiết lập trên Vercel Dashboard:
1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng GitHub.
2. Bấm **Add New...** → **Project**.
3. Chọn Repository `app-quan-ly-benh-nhan` → Bấm **Import**.
4. Cấu hình dự án (**Project Settings**):
   * **Framework Preset**: `Vite` (Hệ thống tự động phát hiện).
   * **Root Directory**: `./` (để mặc định).
   * **Build Command**: `npm run build` (mặc định của Vite).
   * **Output Directory**: `dist` (mặc định của Vite).
   * **Install Command**: `npm install`.
5. Bấm **Deploy**. Sau khoảng 30 - 45 giây, dự án sẽ hoàn tất triển khai với chứng chỉ SSL HTTPS miễn phí.

### Tự động hóa CI/CD:
* Mỗi khi bạn chạy `git push origin main`, Vercel sẽ tự động kích hoạt Webhook, build lại bản phát hành mới nhất và cập nhật trang web trong vòng chưa tới 1 phút mà không làm gián đoạn người dùng.

---

## 6. CƠ CHẾ BẢO TOÀN DỮ LIỆU & KHẮC PHỤC SỰ CỐ

### A. Dữ liệu bệnh nhân nhập hàng ngày có bị mất khi Deploy Vercel lại không?
* **KHÔNG BAO GIỜ!**
* Dữ liệu khám bệnh hàng ngày, toa thuốc và sinh hiệu được lưu trực tiếp trên **Google Sheets** và bộ nhớ máy trạm (**LocalStorage**).
* Việc cập nhật code trên GitHub & Vercel chỉ thay đổi phần giao diện hiển thị, hoàn toàn độc lập với dữ liệu bệnh nhân.

### B. Bác sĩ muốn xuất đơn thuốc gửi cho bệnh nhân:
* **Xuất file ảnh (.png)**: Bấm nút "Xuất file ảnh" trong cửa sổ xem đơn thuốc. File ảnh khổ A5 sắc nét được tạo ngay lập tức để gửi qua Zalo/Viber.
* **Xuất file PDF (.pdf)**: Bấm nút "Xuất PDF" để tải file PDF in chuẩn y khoa.

### C. Mở thư mục ảnh Drive của từng bệnh nhân:
* Tại Danh sách bệnh nhân (Tab 1) hoặc Hồ sơ chi tiết (Tab 2), bác sĩ chỉ cần bấm vào biểu tượng **📁 Mở ảnh Drive** để xem ngay các phim chụp X-Quang, siêu âm và kết quả cận lâm sàng của bệnh nhân đó.

---
*Chúc Phòng khám MediCare Clinic Pro hoạt động hiệu quả và phục vụ bệnh nhân tốt nhất!*
