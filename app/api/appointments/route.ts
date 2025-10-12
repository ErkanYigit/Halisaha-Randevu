import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// Rezervasyon ekle
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userEmail, fieldId, date, startTime, endTime } = body;

    let finalUserId = userId;
    if (!finalUserId && userEmail) {
      const user = await prisma.user.findUnique({ where: { email: userEmail } });
      if (!user) {
        return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
      }
      finalUserId = user.id;
    }
    if (!finalUserId) {
      return NextResponse.json({ error: 'Kullanıcı ID veya email gerekli.' }, { status: 400 });
    }

    // Aynı saha, gün ve saat için çakışma kontrolü (sadece confirmed olanlar için)
    const existing = await prisma.appointment.findFirst({
      where: {
        fieldId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: 'confirmed',
      },
    });
    if (existing) {
      return NextResponse.json({ error: 'Bu saat aralığı dolu.' }, { status: 409 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: finalUserId,
        fieldId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: 'pending',
        depositPaid: false,
      },
    });
    // Ödeme bekleniyor mesajı
    return NextResponse.json({
      message: 'Rezervasyon talebiniz alındı. Onay için ödeme gereklidir.',
      appointmentId: appointment.id,
      status: 'pending',
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}

// Dolu saatleri getir (sadece confirmed olanlar)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const fieldId = searchParams.get('fieldId');
  const date = searchParams.get('date');

  // Eğer fieldId ve date varsa: dolu saatleri getir (herkes görebilir)
  if (fieldId && date) {
    const appointments = await prisma.appointment.findMany({
      where: {
        fieldId,
        date: new Date(date),
        status: 'confirmed',
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });
    return NextResponse.json(appointments);
  }

  // Sadece giriş yapan kullanıcının randevularını getir
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const appointments = await prisma.appointment.findMany({
    where: { userId: user.id },
    include: { field: { select: { name: true } } },
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(appointments);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Silinemedi.' }, { status: 500 });
  }
} 