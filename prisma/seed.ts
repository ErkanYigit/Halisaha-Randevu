import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@deneme.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@deneme.com',
      password: adminPassword,
      role: 'owner',
    },
  });

  // 3 normal user
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Ali Veli',
        email: 'ali@example.com',
        password: await bcrypt.hash('123456', 10),
        role: 'user',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ayşe Yılmaz',
        email: 'ayse@example.com',
        password: await bcrypt.hash('123456', 10),
        role: 'user',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Mehmet Can',
        email: 'mehmet@example.com',
        password: await bcrypt.hash('123456', 10),
        role: 'user',
      },
    }),
  ]);

  // Admin'e ait bir field
  const adminField = await prisma.field.create({
    data: {
      name: 'Admin Sahası',
      address: 'Test Adres',
      city: 'Bursa',
      district: 'Nilüfer',
      phone: '0123 456 78 90',
      price: 500,
      latitude: 40.1234,
      longitude: 29.1234,
      features: ["duş", "otopark", "açık", "tuvalet"],
      ownerId: admin.id,
    },
  });

  // 2 farklı field (farklı sahiplerle)
  const fields = await Promise.all([
    prisma.field.create({
      data: {
        name: 'Kadıköy Arena',
        address: 'Kadıköy, İstanbul',
        city: 'İstanbul',
        district: 'Kadıköy',
        phone: '0216 123 45 67',
        price: 400,
        latitude: 40.9923,
        longitude: 29.0277,
        features: ["açık", "kafeterya", "duş", "otopark"],
        ownerId: users[0].id,
      },
    }),
    prisma.field.create({
      data: {
        name: 'Beşiktaş Spor Kompleksi',
        address: 'Beşiktaş, İstanbul',
        city: 'İstanbul',
        district: 'Beşiktaş',
        phone: '0212 987 65 43',
        price: 350,
        latitude: 41.0422,
        longitude: 29.0083,
        features: ["kapalı", "duş", "kafeterya"],
        ownerId: users[1].id,
      },
    }),
  ]);

  // 3 appointment (biri admin field, ikisi diğerlerinden)
  await prisma.appointment.createMany({
    data: [
      {
        userId: users[0].id,
        fieldId: adminField.id,
        date: new Date('2025-07-10T00:00:00.000Z'),
        startTime: new Date('2025-07-10T10:00:00.000Z'),
        endTime: new Date('2025-07-10T11:00:00.000Z'),
        status: 'confirmed',
        depositPaid: true,
      },
      {
        userId: users[1].id,
        fieldId: fields[0].id,
        date: new Date('2025-07-11T00:00:00.000Z'),
        startTime: new Date('2025-07-11T15:00:00.000Z'),
        endTime: new Date('2025-07-11T16:00:00.000Z'),
        status: 'pending',
        depositPaid: false,
      },
      {
        userId: users[2].id,
        fieldId: fields[1].id,
        date: new Date('2025-07-12T00:00:00.000Z'),
        startTime: new Date('2025-07-12T18:00:00.000Z'),
        endTime: new Date('2025-07-12T19:00:00.000Z'),
        status: 'confirmed',
        depositPaid: true,
      },
    ],
  });

  // 3 review
  await prisma.review.createMany({
    data: [
      {
        userId: users[0].id,
        fieldId: adminField.id,
        rating: 5,
        comment: 'Harika saha!'
      },
      {
        userId: users[1].id,
        fieldId: fields[0].id,
        rating: 4,
        comment: 'Güzel ortam.'
      },
      {
        userId: users[2].id,
        fieldId: fields[1].id,
        rating: 3,
        comment: 'Ortalama bir deneyim.'
      },
    ],
  });

  console.log('Seed tamamlandı!');
}

main().finally(() => prisma.$disconnect()); 