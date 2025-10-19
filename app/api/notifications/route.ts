import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kullanıcının email'ini kullanarak user ID'sini bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Kullanıcının match request'lerini al (kendi oluşturduğu ilanlar)
    const userMatchRequests = await prisma.matchRequest.findMany({
      where: {
        creatorId: user.id
      },
      select: {
        id: true
      }
    });

    const matchRequestIds = userMatchRequests.map(mr => mr.id);

    // Bu ilanlara gelen join request'leri al (PENDING, APPROVED, REJECTED)
    const joinRequests = await prisma.joinRequest.findMany({
      where: {
        matchRequestId: {
          in: matchRequestIds
        },
        status: {
          in: ['PENDING', 'APPROVED', 'REJECTED']
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        matchRequest: {
          select: {
            id: true,
            field: {
              select: {
                name: true
              }
            },
            date: true,
            time: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Kullanıcının kendi gönderdiği join request'leri de al
    const userJoinRequests = await prisma.joinRequest.findMany({
      where: {
        userId: user.id,
        status: {
          in: ['APPROVED', 'REJECTED']
        }
      },
      include: {
        matchRequest: {
          select: {
            id: true,
            field: {
              select: {
                name: true
              }
            },
            date: true,
            time: true,
            creator: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Gelen katılım istekleri için bildirimler
    const incomingNotifications = joinRequests.map(joinRequest => ({
      id: `incoming_${joinRequest.id}`,
      type: 'join_request' as const,
      title: joinRequest.status === 'PENDING' ? 'Yeni Katılım İsteği' : 
             joinRequest.status === 'APPROVED' ? 'Katılım İsteği Onaylandı' :
             'Katılım İsteği Reddedildi',
      message: joinRequest.status === 'PENDING' ? 
        `${joinRequest.user.name} "${joinRequest.matchRequest.field.name}" sahasındaki ilanınıza katılmak istiyor.` :
        joinRequest.status === 'APPROVED' ?
        `${joinRequest.user.name} "${joinRequest.matchRequest.field.name}" sahasındaki ilanınıza katılım isteğini onayladınız.` :
        `${joinRequest.user.name} "${joinRequest.matchRequest.field.name}" sahasındaki ilanınıza katılım isteğini reddettiniz.`,
      date: joinRequest.status === 'PENDING' ? 
        joinRequest.createdAt.toISOString().split('T')[0] :
        joinRequest.updatedAt.toISOString().split('T')[0],
      isRead: joinRequest.status !== 'PENDING',
      joinRequest: {
        id: joinRequest.id,
        message: joinRequest.message,
        userName: joinRequest.user.name,
        userEmail: joinRequest.user.email,
        fieldName: joinRequest.matchRequest.field.name,
        matchRequestId: joinRequest.matchRequestId,
        date: joinRequest.matchRequest.date,
        time: joinRequest.matchRequest.time,
        status: joinRequest.status,
        rejectionReason: joinRequest.rejectionReason
      }
    }));

    // Kendi gönderdiği istekler için bildirimler
    const outgoingNotifications = userJoinRequests.map(joinRequest => ({
      id: `outgoing_${joinRequest.id}`,
      type: 'join_request' as const,
      title: joinRequest.status === 'APPROVED' ? 'Katılım İsteğiniz Onaylandı!' : 'Katılım İsteğiniz Reddedildi',
      message: joinRequest.status === 'APPROVED' ?
        `${joinRequest.matchRequest.creator.name} "${joinRequest.matchRequest.field.name}" sahasındaki ilanınıza katılım isteğinizi onayladı!` :
        `${joinRequest.matchRequest.creator.name} "${joinRequest.matchRequest.field.name}" sahasındaki ilanınıza katılım isteğinizi reddetti.`,
      date: joinRequest.updatedAt.toISOString().split('T')[0],
      isRead: false,
      joinRequest: {
        id: joinRequest.id,
        message: joinRequest.message,
        userName: joinRequest.matchRequest.creator.name,
        userEmail: '',
        fieldName: joinRequest.matchRequest.field.name,
        matchRequestId: joinRequest.matchRequestId,
        date: joinRequest.matchRequest.date,
        time: joinRequest.matchRequest.time,
        status: joinRequest.status,
        rejectionReason: joinRequest.rejectionReason
      }
    }));

    // Tüm bildirimleri birleştir
    const notifications = [...incomingNotifications, ...outgoingNotifications];

    return NextResponse.json({ success: true, notifications });

  } catch (error) {
    console.error('Bildirimler getirilirken hata:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
