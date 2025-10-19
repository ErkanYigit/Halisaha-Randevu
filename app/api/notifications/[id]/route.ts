import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notificationId = params.id;
    
    // Bildirim ID'sinden join request ID'sini çıkar
    const joinRequestId = notificationId.replace('incoming_', '').replace('outgoing_', '');

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Join request'i bul ve yetki kontrolü yap
    const joinRequest = await prisma.joinRequest.findFirst({
      where: { id: joinRequestId },
      include: { matchRequest: true }
    });

    if (!joinRequest) {
      return NextResponse.json({ error: 'Bildirim bulunamadı' }, { status: 404 });
    }

    // Yetki kontrolü - kullanıcı ya ilan sahibi ya da istek gönderen olmalı
    const isOwner = joinRequest.matchRequest.creatorId === user.id;
    const isRequester = joinRequest.userId === user.id;

    if (!isOwner && !isRequester) {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 });
    }

    // Join request'i sil
    await prisma.joinRequest.delete({
      where: { id: joinRequestId }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Bildirim silindi' 
    });

  } catch (error) {
    console.error('Bildirim silinirken hata:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
