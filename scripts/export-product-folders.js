/**
 * Tạo bộ khung folder ảnh gốc cho từng sản phẩm + file CSV danh sách.
 *
 * Chạy: node scripts/export-product-folders.js
 * Kết quả: ../anh-san-pham/<id>-<slug>/  và  ../anh-san-pham/danh-sach-san-pham.csv
 *
 * Quy ước ảnh trong mỗi folder: đặt tên 1.jpg, 2.jpg, 3.jpg...
 *  - Số nhỏ nhất = ảnh chính (ảnh đại diện)
 *  - Thứ tự tăng dần = thứ tự hiển thị trên web
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT, '..', 'anh-san-pham');

function readEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return out;
}

const env = { ...readEnv(path.join(ROOT, '.env')), ...readEnv(path.join(ROOT, '.env.local')) };
process.env.DATABASE_URL = process.env.DATABASE_URL || env.DATABASE_URL;

if (!process.env.DATABASE_URL) {
  console.error('Không tìm thấy DATABASE_URL trong .env / .env.local');
  process.exit(1);
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

(async () => {
  const products = await prisma.product.findMany({
    orderBy: [{ category: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      name: true,
      category: true,
      isActive: true,
      _count: { select: { images: true } },
    },
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const rows = [['id', 'ten_san_pham', 'danh_muc', 'dang_ban', 'so_anh_hien_tai', 'folder']];
  let created = 0;

  for (const p of products) {
    const folder = `${String(p.id).padStart(3, '0')}-${slugify(p.name) || 'san-pham'}`;
    const full = path.join(OUT_DIR, folder);
    if (!fs.existsSync(full)) created++;
    fs.mkdirSync(full, { recursive: true });
    rows.push([p.id, p.name, p.category, p.isActive ? 'co' : 'khong', p._count.images, folder]);
  }

  // BOM để Excel đọc đúng tiếng Việt
  fs.writeFileSync(
    path.join(OUT_DIR, 'danh-sach-san-pham.csv'),
    '\uFEFF' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n'),
    'utf8'
  );

  const totalImages = products.reduce((s, p) => s + p._count.images, 0);
  console.log(`Đã tạo ${products.length} folder (mới: ${created}) tại: ${OUT_DIR}`);
  console.log(`Tổng số ảnh cần bổ sung: ${totalImages}`);
  console.log('File danh sách: danh-sach-san-pham.csv');

  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
