import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json([], { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json([], { status: 404 });

  const appointments = await prisma.appointment.findMany({
    where: {
      userId: user.id,
      status: 'completed',
    },
    include: {
      field: true,
    },
    orderBy: { startTime: 'desc' },
  });

  const result = appointments.map(app => ({
    id: app.id,
    fieldName: app.field?.name || '',
    fieldLocation: app.field?.location || '',
    date: app.startTime,
    startTime: app.startTime,
    endTime: app.endTime,
    status: app.status,
    depositPaid: app.depositPaid,
  }));

  return NextResponse.json(result);
} 