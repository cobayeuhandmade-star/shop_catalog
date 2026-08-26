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
            <Link href="#" className={styles.socialIcon} aria-label="Facebook">
              F
            </Link>
            <Link href="#" className={styles.socialIcon} aria-label="Instagram">
              I
            </Link>
            <Link href="#" className={styles.socialIcon} aria-label="TikTok">
              T
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
