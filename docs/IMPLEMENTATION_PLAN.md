# IMPLEMENTATION PLAN — Shop Catalogue Landing Page

> **Tech Stack:** Next.js 15 (App Router) · TypeScript · Vanilla CSS · Prisma · MySQL · NextAuth.js  
> **Cập nhật lần cuối:** 2026-08-26  
> **Trạng thái:** Đang lên kế hoạch

---

## Tổng quan các giai đoạn

| Giai đoạn | Tên | Mô tả |
|---|---|---|
| **Phase 0** | Setup & Khởi tạo | Tạo project, cấu hình môi trường |
| **Phase 1** | Design System | CSS tokens, typography, components cơ bản |
| **Phase 2** | Layout & Navigation | Header, Footer, cấu trúc trang |
| **Phase 3** | Các Section Frontend | Tất cả section của landing page |
| **Phase 4** | Database & Prisma | Schema, migration, seed data |
| **Phase 5** | API Routes | CRUD sản phẩm, upload ảnh |
| **Phase 6** | Admin Panel | Trang đăng nhập, quản lý sản phẩm |
| **Phase 7** | Tích hợp & Kết nối | Frontend gọi API thật |
| **Phase 8** | Polish & Responsive | Hoàn thiện UI, responsive mobile |
| **Phase 9** | Test & Bàn giao | Kiểm tra toàn bộ, chuẩn bị bàn giao |

---

## PHASE 0 — Setup & Khởi tạo dự án

### Bước 0.1 — Khởi tạo Next.js project

```bash
npx create-next-app@latest shop-catalog \
  --typescript \
  --app \
  --no-tailwind \
  --src-dir \
  --import-alias "@/*"
cd shop-catalog
```

**Cấu trúc thư mục mục tiêu:**

```
shop-catalog/
├── src/
│   ├── app/
│   │   ├── (public)/           # Layout cho trang khách
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx        # Landing page chính
│   │   ├── admin/              # Khu vực admin
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── dashboard/
│   │   │       ├── page.tsx
│   │   │       └── products/
│   │   │           ├── page.tsx
│   │   │           ├── new/page.tsx
│   │   │           └── [id]/edit/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── products/
│   │   │   │   ├── route.ts        # GET all, POST new
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts    # GET one, PUT, DELETE
│   │   │   │       └── images/route.ts
│   │   │   └── upload/route.ts
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── ProductsSection.tsx
│   │   │   └── SocialSection.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   └── ImageGallery.tsx
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   └── ImageUploader.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       └── Badge.tsx
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth.ts             # NextAuth config
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts            # TypeScript types/interfaces
│   └── styles/
│       ├── tokens.css          # Design tokens (màu, spacing...)
│       ├── typography.css      # Typography system
│       └── components.css      # Component styles tái sử dụng
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── uploads/                # Thư mục lưu ảnh upload
├── .env.local
└── package.json
```

### Bước 0.2 — Cài đặt dependencies

