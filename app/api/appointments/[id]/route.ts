import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Randevu durumunu güncelle (iptal et)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    const { status } = body;
    
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status }
    });
    
    return NextResponse.json({ success: true, appointment: updatedAppointment });
  } catch (e) {
    console.error('Randevu güncellenirken hata:', e);
    return NextResponse.json({ error: 'Güncellenemedi.' }, { status: 500 });
  }
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
