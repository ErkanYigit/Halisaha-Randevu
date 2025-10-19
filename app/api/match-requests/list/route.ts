import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const level = searchParams.get('level');
    const fieldId = searchParams.get('fieldId');
    const city = searchParams.get('city');
    const page = parseInt(searchParams.get('page') || '1');

    const where: any = {
      status: 'OPEN'
    };

    if (date) {
      where.date = new Date(date);
    }

    if (level) {
      where.level = level;
    }

    if (fieldId) {
      where.fieldId = fieldId;
    }

    if (city) {
      where.field = {
        city: city
      };
    }

    const matchRequests = await prisma.matchRequest.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        field: true,
        joinRequests: {
          where: {
            status: 'APPROVED'
          },
          select: {
            id: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * 10,
      take: 10
    });

    // Onaylanan oyuncu sayısını ekle
    const matchRequestsWithCount = matchRequests.map(mr => ({
      ...mr,
      approvedPlayersCount: mr.joinRequests.length,
      approvedPlayers: mr.joinRequests.map(jr => jr.user.name)
    }));

    return NextResponse.json({ 
      success: true, 
      data: matchRequestsWithCount 
    });

  } catch (error) {
    console.error('Match requests listesi yüklenirken hata:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
