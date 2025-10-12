import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { userId, amount } = await req.json();

  // Kullanıcı bakiyesi kontrolü
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.balance < amount) {
    return NextResponse.json({ error: "Yetersiz bakiye." }, { status: 400 });
  }

  // Bakiyeden düş, rezervasyonu onayla
  await prisma.user.update({
    where: { id: userId },
    data: { balance: { decrement: amount } }
  });

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status: 'confirmed', depositPaid: true }
  });

  return NextResponse.json({ success: true, appointment: updated });
} 