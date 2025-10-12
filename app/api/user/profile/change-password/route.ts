import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '../../../auth/[...nextauth]/route';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Tüm alanlar zorunlu." }, { status: 400 });
  }
  // Şifre kuralları
  if (newPassword.length < 8) return NextResponse.json({ error: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  if (!/[A-Z]/.test(newPassword)) return NextResponse.json({ error: "Şifre en az bir büyük harf içermeli." }, { status: 400 });
  if (!/[a-z]/.test(newPassword)) return NextResponse.json({ error: "Şifre en az bir küçük harf içermeli." }, { status: 400 });
  if (!/[0-9]/.test(newPassword)) return NextResponse.json({ error: "Şifre en az bir rakam içermeli." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return NextResponse.json({ error: "Mevcut şifre yanlış." }, { status: 400 });
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { email: session.user.email }, data: { password: hashed } });
  return NextResponse.json({ success: true });
} 