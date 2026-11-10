/**
 * Kiểm tra bộ ảnh gốc trước khi upload.
 *
 * Chạy: node scripts/check-image-folders.js
 * Đọc folder ../anh-san-pham/<id>-<slug>/ và so sánh với số ảnh hiện có trong DB.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.resolve(ROOT, '..', 'anh-san-pham');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

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

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('Chưa có folder ảnh gốc:', SRC_DIR);
    process.exit(1);
  }

  const products = await prisma.product.findMany({
    select: { id: true, name: true, _count: { select: { images: true } } },
    orderBy: { id: 'asc' },
  });

  const folders = fs
    .readdirSync(SRC_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const byId = new Map();
  for (const f of folders) {
    const id = parseInt(f.split('-')[0], 10);
    if (!Number.isNaN(id)) byId.set(id, f);
  }

  let ok = 0;
  let empty = 0;
  let fewer = 0;
  let more = 0;
  const problems = [];

  for (const p of products) {
    const folder = byId.get(p.id);
    if (!folder) {
      problems.push(`#${p.id} ${p.name}: KHÔNG có folder`);
      continue;
    }
    const files = fs
      .readdirSync(path.join(SRC_DIR, folder), { withFileTypes: true })
      .filter((f) => f.isFile() && IMAGE_EXT.has(path.extname(f.name).toLowerCase()));

    const expect = p._count.images;
    if (files.length === 0) {
      empty++;
      problems.push(`#${p.id} ${p.name}: folder rỗng (cần ${expect})`);
    } else if (files.length < expect) {
      fewer++;
      problems.push(`#${p.id} ${p.name}: có ${files.length}/${expect} ảnh`);
    } else {
      if (files.length > expect) {
        more++;
        problems.push(`#${p.id} ${p.name}: có ${files.length} ảnh (DB cũ ${expect}) - vẫn ok`);
      }
      ok++;
    }
  }

  console.log('===== KẾT QUẢ KIỂM TRA =====');
  console.log(`Sản phẩm đủ ảnh : ${ok}`);
  console.log(`Folder rỗng     : ${empty}`);
  console.log(`Thiếu ảnh       : ${fewer}`);
  console.log(`Nhiều hơn DB cũ : ${more}`);
  if (problems.length) {
    console.log('\n--- Chi tiết ---');
    for (const line of problems) console.log(line);
  }

  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
