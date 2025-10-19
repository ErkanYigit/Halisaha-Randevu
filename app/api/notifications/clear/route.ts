import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Kullanıcının match request'lerini bul
    const userMatchRequests = await prisma.matchRequest.findMany({
      where: { creatorId: user.id },
      select: { id: true }
    });

    const matchRequestIds = userMatchRequests.map(mr => mr.id);

    // Kullanıcının kendi join request'lerini bul
    const userJoinRequests = await prisma.joinRequest.findMany({
      where: { userId: user.id },
      select: { id: true }
    });

    const userJoinRequestIds = userJoinRequests.map(jr => jr.id);

    // Tüm ilgili join request'leri sil
    await prisma.joinRequest.deleteMany({
      where: {
        OR: [
          { matchRequestId: { in: matchRequestIds } }, // Kullanıcının ilanlarına gelen istekler
          { id: { in: userJoinRequestIds } } // Kullanıcının gönderdiği istekler
        ]
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Tüm bildirimler temizlendi' 
    });

  } catch (error) {
    console.error('Bildirimler temizlenirken hata:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
