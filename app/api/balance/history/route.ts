import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Mock veri, ileride gerçek transaction tablosu ile değiştirilebilir
const mockPayments = [
  { id: '1', amount: 100, date: new Date().toISOString(), method: 'card' },
  { id: '2', amount: 200, date: new Date(Date.now() - 86400000).toISOString(), method: 'other' },
];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json([], { status: 401 });
  }
  // Gerçek uygulamada burada kullanıcının transaction geçmişi çekilecek
  return NextResponse.json(mockPayments);
} 