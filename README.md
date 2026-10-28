# 🏥 MediCare Clinic Pro - Hệ thống Quản lý Phòng khám Tư nhân (v2.10)

**Thiết kế & Phát triển bởi:** `#ktskhoa365` — **Hotline/Zalo:** `0908297118`

---

## 📂 Cấu trúc Dự án Chuẩn Hóa (Vite + React + Vercel + Google Cloud)

Dự án đã được đóng gói chuẩn công nghiệp để đẩy thẳng lên **GitHub** và tự động CI/CD trên **Vercel**:

```
app-quan-ly-benh-nhan/
├── src/
│   ├── medicare_clinic_pro.jsx       # Mã nguồn chính React (v2.10 Full-featured)
│   ├── main.jsx                      # Entrypoint React 18 mount DOM
│   └── index.css                     # Tailwind CSS + custom print & scrollbar
├── index.html                        # Vite entry HTML
├── MediCare_Clinic_Pro_Standalone.html # Bản Standalone chạy Offline không cần server
├── GoogleAppsScript_Code.js          # API Google Apps Script Smart Upsert (Bảo toàn link Drive)
├── merge_excel_to_sheets.js          # Script tự động hợp nhất Excel vào Google Sheets
├── package.json                      # Cấu hình dự án & dependencies (Vite, React, Tailwind, Lucide, XLSX)
├── vite.config.js                    # Cấu hình Vite build
├── tailwind.config.js                # Cấu hình Tailwind CSS
├── postcss.config.js                 # Cấu hình PostCSS Autoprefixer
├── vercel.json                       # Cấu hình điều hướng Vercel Clean URLs
├── .gitignore                        # Loại trừ node_modules, build outputs, file Excel, backup
├── README.md                         # Tài liệu dự án
└── HUONG_DAN_DEPLOY_VERCEL_CHI_TIET.md # Cẩm nang hướng dẫn deploy & đồng bộ chi tiết
```

---

## ✨ Các tính năng nổi bật phiên bản v2.10

1. **Giao diện WinForms Cổ điển Toàn màn hình (`100% Full-Screen`)**:
   * Thiết kế trực quan, chữ to rõ ràng, bảng biểu tối ưu cho bác sĩ khám liên tục.
   * Chuyển đổi linh hoạt giữa giao diện WinForms và giao diện Modern Xanh Y Tế.
2. **Liên kết Thư mục Ảnh Xét nghiệm Google Drive (`imageFolderUrl`)**:
   * Từng hồ sơ bệnh nhân được gắn link thư mục Google Drive chứa ảnh X-Quang, siêu âm, xét nghiệm.
   * Bác sĩ mở trực tiếp thư mục ảnh chỉ với 1 cú click (`📁 Mở ảnh Drive`).
3. **Cơ chế Hợp nhất Thông minh (Smart Merge / Upsert)**:
   * **Bảo toàn 100% link Google Drive** đã cập nhật trên Sheets khi nạp file Excel mới.
   * Tự động sao lưu dự phòng an toàn trước mỗi lần đồng bộ (`backup_data/`).
4. **Xuất Đơn thuốc File Ảnh (.png) & File PDF (.pdf)**:
   * Hỗ trợ xuất đơn thuốc chuẩn A5 không cần máy in giấy để gửi nhanh qua Zalo/Viber.
5. **Bảo mật Khóa màn hình PIN & Chế độ Admin (#ktskhoa365)**:
   * Khóa máy tức thời hoặc tự động khóa khi rời phòng khám.
   * Tự động ẩn các nút công cụ thiết kế khi chia sẻ cho người khác.

---

## 🚀 Hướng dẫn Sử dụng Nhanh

### 1. Khởi chạy ở môi trường phát triển (Local Development):
```bash
npm install
npm run dev
```

### 2. Kiểm tra đóng gói Production (Build Test):
```bash
npm run build
```
*(Kết quả xuất ra thư mục `dist/` tương thích 100% với Vercel preset Vite).*

### 3. Gộp dữ liệu Excel vào Google Sheets bảo toàn Link Drive:
```bash
npm run merge-excel
```

### 4. Đẩy mã nguồn lên GitHub & Deploy Vercel:
```bash
git add .
git commit -m "feat: standard packaging for Vercel & smart merge preserving Drive links"
git push origin main
```

Xem tài liệu đầy đủ tại: [HUONG_DAN_DEPLOY_VERCEL_CHI_TIET.md](./HUONG_DAN_DEPLOY_VERCEL_CHI_TIET.md).
