// File: C:\Users\erkan\OneDrive\Desktop\projes\cursordenemeleri\site1\app\api\auth\register\route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, email, phone, password } = await req.json();

  console.log("Kayıt isteği alındı:", { name, email, phone });

  // Şifre kuralları
  if (!password || password.length < 8) return NextResponse.json({ success: false, error: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  if (!/[A-Z]/.test(password)) return NextResponse.json({ success: false, error: "Şifre en az bir büyük harf içermeli." }, { status: 400 });
  if (!/[a-z]/.test(password)) return NextResponse.json({ success: false, error: "Şifre en az bir küçük harf içermeli." }, { status: 400 });
  if (!/[0-9]/.test(password)) return NextResponse.json({ success: false, error: "Şifre en az bir rakam içermeli." }, { status: 400 });

  // Şifreyi hash'le
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json({ success: false, error: error?.message || "Bilinmeyen hata" }, { status: 400 });
  }
}
