import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      location: true,
      createdAt: true,
      lastLogin: true,
      balance: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 });
  }
  const data = await req.json();
  const { name, email, phone, location } = data;
  try {
    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        email,
        phone,
        location,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        createdAt: true,
        lastLogin: true,
        balance: true,
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Güncelleme başarısız.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 });
  }
  const { currentPassword, newPassword, newPasswordRepeat } = await req.json();
  if (!currentPassword || !newPassword || !newPasswordRepeat) {
    return NextResponse.json({ error: 'Tüm alanlar zorunlu.' }, { status: 400 });
  }
  if (newPassword !== newPasswordRepeat) {
    return NextResponse.json({ error: 'Yeni şifreler eşleşmiyor.' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
  }
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Mevcut şifre yanlış.' }, { status: 400 });
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { email: session.user.email }, data: { password: hashed } });
  return NextResponse.json({ success: true });
} 