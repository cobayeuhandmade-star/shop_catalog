"use client";

import { useState } from "react";
import styles from "./GallerySection.module.css";

type GalleryImage = {
  id: number;
  url: string;
  title: string | null;
  order: number;
};

type GalleryClientProps = {
  galleryItems: GalleryImage[];
};

export default function GalleryClient({ galleryItems }: GalleryClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  if (!galleryItems || galleryItems.length === 0) {
    return null; // Không render nếu không có ảnh
  }

  return (
    <>
      <div className={styles.grid}>
        {galleryItems.map((item, index) => (
          <div 
            key={item.id} 
            className={styles.imageCard}
            onClick={() => openLightbox(index)}
          >
            <img 
              src={item.url} 
              alt={item.title || "Gallery Image"} 
              className={styles.galleryImage} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className={styles.overlay}>
              <svg className={styles.zoomIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Đóng">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={showPrev} aria-label="Ảnh trước">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img 
              src={galleryItems[currentImageIndex].url} 
              alt={galleryItems[currentImageIndex].title || "Gallery"} 
              className={styles.lightboxImage}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            <div style={{ position: 'absolute', bottom: '20px', color: 'white', textAlign: 'center', width: '100%', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
              {galleryItems[currentImageIndex].title} ({currentImageIndex + 1} / {galleryItems.length})
            </div>
          </div>
          
          <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={showNext} aria-label="Ảnh tiếp theo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