```bash
# Prisma ORM
npm install prisma @prisma/client
npx prisma init

# NextAuth
npm install next-auth@beta @auth/prisma-adapter

# Upload ảnh
npm install multer
npm install --save-dev @types/multer

# Utilities
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### Bước 0.3 — Cấu hình `.env.local`

```env
DATABASE_URL="mysql://user:password@localhost:3306/shop_catalog"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
UPLOAD_DIR="./public/uploads"
```

---

## PHASE 1 — Design System (CSS theo FUTA)

### Bước 1.1 — Tạo file `src/styles/tokens.css`

Định nghĩa toàn bộ CSS custom properties theo FUTA design system:

```css
:root {
  /* Colors */
  --color-primary: #EF5222;
  --color-canvas: #FFFFFF;
  --color-surface-alt: #FFF7F5;
  --color-on-primary: #FFFFFF;
  --color-ink: #000000;
  --color-body: #111111;
  --color-muted: #4A4A4A;
  --color-faint: #4B5563;
  --color-hairline: #E5E7EB;

  /* Typography */
  --font-family: 'Inter Tight', system-ui, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-body: 15.2px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 28px;

  /* Spacing */
  --space-xxs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 20px;
  --space-xl: 24px;
  --space-xxl: 28px;
  --space-xxxl: 32px;
  --space-section: 40px;
  --space-band: 80px;

  /* Border Radius */
  --radius-none: 0px;
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.016) 0px 2px 0px 0px;

  /* Container */
  --container-max: 1200px;
}
```

### Bước 1.2 — Tạo file `src/styles/typography.css`

Định nghĩa các class typography theo hệ thống FUTA.

### Bước 1.3 — Tạo file `src/styles/components.css`

Định nghĩa các class component tái sử dụng:
- `.btn-primary` — pill shape, cam đậm
- `.btn-outline` — viền cam, nền trong suốt
- `.card` — card sản phẩm
- `.badge` — badge danh mục

### Bước 1.4 — Cài đặt Google Font Inter Tight

Cấu hình trong `src/app/layout.tsx` dùng `next/font/google`.

---

## PHASE 2 — Layout & Navigation

### Bước 2.1 — Component `Header.tsx`

**Yêu cầu:**
- Logo/tên shop bên trái
- Navigation links bên phải: Trang chủ | Giới thiệu | Nội thất | Noel | Tết | Hoa khô | Liên hệ
- Sticky header khi scroll
- Smooth scroll đến từng section khi click nav link
- Active state highlight link theo section đang hiển thị (Intersection Observer)
- Mobile: hamburger menu

**Chi tiết kỹ thuật:**
- Dùng `useEffect` + `IntersectionObserver` để detect section active
- Scroll behavior: `document.getElementById(id).scrollIntoView({ behavior: 'smooth' })`
- CSS: `position: sticky; top: 0; z-index: 100;`

### Bước 2.2 — Component `Footer.tsx`

**Yêu cầu:**
- Tên shop
- Thông tin liên hệ (SĐT, địa chỉ, email)
- Social media links (Facebook, Instagram, TikTok)
- Copyright
- Nền màu `#F0F2F5` (theo FUTA footer)

### Bước 2.3 — Layout công khai `src/app/(public)/layout.tsx`

- Import Header + Footer
- Wrap children
- Import font + global CSS

---

## PHASE 3 — Các Section Frontend (Landing Page)

### Bước 3.1 — `HeroSection.tsx` (Trang chủ)

**Yêu cầu:**
- Hero banner toàn màn hình hoặc nửa màn hình
- Hình ảnh nền shop
- Tên shop nổi bật
- Tagline/slogan
- Nút CTA (ví dụ: "Xem sản phẩm" scroll đến section sản phẩm)
- Hiệu ứng parallax nhẹ khi scroll (optional)

**id section:** `id="trang-chu"`

### Bước 3.2 — `AboutSection.tsx` (Giới thiệu shop)

**Yêu cầu:**
- Bố cục 2 cột: Ảnh bên trái | Nội dung bên phải (hoặc ngược lại)
- Tên shop, nội dung giới thiệu
- Các thông tin nổi bật (có thể dùng card nhỏ với icon + số liệu)
- Nền màu `#FFF7F5` (surface-alt)

**id section:** `id="gioi-thieu"`

### Bước 3.3 — `GallerySection.tsx` (Hình ảnh shop)

**Yêu cầu:**
- Grid ảnh dạng Masonry hoặc Grid đều nhau
- Hover effect: overlay với icon zoom
- Click ảnh → mở lightbox xem ảnh to
- Lightbox có nút ← → để chuyển ảnh

