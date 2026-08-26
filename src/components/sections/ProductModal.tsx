"use client";

import { useEffect, useState } from "react";
import styles from "./ProductModal.module.css";
import { Product } from "./ProductCard";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Lấy danh sách ảnh thật, hoặc dùng mảng trống nếu không có ảnh
  const images = product.images && product.images.length > 0 ? product.images : [];

  // Khóa cuộn trang và lắng nghe phím ESC
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Cột trái: Hình ảnh */}
        <div className={styles.gallery}>
          <div className={styles.mainImageContainer}>
            {images.length > 1 && (
              <button className={`${styles.navButton} ${styles.navPrev}`} onClick={prevImage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}
            
            {images.length > 0 ? (
              <img 
                src={images[currentImageIndex].url} 
                alt={product.name} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            ) : (
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" width="120" height="120" style={{ color: "var(--color-primary-light)"}}>
                <rect x="20" y="20" width="60" height="60" rx="4" />
                <path d="M20 60 L 50 30 L 80 60" />
                <circle cx="40" cy="40" r="5" />
              </svg>
            )}
            
            {images.length > 1 && (
              <button className={`${styles.navButton} ${styles.navNext}`} onClick={nextImage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbnailList}>
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className={`${styles.thumbnail} ${currentImageIndex === index ? styles.thumbnailActive : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={img.url} 
                    alt={`Thumbnail ${index}`} 
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-sm)" }} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cột phải: Thông tin chi tiết */}
        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h2 className={`text-heading-2 ${styles.title}`}>{product.name}</h2>
          <div className={styles.price}>{formatPrice(product.price)}</div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.descriptionTitle}>Thông tin chi tiết</div>
          
          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Phân loại:</span>
              <span className={styles.detailValue}>{product.category}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Chất liệu:</span>
              <span className={styles.detailValue}>{product.material || "Đang cập nhật..."}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Kích thước:</span>
              <span className={styles.detailValue}>{product.size || "Liên hệ để biết chi tiết"}</span>
            </div>
          </div>

          <div className={styles.descriptionTitle}>Mô tả sản phẩm</div>
          <p className={styles.description}>
            {product.description || `Sản phẩm ${product.name} mang phong cách thiết kế hiện đại, tinh tế, là điểm nhấn hoàn hảo cho không gian sống của bạn.`}
          </p>
          
          <div className={styles.actionArea}>
            <a href="#contact" onClick={onClose} className={`btn btn-primary ${styles.contactBtn}`}>
              Liên hệ tư vấn / Mua hàng
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
