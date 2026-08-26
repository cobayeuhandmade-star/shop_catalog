"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    
    await signIn("credentials", {
      username,
      password,
      redirectTo: "/admin/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Tài khoản hoặc mật khẩu không đúng.";
        default:
          return "Đã xảy ra lỗi hệ thống. Vui lòng thử lại.";
      }
    }
    // Phải ném lỗi ra ngoài để Next.js thực hiện lệnh redirect
    throw error;
  }
}
