"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductForm.module.css";
import Image from "next/image";

type ProductImage = {
  id?: number;
  url: string;
  isMain: boolean;
  order: number;
  file?: File;
};

type ProductFormProps = {
  initialData?: any;
  isEditing?: boolean;
};

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || "",
    category: initialData?.category || "Nội thất",
    subCategory: initialData?.subCategory || "",
    material: initialData?.material || "",
    size: initialData?.size || "",
    description: initialData?.description || "",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    isFeatured: initialData?.isFeatured || false,
  });

  const [images, setImages] = useState<ProductImage[]>(
    initialData?.images || []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files);
    const newImages = newFiles.map((file, index) => ({
      url: URL.createObjectURL(file), // Cho mục đích preview
      isMain: images.length === 0 && index === 0, // Tự động set làm ảnh chính nếu là ảnh đầu tiên
      order: images.length + index,
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, index) => index !== indexToRemove);
      // Nếu xóa trúng ảnh chính, set ảnh đầu tiên làm ảnh chính
      if (updated.length > 0 && !updated.some(img => img.isMain)) {
        updated[0].isMain = true;
      }
      return updated;
    });
  };

  const setMainImage = (indexToMain: number) => {
    setImages((prev) => 
      prev.map((img, index) => ({
        ...img,
        isMain: index === indexToMain
      }))
    );
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
    
    for (const img of images) {
      if (img.file) {
        // Ảnh mới cần upload
        const formData = new FormData();
        formData.append("file", img.file);
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) throw new Error("Upload ảnh thất bại");
        const data = await res.json();
        
        uploadedUrls.push({
          url: data.url,
          isMain: img.isMain,
          order: img.order,
        });
      } else {
        // Ảnh cũ đã có URL
        uploadedUrls.push({
          url: img.url,
          isMain: img.isMain,
          order: img.order,
        });
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.name || !formData.price) {
        throw new Error("Vui lòng điền đủ tên và giá sản phẩm");
      }
      
      if (images.length === 0) {
        throw new Error("Vui lòng chọn ít nhất 1 ảnh cho sản phẩm");
      }

      // 1. Upload ảnh mới
      const finalImages = await uploadImages();

      // 2. Lưu sản phẩm
      const url = isEditing ? `/api/products/${initialData.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      // Vì JSON không nhận các hàm hoặc File, ta làm sạch payload
      const payload = {
        ...formData,
        price: Number(formData.price),
        images: finalImages, // Phần API backend (ở route) cần được chỉnh sửa để handle update/create hình ảnh nếu muốn hoàn chỉnh
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Lưu sản phẩm thất bại");

      // Chuyển hướng về trang danh sách
      router.push("/admin/products");
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      {error && (
        <div style={{ padding: "10px", backgroundColor: "#fef2f2", color: "#ef4444", marginBottom: "20px", borderRadius: "4px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tên sản phẩm *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              className={styles.input} 
              placeholder="VD: Sofa vải cao cấp"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Giá bán (VNĐ) *</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleInputChange} 
              className={styles.input} 
              placeholder="VD: 1500000"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Danh mục *</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleInputChange} 
              className={styles.select}
            >
              <option value="Nội thất">Nội thất</option>
              <option value="Noel">Noel</option>
              <option value="Tết">Tết</option>
              <option value="Hoa khô">Hoa khô</option>
            </select>
          </div>

          {formData.category === "Nội thất" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Mục con</label>
              <select 
                name="subCategory" 
                value={formData.subCategory} 
                onChange={handleInputChange} 
                className={styles.select}
              >
                <option value="">-- Chọn mục con --</option>
                <option value="Bàn">Bàn</option>
                <option value="Ghế">Ghế</option>
                <option value="Tủ">Tủ</option>
                <option value="Kệ">Kệ</option>
                <option value="Combo">Combo</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Chất liệu</label>
            <input 
              type="text" 
              name="material" 
              value={formData.material} 
              onChange={handleInputChange} 
              className={styles.input} 
              placeholder="VD: Gỗ sồi, vải nỉ..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Kích thước</label>
            <input 
              type="text" 
              name="size" 
              value={formData.size} 
              onChange={handleInputChange} 
              className={styles.input} 
              placeholder="VD: 120x60x45 cm"
            />
          </div>

          <div className={styles.formGroup} style={{ alignSelf: "center", display: "flex", flexDirection: "column", gap: "10px" }}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                name="isActive" 
                checked={formData.isActive} 
                onChange={handleInputChange} 
              />
              Hiển thị sản phẩm trên website
            </label>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                name="isFeatured" 
                checked={formData.isFeatured} 
                onChange={handleInputChange} 
              />
              Hiển thị ở mục Nổi bật trên Trang chủ
            </label>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Mô tả chi tiết</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              className={styles.textarea} 
              placeholder="Viết mô tả sản phẩm tại đây..."
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className={styles.imageUploadSection}>
          <label className={styles.label}>Hình ảnh sản phẩm * (Ảnh đầu tiên sẽ là ảnh chính)</label>
          
          <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
            <div className={styles.uploadIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32" style={{ margin: "0 auto" }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <p>Click để chọn ảnh (JPG, PNG, WEBP)</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className={styles.hiddenInput} 
              accept="image/png, image/jpeg, image/webp" 
              multiple 
            />
          </div>

          {images.length > 0 && (
            <div className={styles.imageGrid}>
              {images.map((img, index) => (
                <div key={index} className={styles.imageCard}>
                  {img.isMain && <span className={styles.mainBadge}>Ảnh chính</span>}
                  <img src={img.url} alt={`Preview ${index}`} className={styles.imagePreview} />
                  
                  <div className={styles.imageActions}>
                    <button 
                      type="button" 
                      className={styles.actionBtn} 
                      onClick={() => setMainImage(index)}
                      title="Đặt làm ảnh chính"
                    >
                      {img.isMain ? "★" : "☆"}
                    </button>
                    <button 
                      type="button" 
                      className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                      onClick={() => removeImage(index)}
                      title="Xóa ảnh"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn btn-outline" onClick={() => router.push("/admin/products")} disabled={isLoading}>
            Hủy bỏ
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : isEditing ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}
