import sharp from 'sharp';

/** Ảnh upload từ admin tối đa 10MB */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 82;

/**
 * Chuẩn hoá ảnh: xoay theo EXIF, resize cạnh dài tối đa 2000px, nén WebP.
 * Trả về buffer WebP đã tối ưu (thường 100–250KB với ảnh sản phẩm).
 */
export async function optimizeImage(input: Buffer): Promise<Buffer> {
  return sharp(input, { failOn: 'none' })
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();
}

/** Resize theo chiều rộng cố định, dùng cho script tạo nhiều kích thước. */
export async function resizeToWidth(input: Buffer, width: number): Promise<Buffer> {
  return sharp(input, { failOn: 'none' })
    .rotate()
    .resize({ width, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();
}
