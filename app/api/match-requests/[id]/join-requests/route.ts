import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const { id } = params;

    // Match request'in kullanıcının sahibi olduğunu kontrol et
    const matchRequest = await prisma.matchRequest.findFirst({
      where: {
        id: id,
        creatorId: (session.user as any).id
      }
    });

    if (!matchRequest) {
      return NextResponse.json({ 
        success: false, 
        error: 'İlan bulunamadı veya bu işlem için yetkiniz yok' 
      }, { status: 404 });
    }

    // Join request'leri getir
    const joinRequests = await prisma.joinRequest.findMany({
      where: {
        matchRequestId: id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Join request'leri düzenle
    const formattedJoinRequests = joinRequests.map(jr => ({
      id: jr.id,
      userId: jr.user.id,
      userName: jr.user.name,
      userEmail: jr.user.email,
      message: jr.message,
      status: jr.status,
      createdAt: jr.createdAt
    }));

    return NextResponse.json({ 
      success: true, 
      data: formattedJoinRequests 
    });

  } catch (error) {
    console.error('Join requests yüklenirken hata:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
