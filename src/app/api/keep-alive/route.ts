import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Thực hiện 1 truy vấn rất nhẹ (đếm số user hoặc product) để đánh thức Database
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: "ok", 
      message: "Database is awake and active!" 
    });
  } catch (error) {
    console.error("Keep-alive DB check failed:", error);
    return NextResponse.json({ 
      status: "error", 
      message: "Failed to connect to database"
    }, { status: 500 });
  }
}