**id section:** `id="hinh-anh"`  
**Kỹ thuật:**
- CSS Grid với `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- Lightbox: custom modal component

### Bước 3.4 — `ProductsSection.tsx` (Danh mục sản phẩm)

**Yêu cầu:**
- Tab/Filter bar để chọn danh mục: Nội thất | Noel | Tết | Hoa khô
- Hiển thị danh sách sản phẩm theo tab đang chọn
- Grid sản phẩm responsive

**id section:** `id="san-pham"`  
Mỗi danh mục cũng có id riêng: `id="noi-that"`, `id="noel"`, `id="tet"`, `id="hoa-kho"`

**Kỹ thuật:**
- State quản lý tab đang active: `useState<Category>`
- Fetch sản phẩm từ API: `GET /api/products?category=noi-that`
- Filter phía client hoặc phía server

### Bước 3.5 — `ProductCard.tsx` (Card sản phẩm)

**Yêu cầu:**
- Ảnh sản phẩm (tỷ lệ cố định, dùng `next/image`)
- Tên sản phẩm
- Giá (format tiền VND: `1.500.000 đ`)
- Hover effect: ảnh zoom nhẹ + overlay
- Click → mở `ProductModal`

### Bước 3.6 — `ProductModal.tsx` (Popup chi tiết sản phẩm)

**Yêu cầu:**
- Overlay tối phủ toàn màn hình
- Modal box trung tâm
- Layout 2 cột: Gallery ảnh bên trái | Thông tin bên phải
- Gallery ảnh chính + thumbnail list bên dưới
- Nút ← Ảnh trước | Ảnh sau → để chuyển ảnh
- Tên sản phẩm, danh mục (badge), giá
- Mô tả sản phẩm
- Nút đóng modal (x góc trên phải)
- Click overlay để đóng
- Phím ESC để đóng

**Kỹ thuật:**
- `useState` quản lý index ảnh hiện tại
- `useEffect` lắng nghe phím ESC
- `document.body.style.overflow = 'hidden'` khi mở modal

### Bước 3.7 — `SocialSection.tsx` (Mạng xã hội)

**Yêu cầu:**
- Tiêu đề section: "Theo dõi chúng tôi"
- Cards/buttons cho từng mạng xã hội: Facebook, Instagram, TikTok
- Icon mạng xã hội + tên page + link
- Hover effect

**id section:** `id="lien-he"`

---

## PHASE 4 — Database & Prisma Schema

### Bước 4.1 — Thiết kế schema `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Admin {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String   // bcrypt hash
  createdAt DateTime @default(now())
}

enum Category {
  NOI_THAT
  NOEL
  TET
  HOA_KHO
}

model Product {
  id          Int           @id @default(autoincrement())
  name        String
  price       Int           // Lưu theo đơn vị VND (số nguyên)
  category    Category
  description String?       @db.Text
  isActive    Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  images      ProductImage[]
}

model ProductImage {
  id        Int     @id @default(autoincrement())
  url       String
  order     Int     @default(0) // Thứ tự hiển thị
  isMain    Boolean @default(false) // Ảnh đại diện chính
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId Int
}
```

### Bước 4.2 — Chạy migration

```bash
npx prisma migrate dev --name init
```

### Bước 4.3 — Seed data mẫu `prisma/seed.ts`

Tạo:
- 1 tài khoản admin mặc định (username: `admin`, password: `admin123` được hash bcrypt)
- 10-15 sản phẩm mẫu, mỗi danh mục 3-4 sản phẩm
- Mỗi sản phẩm có 2-4 ảnh placeholder

```bash
npx prisma db seed
```

### Bước 4.4 — Tạo Prisma Client singleton `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## PHASE 5 — API Routes

### Bước 5.1 — `GET /api/products` — Lấy danh sách sản phẩm

- Query params: `?category=NOI_THAT` (optional)
- Response: `{ products: Product[] }`
- Include images (chỉ lấy ảnh chính `isMain: true`) cho card list

### Bước 5.2 — `GET /api/products/[id]` — Lấy chi tiết 1 sản phẩm

- Include tất cả images (sắp xếp theo `order`)
- Response: `{ product: Product & { images: ProductImage[] } }`

### Bước 5.3 — `POST /api/products` — Tạo sản phẩm mới (Admin only)

- Middleware: kiểm tra session NextAuth
- Body: `{ name, price, category, description }`
- Response: `{ product: Product }`

### Bước 5.4 — `PUT /api/products/[id]` — Cập nhật sản phẩm (Admin only)

- Middleware: kiểm tra session NextAuth
- Body: các field cần update

### Bước 5.5 — `DELETE /api/products/[id]` — Xóa sản phẩm (Admin only)

- Middleware: kiểm tra session NextAuth
- Cascade delete ảnh liên quan (Prisma tự xử lý theo schema)

### Bước 5.6 — `POST /api/upload` — Upload ảnh sản phẩm (Admin only)

- Accept `multipart/form-data`
- Validate: chỉ nhận `.jpg`, `.jpeg`, `.png`, `.webp`
- Validate: max 5MB/ảnh
- Lưu vào `public/uploads/[timestamp]-[filename]`
- Response: `{ url: "/uploads/..." }`

