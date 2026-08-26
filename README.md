# Decor Shop - Premium E-Catalog & CMS

Đây là dự án website giới thiệu sản phẩm Nội thất & Đồ trang trí (Decor Shop) cao cấp, được thiết kế theo phong cách tối giản (Minimalist/Editorial) với đầy đủ hệ thống quản trị nội dung (Admin CMS) đi kèm.

## 🌟 Tính năng nổi bật

### 1. Giao diện Khách hàng (Public Site)
- **Thiết kế Sang trọng:** Sử dụng tone màu Xanh Rừng Đậm (#2D4A3E) kết hợp Vàng Gold (#C9A96E), phong cách thiết kế tạp chí kiến trúc.
- **Hiệu ứng Parallax 3D:** Họa tiết chìm (watermark) và vân giấy nhám chuyển động mượt mà khi cuộn trang, tạo chiều sâu thị giác.
- **Single-page Navigation:** Chuyển hướng mượt mà (smooth scroll) giữa các khu vực: Trang chủ, Sản phẩm (Nội thất, Noel, Tết, Hoa khô), Gallery, Liên hệ.
- **Tương tác Cao cấp:** Popup chi tiết sản phẩm (Modal), Phóng to ảnh thực tế (Lightbox) hoạt động mượt mà không cần chuyển trang.

### 2. Trang Quản trị (Admin CMS)
- **Bảo mật:** Đăng nhập an toàn với NextAuth.
- **Quản lý Sản phẩm:** Thêm, sửa, xóa sản phẩm, giá bán, danh mục. Hỗ trợ tải lên (upload) nhiều hình ảnh cho mỗi sản phẩm cùng lúc.
- **Quản lý Giao diện:** Tự do thay đổi hình ảnh phần "Về chúng tôi" và toàn bộ ảnh trong "Gallery Thực Tế" trực tiếp từ giao diện Admin.

---

## 🛠 Công nghệ sử dụng (Tech Stack)
- **Mặt tiền (Frontend):** Next.js 15 (App Router), React 19, Vanilla CSS Modules.
- **Hệ thống (Backend):** Next.js API Routes.
- **Cơ sở dữ liệu (Database):** SQLite (Môi trường Dev) / Tương thích MySQL, PostgreSQL qua Prisma ORM.
- **Bảo mật:** NextAuth.js.

---

## 🚀 Hướng dẫn Cài đặt & Chạy dự án (Getting Started)

Yêu cầu hệ thống: Đã cài đặt **Node.js** (phiên bản 18+).

### Bước 1: Tải thư viện
Mở terminal tại thư mục gốc của dự án và chạy:
```bash
npm install
```

### Bước 2: Khởi tạo Cơ sở dữ liệu
Dự án đang dùng SQLite (rất nhẹ, không cần cài đặt phần mềm DB). Chạy lệnh sau để tạo bảng dữ liệu:
```bash
npx prisma db push
```
*(Nếu IDE/Code Editor báo lỗi đỏ ở Prisma, hãy chạy thêm lệnh `npx prisma generate`)*

### Bước 3: Thiết lập biến môi trường (.env)
Dự án cần file `.env` (nếu chưa có, hãy tạo mới ở thư mục gốc) với nội dung:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="chuoi-ky-tu-bat-ky-dung-de-ma-hoa-token"
```

### Bước 4: Khởi động Server
```bash
npm run dev
```
Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Thông tin Đăng nhập Admin
Truy cập: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Tài khoản mặc định:** `admin`
- **Mật khẩu:** `admin123`

*(Mật khẩu đã được băm (hash) bảo mật trong Database. Có thể dùng Prisma Studio để can thiệp dữ liệu: `npx prisma studio`)*

---

## 🌐 Lưu ý khi Triển khai (Deployment)
- Hình ảnh upload hiện tại đang được lưu cục bộ trong thư mục `public/uploads`.
- Database đang sử dụng `SQLite` (lưu thành file `dev.db`).
- **Lưu ý:** Khi deploy lên các nền tảng Serverless như Vercel/Netlify, hệ thống file là *read-only* (chỉ đọc). Bạn sẽ cần đổi CSDL sang nền tảng cloud (như Supabase, Neon PostgreSQL) và đổi nơi lưu ảnh sang Cloudinary, AWS S3, hoặc Vercel Blob. Để chuyển DB, chỉ cần sửa dòng `provider` trong file `prisma/schema.prisma` và file `.env`.
