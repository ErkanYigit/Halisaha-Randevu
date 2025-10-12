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
  if (req.method === "GET") {
    const field = await prisma.field.findFirst({ where: { ownerId: user.userId } });
    if (!field) return res.status(404).json({ error: "Saha bulunamadı" });
    return res.json(field);
  }
  if (req.method === "PUT") {
    const { name, address, city, district, phone, email, price, size, description, images, latitude, longitude, features } = req.body;

    const data: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) data.name = name;
    if (address !== undefined) data.address = address;
    if (city !== undefined) data.city = city;
    if (district !== undefined) data.district = district;
    if (phone !== undefined) data.phone = phone;
    if (email !== undefined) data.email = email;
    if (price !== undefined) data.price = typeof price === "string" ? parseFloat(price) : price;
    if (size !== undefined) data.size = size;
    if (description !== undefined) data.description = description;
    if (images !== undefined) data.images = images;
    if (latitude !== undefined) data.latitude = typeof latitude === "string" ? parseFloat(latitude) : latitude;
    if (longitude !== undefined) data.longitude = typeof longitude === "string" ? parseFloat(longitude) : longitude;
    if (features !== undefined) data.features = features;

    const updated = await prisma.field.updateMany({
      where: { ownerId: user.userId },
      data,
    });

    if (updated.count === 0) return res.status(404).json({ error: "Saha bulunamadı" });
    const field = await prisma.field.findFirst({ where: { ownerId: user.userId } });
    return res.json(field);
  }
  res.status(405).end();
} 