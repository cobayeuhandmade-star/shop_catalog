"use client";

import styles from "./ParallaxBanner.module.css";

export default function ParallaxBanner() {
  return (
    <section className={styles.parallaxSection}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h3 className={styles.quote}>
          &quot;Không gian sống là tấm gương phản chiếu tâm hồn.<br />
          Hãy để sự tinh tế lên tiếng.&quot;
        </h3>
        <p className={styles.author}>Yêu Handmade</p>
      </div>
    </section>
  );
}
