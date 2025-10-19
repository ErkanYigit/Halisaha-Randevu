import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { prisma } from '../../../../../../lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const { id } = params;

    // Join request'i bul ve match request'in kullanıcının sahibi olduğunu kontrol et
    const joinRequest = await prisma.joinRequest.findFirst({
      where: { id: id },
      include: {
        matchRequest: true
      }
    });

    if (!joinRequest) {
      return NextResponse.json({ 
        success: false, 
        error: 'Katılım isteği bulunamadı' 
      }, { status: 404 });
    }

    if (joinRequest.matchRequest.creatorId !== (session.user as any).id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bu işlem için yetkiniz yok' 
      }, { status: 403 });
    }

    if (joinRequest.status !== 'PENDING') {
      return NextResponse.json({ 
        success: false, 
        error: 'Bu istek zaten işleme alınmış' 
      }, { status: 400 });
    }

    // Join request'i onayla
    await prisma.joinRequest.update({
      where: { id: id },
      data: { status: 'APPROVED' }
    });

    // Onaylanan oyuncu sayısını kontrol et
    const approvedCount = await prisma.joinRequest.count({
      where: {
        matchRequestId: joinRequest.matchRequestId,
        status: 'APPROVED'
      }
    });

    // Eğer aranan kişi sayısı kadar oyuncu onaylandıysa ilanı kapat
    if (approvedCount >= joinRequest.matchRequest.lookingForTeamSize) {
      await prisma.matchRequest.update({
        where: { id: joinRequest.matchRequestId },
        data: { status: 'MATCHED' }
      });

      // Kalan pending join request'leri reddet
      await prisma.joinRequest.updateMany({
        where: { 
          matchRequestId: joinRequest.matchRequestId,
          status: 'PENDING'
        },
        data: { status: 'REJECTED' }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Katılım isteği onaylandı' 
    });

  } catch (error) {
    console.error('Join request onaylanırken hata:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
