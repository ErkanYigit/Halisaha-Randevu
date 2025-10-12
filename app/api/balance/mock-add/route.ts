import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId, amount } = await req.json();

  const user = await prisma.user.update({
    where: { id: userId },
    data: { balance: { increment: amount } }
  });

  return NextResponse.json({ success: true, newBalance: user.balance });
} 