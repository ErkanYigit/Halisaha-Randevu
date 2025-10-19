import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const body = await req.json();
    const { matchRequestId, message } = body;

    if (!matchRequestId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Match request ID gerekli' 
      }, { status: 400 });
    }

    // Match request'in var olduğunu ve açık olduğunu kontrol et
    const matchRequest = await prisma.matchRequest.findFirst({
      where: {
        id: matchRequestId,
        status: 'OPEN'
      }
    });

    if (!matchRequest) {
      return NextResponse.json({ 
        success: false, 
        error: 'İlan bulunamadı veya artık açık değil' 
      }, { status: 404 });
    }

    // Kullanıcının kendi ilanına katılmaya çalışmadığını kontrol et
    if (matchRequest.creatorId === (session.user as any).id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kendi ilanınıza katılamazsınız' 
      }, { status: 400 });
    }

    // Kullanıcının daha önce bu ilana katılım isteği gönderip göndermediğini kontrol et
    const existingJoinRequest = await prisma.joinRequest.findFirst({
      where: {
        matchRequestId: matchRequestId,
        userId: (session.user as any).id
      }
    });

    if (existingJoinRequest) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bu ilana zaten katılım isteği gönderdiniz' 
      }, { status: 400 });
    }

    // Join request oluştur
    const joinRequest = await prisma.joinRequest.create({
      data: {
        matchRequestId,
        userId: (session.user as any).id,
        message: message || null,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: joinRequest,
      message: 'Katılım isteğiniz gönderildi' 
    });

  } catch (error) {
    console.error('Join request oluşturulurken hata:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