### Bước 5.7 — `POST /api/products/[id]/images` — Thêm ảnh vào sản phẩm (Admin only)

- Body: `{ url, order, isMain }`

### Bước 5.8 — `DELETE /api/products/[id]/images/[imageId]` — Xóa ảnh (Admin only)

- Xóa record trong DB
- Xóa file vật lý trong `public/uploads/`

### Bước 5.9 — Auth API `src/app/api/auth/[...nextauth]/route.ts`

Cấu hình NextAuth với Credentials Provider:
- Nhận username + password
- So sánh password với bcrypt hash trong DB
- Tạo session JWT

---

## PHASE 6 — Admin Panel

### Bước 6.1 — Trang đăng nhập `/admin/login`

**UI bao gồm:**
- Logo/tên shop
- Form: Username input + Password input
- Nút "Đăng nhập"
- Thông báo lỗi khi sai thông tin
- Redirect đến `/admin/dashboard` nếu đã đăng nhập

**Kỹ thuật:**
- `signIn('credentials', { username, password })` từ NextAuth
- Middleware Next.js bảo vệ route `/admin/*` (trừ `/admin/login`)

### Bước 6.2 — Middleware bảo vệ Admin `middleware.ts`

```typescript
// Redirect về /admin/login nếu chưa đăng nhập
// Áp dụng cho tất cả route /admin/* trừ /admin/login
```

### Bước 6.3 — Layout Admin `src/app/admin/layout.tsx`

**UI bao gồm:**
- Sidebar bên trái: Logo, navigation (Dashboard, Sản phẩm), nút Đăng xuất
- Main content area bên phải
- Header thanh admin với tên tài khoản đang đăng nhập

### Bước 6.4 — Dashboard `/admin/dashboard`

**UI bao gồm:**
- Thống kê nhanh: Tổng sản phẩm, số lượng mỗi danh mục
- Shortcut đến quản lý sản phẩm

### Bước 6.5 — Danh sách sản phẩm `/admin/dashboard/products`

**UI bao gồm:**
- Filter bar: Tất cả | Nội thất | Noel | Tết | Hoa khô
- Bảng sản phẩm: Ảnh thumb | Tên | Danh mục | Giá | Ngày tạo | Hành động
- Hành động: Nút Sửa + Nút Xóa (có confirm dialog)
- Nút "Thêm sản phẩm mới"
- Tìm kiếm sản phẩm theo tên

### Bước 6.6 — Form thêm sản phẩm `/admin/dashboard/products/new`

**UI bao gồm:**
- Input: Tên sản phẩm (bắt buộc)
- Input: Giá (format số, hiển thị VND, bắt buộc)
- Select: Danh mục (Nội thất / Noel / Tết / Hoa khô, bắt buộc)
- Textarea: Mô tả sản phẩm
- Khu vực upload ảnh:
  - Drag & drop hoặc click để chọn file
  - Preview ảnh sau khi chọn
  - Có thể upload nhiều ảnh
  - Đánh dấu 1 ảnh là ảnh chính (isMain)
  - Sắp xếp thứ tự ảnh (kéo thả)
  - Xóa ảnh đã chọn
- Nút "Lưu sản phẩm" + Nút "Hủy"
- Validation: bắt buộc tên, giá, danh mục, ít nhất 1 ảnh

**Luồng xử lý:**
1. Upload ảnh lên `POST /api/upload` → nhận về URL
2. Submit form → `POST /api/products` với data + danh sách URL ảnh

### Bước 6.7 — Form sửa sản phẩm `/admin/dashboard/products/[id]/edit`

- Tương tự form thêm, nhưng pre-fill dữ liệu hiện có
- Khu vực ảnh: hiển thị ảnh đang có + cho phép thêm/xóa ảnh
- Submit → `PUT /api/products/[id]`

---

## PHASE 7 — Tích hợp Frontend với API

### Bước 7.1 — Fetch sản phẩm trong landing page

- `ProductsSection`: dùng Next.js Server Component để fetch trực tiếp (không cần client fetch)
- Loading skeleton khi đang fetch
- Error state khi fetch thất bại

