import { NextResponse } from "next/server";
import twilio from "twilio";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { phoneNumber } = await req.json();
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Telefon numarası gereklidir" },
        { status: 400 }
      );
    }

    // 6 haneli rastgele kod oluştur
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Kodu veritabanında sakla
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        phoneVerificationCode: verificationCode,
        phoneVerificationExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 dakika geçerli
      },
    });

    // SMS gönder
    await client.messages.create({
      body: `Halı Saha Rezervasyon - Doğrulama kodunuz: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return NextResponse.json({ message: "Doğrulama kodu gönderildi" });
  } catch (error) {
    console.error("SMS gönderme hatası:", error);
    return NextResponse.json(
      { error: "SMS gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 