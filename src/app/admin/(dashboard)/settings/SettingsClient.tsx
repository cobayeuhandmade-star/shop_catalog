"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type GalleryImage = {
  id: number;
  url: string;
  title: string | null;
};

type SettingsClientProps = {
  initialAboutImage: string;
  initialGallery: GalleryImage[];
};

export default function SettingsClient({ initialAboutImage, initialGallery }: SettingsClientProps) {
  const router = useRouter();
  
  // States cho About Image
  const [aboutImage, setAboutImage] = useState(initialAboutImage);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const aboutInputRef = useRef<HTMLInputElement>(null);

  // States cho Gallery
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // --- LOGIC CHO ABOUT IMAGE ---
  const handleAboutFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAboutImageFile(file);
      setAboutImage(URL.createObjectURL(file)); // Preview
    }
  };

  const saveAboutImage = async () => {
    setIsSavingAbout(true);
    try {
      let finalUrl = aboutImage;
      
      // Nếu có chọn file mới thì upload trước
      if (aboutImageFile) {
        const formData = new FormData();
        formData.append("file", aboutImageFile);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error("Upload ảnh thất bại");
        const uploadData = await uploadRes.json();
        finalUrl = uploadData.url;
      }

      // Lưu url vào Settings
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "ABOUT_IMAGE", value: finalUrl }),
      });

      if (!res.ok) throw new Error("Lưu cài đặt thất bại");
      
      alert("Đã lưu ảnh Về chúng tôi!");
      setAboutImageFile(null); // Reset file sau khi lưu thành công
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSavingAbout(false);
    }
  };

  // --- LOGIC CHO GALLERY ---
  const handleGalleryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploadingGallery(true);
    try {
      const files = Array.from(e.target.files);
      
      // Upload từng file và lưu vào DB luôn cho nhanh
      for (const file of files) {
        // 1. Upload file
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error("Upload ảnh thất bại");
        const uploadData = await uploadRes.json();
        
        // 2. Lưu vào DB Gallery
        const dbRes = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: uploadData.url, title: "Hình ảnh thực tế" }),
        });
        
        if (!dbRes.ok) throw new Error("Lưu vào gallery thất bại");
        
        const newImage = await dbRes.json();
        setGallery((prev) => [...prev, newImage]);
      }
      
      // Reset input
      if (galleryInputRef.current) galleryInputRef.current.value = "";
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const deleteGalleryImage = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này khỏi Gallery?")) return;
    
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Xóa ảnh thất bại");
      
      setGallery((prev) => prev.filter(img => img.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      {/* SECTION 1: ABOUT IMAGE */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hình ảnh "Về chúng tôi" (About Section)</h2>
        
        <div className={styles.formGroup}>
          <label>Ảnh hiển thị hiện tại:</label>
          <img src={aboutImage} alt="About Preview" className={styles.previewImage} />
        </div>
        
        <div className={styles.formGroup}>
          <input 
            type="file" 
            accept="image/*" 
            ref={aboutInputRef} 
            onChange={handleAboutFileSelect}
            style={{ display: "none" }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-outline" onClick={() => aboutInputRef.current?.click()}>
              Chọn ảnh mới
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={saveAboutImage}
              disabled={isSavingAbout || !aboutImageFile}
            >
              {isSavingAbout ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: GALLERY */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hình ảnh thực tế (Gallery)</h2>
        
        <div className={styles.formGroup}>
          <input 
            type="file" 
            accept="image/*" 
            multiple
            ref={galleryInputRef} 
            onChange={handleGalleryFileSelect}
            style={{ display: "none" }}
          />
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={() => galleryInputRef.current?.click()}
            disabled={isUploadingGallery}
          >
            {isUploadingGallery ? "Đang tải ảnh lên..." : "+ Tải lên ảnh mới"}
          </button>
        </div>

        <div className={styles.galleryGrid}>
          {gallery.length === 0 && <p className="text-muted">Chưa có ảnh nào trong Gallery.</p>}
          
          {gallery.map((img) => (
            <div key={img.id} className={styles.galleryCard}>
              <div className={styles.galleryImageWrapper}>
                <img src={img.url} alt={img.title || "Gallery image"} className={styles.galleryImage} />
              </div>
              <div className={styles.galleryInfo}>
                <button 
                  type="button" 
                  className={styles.deleteBtn}
                  onClick={() => deleteGalleryImage(img.id)}
                >
                  Xóa ảnh này
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