### Bước 7.2 — Mở ProductModal

- Click `ProductCard` → fetch `GET /api/products/[id]` để lấy đủ ảnh
- Mở modal với dữ liệu đầy đủ

### Bước 7.3 — Tab filter sản phẩm

- Khi chọn tab → filter sản phẩm đã fetch, hoặc fetch lại với query `?category=`

---

## PHASE 8 — Polish & Responsive

### Bước 8.1 — Responsive breakpoints

| Breakpoint | Xử lý |
|---|---|
| Mobile `< 768px` | Stack vertical, hamburger menu, 1 cột sản phẩm |
| Tablet `768px - 1024px` | 2 cột sản phẩm, nav visible |
| Desktop `>= 1024px` | Layout đầy đủ, 3-4 cột sản phẩm |

### Bước 8.2 — Animations & Micro-interactions

- Header sticky: thêm shadow khi scroll xuống
- Nav active state: underline animation
- ProductCard hover: ảnh zoom + shadow
- Modal open/close: fade + scale animation
- Tab filter: smooth transition khi chuyển tab
- Scroll-to-section: smooth behavior
- Skeleton loading cho product grid

### Bước 8.3 — Performance

- `next/image` với `priority` cho ảnh hero
- Lazy load ảnh sản phẩm
- Tối ưu font với `next/font/google`

### Bước 8.4 — SEO

- `metadata` đầy đủ trong `layout.tsx`: title, description
- Open Graph tags (Facebook share)
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`
- Alt text cho tất cả ảnh

---

## PHASE 9 — Test & Bàn giao

### Bước 9.1 — Checklist Test Frontend

- [ ] Navigation scroll đến đúng section
- [ ] Tab filter sản phẩm hoạt động
- [ ] ProductModal mở/đóng đúng
- [ ] Gallery ảnh ← → chuyển đúng
- [ ] Responsive trên mobile, tablet, desktop
- [ ] ESC key đóng modal
- [ ] Animations smooth

### Bước 9.2 — Checklist Test Admin

- [ ] Đăng nhập đúng thông tin → vào dashboard
- [ ] Đăng nhập sai → hiện lỗi
- [ ] Route `/admin/*` redirect về login nếu chưa đăng nhập
- [ ] Thêm sản phẩm với ảnh → hiển thị ngoài landing page
- [ ] Sửa sản phẩm → cập nhật đúng
- [ ] Xóa sản phẩm → không còn hiển thị
- [ ] Upload nhiều ảnh, chuyển ảnh trong modal
- [ ] Đăng xuất → redirect về login

### Bước 9.3 — Chuẩn bị bàn giao

Tạo file `DEPLOYMENT.md` hướng dẫn:

```
1. Clone repo
2. npm install
3. Cấu hình .env (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
4. npx prisma migrate deploy
5. npx prisma db seed  (nếu cần data mẫu)
6. npm run build
7. npm start
```

### Bước 9.4 — Tài khoản Admin ban đầu

- Cung cấp thông tin đăng nhập mặc định cho khách
- Hướng dẫn khách đổi password ngay sau khi nhận bàn giao

---

## Thứ tự thực hiện tóm tắt

```
Phase 0 (Setup)
    → Phase 1 (CSS/Design System)
    → Phase 2 (Header + Footer)
    → Phase 3 (Landing Page Sections)
    → Phase 4 (Database Schema + Seed)
    → Phase 5 (API Routes)
    → Phase 7 (Kết nối FE-BE)
    → Phase 6 (Admin Panel)
    → Phase 8 (Responsive + Polish)
    → Phase 9 (Test + Bàn giao)
```

---

## Các điểm cần xác nhận với khách hàng

- [ ] **Database**: Môi trường deploy dùng gì? (để xác định MySQL hay khác)
- [ ] **Tên shop**: Tên chính thức của shop
- [ ] **Màu thương hiệu**: Có muốn giữ nguyên cam FUTA hay đổi màu riêng?
- [ ] **Nội dung**: Text giới thiệu shop, thông tin liên hệ, link social media
- [ ] **Ảnh**: Ảnh hero, ảnh gallery shop, ảnh sản phẩm
- [ ] **Domain**: URL website chính thức (để cấu hình NEXTAUTH_URL khi deploy)
