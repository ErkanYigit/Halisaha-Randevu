import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const fields = await prisma.field.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        district: true,
        price: true,
        description: true,
        images: true,
        latitude: true,
        longitude: true,
        features: true
      }
    });

    // Frontend'deki Field interface'ine uygun formata dönüştür
    const formattedFields = fields.map((field: any) => ({
      id: field.id,
      name: field.name,
      location: `${field.district}, ${field.city}`,
      rating: 4.5, // Şimdilik sabit değer
      price: field.price,
      image: Array.isArray(field.images) && field.images.length > 0 ? field.images[0] : "/fields/field1.jpg",
      features: field.features || []
    }));

    return NextResponse.json(formattedFields);
  } catch (error) {
    console.error('Halı sahalar getirilirken hata:', error);
    return NextResponse.json({ error: 'Halı sahalar getirilirken bir hata oluştu' }, { status: 500 });
  }
} 