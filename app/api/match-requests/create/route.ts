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
    const { fieldId, date, time, teamSize, lookingForTeamSize, level, feeSharing, description } = body;
    
    console.log('Match request create - User ID:', (session.user as any).id);
    console.log('Match request create - Field ID:', fieldId);
    console.log('Match request create - Date:', date);
    console.log('Match request create - Time:', time);

    // Validasyon
    if (!fieldId || !date || !time || !teamSize || !lookingForTeamSize || !level || !feeSharing) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tüm gerekli alanları doldurun' 
      }, { status: 400 });
    }

    // Kullanıcının email'ini kullanarak user ID'sini bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kullanıcı bulunamadı' 
      }, { status: 404 });
    }

    // Kullanıcının bu sahada ve tarihte rezervasyonu olduğunu kontrol et
    const appointment = await prisma.appointment.findFirst({
      where: {
        userId: user.id,
        fieldId: fieldId,
        date: new Date(date)
      }
    });

    console.log('Found appointment:', appointment);
    console.log('User ID from session:', (session.user as any).id);
    console.log('User ID from database:', user.id);
    
    if (!appointment) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bu sahada ve tarihte rezervasyonunuz bulunmuyor' 
      }, { status: 400 });
    }

    if (appointment.status !== 'confirmed') {
      return NextResponse.json({ 
        success: false, 
        error: `Bu rezervasyon henüz onaylanmamış (${appointment.status}). Onaylandıktan sonra ilan oluşturabilirsiniz.` 
      }, { status: 400 });
    }

    // Seçilen saat ile rezervasyon saati eşleşiyor mu kontrol et
    const appointmentStartTime = new Date(appointment.startTime);
    const appointmentHour = appointmentStartTime.getHours();
    const requestedHour = parseInt(time.split(':')[0]);
    
    if (appointmentHour !== requestedHour) {
      return NextResponse.json({ 
        success: false, 
        error: `Bu sahadaki rezervasyonunuz ${appointmentHour}:00 saatinde. Seçtiğiniz saat (${requestedHour}:00) ile eşleşmiyor.` 
      }, { status: 400 });
    }

    // Aynı tarih ve saatte zaten bir ilan var mı kontrol et
    const existingMatchRequest = await prisma.matchRequest.findFirst({
      where: {
        fieldId: fieldId,
        date: new Date(date),
        time: time,
        status: 'OPEN'
      }
    });

    if (existingMatchRequest) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bu tarih ve saatte zaten açık bir ilan bulunuyor' 
      }, { status: 400 });
    }

    // Match request oluştur
    const matchRequest = await prisma.matchRequest.create({
      data: {
        fieldId,
        date: new Date(date),
        time,
        teamSize: parseInt(teamSize),
        lookingForTeamSize: parseInt(lookingForTeamSize),
        level,
        feeSharing,
        description: description || null,
        status: 'OPEN',
        creatorId: user.id
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        field: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: matchRequest 
    });

  } catch (error) {
    console.error('Match request oluşturulurken hata:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
