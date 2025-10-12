import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body;
  const user: any = await prisma.user.findUnique({
    where: { email },
    include: { fields: true },
  });
  if (!user || user.role !== "owner") return res.status(401).json({ error: "Kullanıcı bulunamadı" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Şifre yanlış" });
  const token = jwt.sign(
    { userId: user.id, fieldId: user.fields[0]?.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
  res.json({ token });
} 