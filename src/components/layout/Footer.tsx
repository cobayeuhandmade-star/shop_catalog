import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.container}>
        <div className={styles.column}>
          <h3>DECOR SHOP</h3>
          <p>Không gian sống đẹp hơn mỗi ngày.</p>
          <p>Chúng tôi cung cấp các sản phẩm trang trí nội thất, phụ kiện Noel, Tết và hoa khô cao cấp.</p>
        </div>

        <div className={styles.column}>
          <h3>Thông tin liên hệ</h3>
          <p>📍 Địa chỉ: [Sẽ cập nhật sau]</p>
          <p>📞 SĐT: [Sẽ cập nhật sau]</p>
          <p>✉️ Email: [Sẽ cập nhật sau]</p>
        </div>

        <div className={styles.column}>
          <h3>Kết nối với chúng tôi</h3>
          <div className={styles.socials}>
            <Link href="#" className={`${styles.socialIcon} ${styles.facebook}`} aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Link>
            <Link href="#" className={`${styles.socialIcon} ${styles.instagram}`} aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
            <Link href="#" className={`${styles.socialIcon} ${styles.tiktok}`} aria-label="TikTok">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} Decor Shop. All rights reserved.
      </div>
    </footer>
  );
}
