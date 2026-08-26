1. Tổng quan dự án

- Khách hàng cần xây dựng một website giới thiệu shop kết hợp hiển thị bảng giá/catalogue sản phẩm.
- Website mang tính chất giới thiệu và tham khảo sản phẩm, không phải website thương mại điện tử.
- Website được thiết kế theo concept/phong cách tham khảo từ trang mẫu mà khách cung cấp, cụ thể là phong cách tương tự FUTA theo yêu cầu ban đầu. ==> xem ở file [ThietKeTheoPhongCach.md]
- Website sẽ được xây dựng theo mô hình single-page, tức toàn bộ nội dung chính nằm trên một trang duy nhất, người dùng có thể cuộn xuống hoặc sử dụng navigation để di chuyển đến từng khu vực.

2. Trang phía khách hàng
2.1. Header / Navigation

Website có thanh điều hướng giúp người dùng di chuyển nhanh đến các khu vực trên trang.

Các khu vực dự kiến:

- Trang chủ
- Giới thiệu shop
- Nội thất
- Noel
- Tết
- Hoa khô
- Liên hệ / thông tin shop

Navigation có thể sử dụng cơ chế scroll đến section tương ứng thay vì chuyển sang trang mới.

3. Phần giới thiệu shop

Trang chủ cần có khu vực giới thiệu về shop.

Có thể bao gồm:

Tên shop
Nội dung giới thiệu
Hình ảnh đại diện
Một số thông tin nổi bật về shop

Nội dung cụ thể sẽ do khách hàng cung cấp/chốt sau.

4. Hình ảnh của shop

Website cần có khu vực hiển thị hình ảnh của shop.

Có thể trình bày dưới dạng:

- Gallery
- Grid hình ảnh
- Carousel/slider

Cách trình bày cụ thể sẽ dựa trên design được thống nhất.

5. Các danh mục sản phẩm

Website hiện có 4 danh mục chính:

- Nội thất:

==>Hiển thị danh sách các sản phẩm thuộc nhóm Nội thất.

- Noel

==> Hiển thị các sản phẩm thuộc nhóm Noel.

- Tết

==> Hiển thị các sản phẩm thuộc nhóm Tết.

- Hoa khô

==> Hiển thị các sản phẩm thuộc nhóm Hoa khô.

6. Hiển thị bảng giá sản phẩm

- Trong mỗi danh mục sẽ hiển thị danh sách/bảng giá sản phẩm.

- Mỗi sản phẩm có thể hiển thị các thông tin cơ bản như:

    + Hình ảnh sản phẩm
    + Tên sản phẩm
    + Giá sản phẩm

- Các thông tin chi tiết khác sẽ được xác định khi khách chốt nội dung sản phẩm.

7. Popup chi tiết sản phẩm

- Khi người dùng click vào một sản phẩm, website sẽ mở một popup/modal hiển thị thông tin chi tiết.

- Popup cần có:

    + Hình ảnh sản phẩm
    + Tên sản phẩm
    + Giá
    + Thông tin/mô tả sản phẩm
    + Các thông tin chi tiết khác nếu có
    + Gallery hình ảnh

- Một sản phẩm có thể có nhiều hình ảnh.

- Trong popup cần có nút:

← Ảnh trước | Ảnh sau →

để người dùng chuyển qua lại giữa các hình ảnh của sản phẩm.

8. Thông tin mạng xã hội / Page của shop

Ở khu vực phía dưới website cần hiển thị các trang cá nhân/page của shop.

Ví dụ:

- Facebook
- Instagram
- TikTok
- Các mạng xã hội khác nếu khách cung cấp.

Thông tin cụ thể sẽ được khách cung cấp sau.

9. Footer

Cuối trang hiển thị các thông tin cần thiết của shop, có thể bao gồm:

- Tên shop
- Thông tin liên hệ
- Social media
- Copyright

Nội dung cụ thể sẽ được xác nhận sau.

10. Trang quản trị Admin

- Website cần có khu vực dành riêng cho Admin.

10.1. Đăng nhập Admin

- Admin có trang đăng nhập riêng.

- Chức năng:

    + Username/email
    + Password
    + Đăng nhập
    + Đăng xuất

- Khách hàng hiện chỉ yêu cầu Admin, chưa có yêu cầu về nhiều loại tài khoản/phân quyền phức tạp.

11. Quản lý sản phẩm

- Sau khi đăng nhập, Admin có thể quản lý bảng giá sản phẩm.

11.1. Thêm sản phẩm

- Admin có thể:

    + Nhập tên sản phẩm
    + Nhập giá
    + Chọn danh mục
    + Nhập thông tin/mô tả
    + Thêm hình ảnh
    + Các thông tin khác nếu được bổ sung sau

11.2. Sửa sản phẩm

- Admin có thể cập nhật:

    + Tên
    + Giá
    + Danh mục
    + Mô tả/thông tin
    + Hình ảnh
    + Các thông tin khác

11.3. Xóa sản phẩm

- Admin có thể xóa sản phẩm khỏi hệ thống.

11.4. Quản lý hình ảnh

- Một sản phẩm có thể có nhiều hình ảnh, phục vụ cho gallery trong popup chi tiết.

12. Màu thương hiệu (Brand Colors)

- Màu chủ đạo (Primary): #2D4A3E (xanh lá rừng đậm) — thay thế màu cam của FUTA
- Cấu trúc design system giữ nguyên theo ThietKeTheoPhongCach.md, chỉ thay màu primary
- Màu on-primary (text trên nền primary): #FFFFFF
- Các màu còn lại (canvas, surface-alt, ink, body, hairline...) giữ nguyên theo FUTA

13. Công nghệ sử dụng (Tech Stack)

12.1. Frontend

- Framework: Next.js 15 (App Router)
- Ngôn ngữ: TypeScript
- Styling: Vanilla CSS / CSS Modules (theo FUTA design system)
- Font: Inter Tight (Google Fonts / next/font)
- Tối ưu ảnh: next/image (built-in Next.js)

12.2. Backend

- Sử dụng Next.js API Routes (built-in, không cần server riêng)
- Xác thực Admin: NextAuth.js
- ORM: Prisma (kết nối và thao tác database nhanh, type-safe)
- Upload ảnh: Multer hoặc giải pháp tương đương qua API Route

12.3. Database

- Development: SQLite (không cần cài đặt, chỉ là 1 file .db trong project, chạy ngay)
- Production: MySQL hoặc PostgreSQL (tùy môi trường bên deploy)
- Chuyển đổi DB: chỉ cần sửa 2 dòng trong prisma/schema.prisma, không cần sửa code
- Prisma đảm bảo tính linh hoạt hoàn toàn giữa các loại DB

12.4. Dev Tools

- Package manager: npm
- Môi trường biến: dotenv / .env.local
- ORM CLI: Prisma CLI (migrate, generate)

12.5. Ghi chú kiến trúc

- Toàn bộ dự án nằm trong 1 project Next.js duy nhất (FE + BE + API).
- Bên deploy chỉ cần chạy: npm install && npm run build && npm start
- Không cần quản lý 2 repo riêng biệt cho FE và BE.