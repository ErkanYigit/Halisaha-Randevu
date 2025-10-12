import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function authenticate(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Yetkisiz" });
    return null;
  }
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { userId: string; fieldId?: string; role: string };
  } catch {
    res.status(401).json({ error: "Geçersiz token" });
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = authenticate(req, res);
  if (!user) return;
  const weekStart = req.query.week ? new Date(req.query.week as string) : new Date();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  // Önce bu user'ın sahip olduğu sahayı bul
  const field = await prisma.field.findFirst({ where: { ownerId: user.userId } });
  if (!field) return res.status(404).json({ error: "Saha bulunamadı" });

  const onlyUpcoming = req.query.upcoming === 'true';
  const now = new Date();
  let where: any;
  if (onlyUpcoming) {
    where = {
      AND: [
        { fieldId: field.id },
        {
          OR: [
            { startTime: { gte: now } },
            { endTime: { gte: now } }
          ]
        }
      ]
    };
  } else {
    where = {
      fieldId: field.id,
    };
  }
  console.log('fieldId:', field.id);
  console.log('now:', now);
  const reservations = await prisma.appointment.findMany({
    where,
    orderBy: { date: "asc" },
    include: { user: { select: { name: true } }, field: { select: { name: true } } },
  });
  console.log('reservations:', reservations.length, reservations.map(r => r.id));
  res.json(reservations);
} 