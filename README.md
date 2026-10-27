# 🏥 MediCare Clinic Pro - Hệ thống Quản lý Phòng khám Tư nhân

**Thiết kế & Phát triển bởi:** `#ktskhoa365` — **LH:** `0908297118`

---

## 📂 Cấu trúc Dự án trong gói GitHub này

Dự án đã được đóng gói sẵn sàng để đẩy thẳng lên **GitHub** và tự động chạy trên **Vercel** (không cần cài đặt môi trường phức tạp, không bao giờ lỗi build):

* `index.html` — **Bản chính thức (v2 - Giao diện WinForms Cổ điển Toàn màn hình)** dùng để chạy trực tiếp trên Vercel hoặc mở trực tiếp trên máy tính.
* `MediCare_Clinic_Pro_Standalone.html` — Bản rời (identically synced) để anh lưu dự phòng hoặc gửi file trực tiếp.
* `src/medicare_clinic_pro_v2.jsx` — Mã nguồn React JSX đầy đủ của **Bản v2 (Sau khi cập nhật giao diện + Khóa PIN + Kho Lưu trữ + Nhật ký sử dụng)**.
* `v1-giao-dien-cu/index.html` & `v1-giao-dien-cu/medicare_clinic_pro_v1_modern.jsx` — Bản lưu trữ **Phiên bản v1 (Giao diện Hiện đại Xanh Y Tế ban đầu trước khi cập nhật)**.
* `vercel.json` — Cấu hình chuẩn cho Vercel.

---

## ✨ Các tính năng nổi bật (Bản v2)

1. **Giao diện WinForms Cổ điển Toàn màn hình (`100% Full-Screen`)**: Chữ to, rõ, bảng biểu sắc nét, tiêu đề khung (GroupBox) nằm gọn trên đường kẻ.
2. **Bảo mật Khóa màn hình bằng mã PIN (`🔒 Khóa máy (PIN)`)**:
   * Tự động khóa khi rời bàn làm việc hoặc khóa nhanh bằng 1 cú click.
   * Mã PIN mặc định: `1234` (Bác sĩ tự đổi mã PIN riêng tại nút **🛡️ Cài đặt PIN**).
   * Mã mở khóa khẩn cấp của Admin (`#ktskhoa365`): `0908297118`.
3. **Quản lý Danh sách Đang khám & Kho Lưu trữ Đã khỏi bệnh (`📦 Lưu trữ`)**:
   * Mặc định Tab 1 chỉ hiển thị bệnh nhân **Đang khám & điều trị** cho gọn gàng.
   * Khi bệnh nhân hết bệnh, bấm **`📦 Đã khỏi bệnh → Chuyển vào Lưu trữ`** ở Tab 2.
   * Có nút chuyển nhanh **`📦 Xem DS Đã khỏi bệnh / Lưu trữ`** ngay trên đầu bảng Tab 1 để duyệt lại danh sách người cũ khi quên tên/SĐT, hoặc bấm **`Khám lại ↺`** khi bệnh nhân tái khám sau nhiều tháng/năm.
   * Có nút **`🗑️ Xóa BN`** (kèm hộp thoại xác nhận an toàn) để xóa vĩnh viễn khi nhập nhầm.
4. **Ẩn nút thiết kế của Admin đối với người được chia sẻ**:
   * Khi bạn bè mở link Vercel, 2 nút *"Khôi phục giao diện cũ (v1)"* và *"Tải App về máy (Ổ J:)"* sẽ **tự động ẩn**.
   * **Mẹo dành riêng cho anh (`#ktskhoa365`)**: Nhấp đúp chuột (**Double-click**) vào dòng chữ bản quyền `App được thiết kế và phát triển bởi #ktskhoa365 LH:0908297118` ở góc dưới bên phải thanh trạng thái để Bật/Tắt chế độ Admin bất kỳ lúc nào (hoặc thêm `?admin=1` vào cuối đường link).
5. **Liên kết Google Sheets 5 Bảng tự động (`Benh_Nhan`, `Luot_Kham`, `Don_Thuoc_Chi_Tiet`, `Xet_Nghiem_Chi_Phi`, `Nhat_Ky_Su_Dung`)**:
   * Tích hợp sẵn mã Google Apps Script trong mục **Cấu hình Google Sheets** để đồng bộ dữ liệu và ghi nhận nhật ký phòng khám đang sử dụng.

---

## 🚀 Hướng dẫn đưa lên GitHub (Lưu cả Bản v1 và Bản v2) & Deploy Vercel

### Bước 1: Giải nén vào thư mục trên máy anh
Giải nén toàn bộ file trong gói `app-quan-ly-benh-nhan-github.zip` vào thư mục:
`J:\AI-LAB\app-quan-ly-benh-nhan`

### Bước 2: Đẩy lên GitHub (Lưu lịch sử Bản v1 trước, Bản v2 sau)
Mở **Git Bash** hoặc **Command Prompt / Terminal** tại thư mục `J:\AI-LAB\app-quan-ly-benh-nhan` và chạy lần lượt:

```bash
git init
git branch -M main

# 1. Lưu commit cho toàn bộ dự án (bao gồm cả thư mục v1-giao-dien-cu và bản v2 hiện tại)
git add .
git commit -m "Release v2 Fullscreen WinForms + Backup v1 Modern UI (#ktskhoa365)"

# 2. Kết nối với kho lưu trữ (Repository) trên GitHub của anh và đẩy lên
git remote add origin https://github.com/TEN_GITHUB_CUA_ANH/app-quan-ly-benh-nhan.git
git push -u origin main
```
*(Nếu anh muốn tách hẳn 1 nhánh `v1-modern` trên GitHub, anh chỉ cần gõ thêm: `git checkout -b v1-modern` -> `git push -u origin v1-modern` -> `git checkout main`).*

### Bước 3: Kết nối GitHub với Vercel để lấy Link chia sẻ tự động cập nhật
1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản **GitHub** của anh.
2. Bấm **Add New...** → **Project** → Chọn kho lưu trữ `app-quan-ly-benh-nhan` vừa đẩy lên → Bấm **Import**.
3. Giữ nguyên cấu hình mặc định và bấm **Deploy**.
4. Sau 10 giây, Vercel sẽ cấp cho anh đường link (ví dụ: `https://app-quan-ly-benh-nhan.vercel.app`).
   * Anh gửi link này cho bạn bè dùng miễn phí 100% (không cần tài khoản Gemini).
   * Bất kỳ khi nào anh sửa file và `git push` lên GitHub, toàn bộ máy của bạn bè sẽ **tự động cập nhật phiên bản mới nhất** mà không mất dữ liệu bệnh nhân cũ!
