"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function DeleteProductBtn({ id, productName }: { id: number, productName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?\nHành động này không thể hoàn tác!`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Xóa thất bại");
      }

      router.refresh(); // Refresh lại data của table
    } catch (error) {
      alert("Đã xảy ra lỗi khi xóa sản phẩm.");
      setIsDeleting(false);
    }
  };

  return (
    <button 
      className={styles.deleteBtn} 
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Đang xóa..." : "Xóa"}
    </button>
  );
}
