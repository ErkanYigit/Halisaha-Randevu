import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const matchRequestId = searchParams.get('id');

    if (!matchRequestId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Match request ID gerekli' 
      }, { status: 400 });
    }

    // Match request'i bul ve kullanıcının sahibi olduğunu kontrol et
    const matchRequest = await prisma.matchRequest.findFirst({
      where: {
        id: matchRequestId,
        creatorId: (session.user as any).id
      }
    });

    if (!matchRequest) {
      return NextResponse.json({ 
        success: false, 
        error: 'İlan bulunamadı veya bu işlem için yetkiniz yok' 
      }, { status: 404 });
    }

    // Match request'i kapat
    await prisma.matchRequest.update({
      where: { id: matchRequestId },
      data: { status: 'CLOSED' }
    });

    // İlgili join request'leri de kapat
    await prisma.joinRequest.updateMany({
      where: { 
        matchRequestId: matchRequestId,
        status: 'PENDING'
      },
      data: { status: 'REJECTED' }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'İlan başarıyla iptal edildi' 
    });

  } catch (error) {
    console.error('Match request iptal edilirken hata:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
