import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      location: true,
      createdAt: true,
      lastLogin: true,
      phoneVerified: true,
      balance: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const updated = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: data.name,
      phone: data.phone,
      location: data.location,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      location: true,
      createdAt: true,
      lastLogin: true,
      phoneVerified: true,
      balance: true,
    },
  });

  return NextResponse.json(updated);
}
