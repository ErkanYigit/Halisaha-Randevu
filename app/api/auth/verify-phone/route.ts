import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { code, phoneNumber } = await req.json();
    if (!code || !phoneNumber) {
      return NextResponse.json(
        { error: "Doğrulama kodu ve telefon numarası gereklidir" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Kodun geçerliliğini kontrol et
    if (
      user.phoneVerificationCode !== code ||
      !user.phoneVerificationExpires ||
      new Date() > user.phoneVerificationExpires
    ) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş doğrulama kodu" },
        { status: 400 }
      );
    }

    // Telefon numarasını doğrulanmış olarak işaretle
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        phone: phoneNumber,
        phoneVerified: true,
        phoneVerificationCode: null,
        phoneVerificationExpires: null,
      },
    });

    return NextResponse.json({ message: "Telefon numarası doğrulandı" });
  } catch (error) {
    console.error("Telefon doğrulama hatası:", error);
    return NextResponse.json(
      { error: "Doğrulama sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
} 