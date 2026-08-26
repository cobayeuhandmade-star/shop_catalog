"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";
import styles from "./page.module.css";
import Link from "next/link";

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <h1 className={`text-heading-2 ${styles.title}`}>Admin Panel</h1>
          <p className={styles.subtitle}>
            Đăng nhập để quản lý cửa hàng Decor Shop
          </p>
        </div>

        <form action={dispatch}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">
              Tên đăng nhập
            </label>
            <input
              className={styles.input}
              id="username"
              type="text"
              name="username"
              placeholder="Nhập admin..."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Mật khẩu
            </label>
            <input
              className={styles.input}
              id="password"
              type="password"
              name="password"
              placeholder="Nhập admin123..."
              required
            />
          </div>

          {errorMessage && (
            <div className={styles.error} aria-live="polite" aria-atomic="true">
              {errorMessage}
            </div>
          )}

          <button 
            type="submit" 
            className={`btn btn-primary ${styles.submitBtn}`}
            aria-disabled={isPending}
            disabled={isPending}
          >
            {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "var(--space-lg)" }}>
          <Link href="/" className="text-muted" style={{ fontSize: "var(--font-size-sm)", textDecoration: "underline" }}>
            &larr; Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
