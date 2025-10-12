'use client';

import { useTheme } from '../context/ThemeContext';
import { PrismaClient } from '@prisma/client';

export default function TournamentsPage() {
  const { theme } = useTheme();
  // İleride veritabanından turnuva çekmek için Prisma hazır
  // const prisma = new PrismaClient();
  return (
    <main className={`min-h-screen flex flex-col items-center py-16 ${
      theme === 'default'
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800'
        : theme === 'third'
          ? 'bg-gradient-to-br from-black via-[#111111] to-[#222222]'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className={`backdrop-blur-xl p-8 rounded-3xl w-full max-w-2xl text-center ${
        theme === 'default'
          ? 'bg-white/10 border border-white/20'
          : theme === 'third'
            ? 'bg-[#111111]/90 border border-[#333333]'
            : 'bg-white/80 border border-gray-200 shadow-lg'
      }`}>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">Turnuvalar</h1>
        <p className={`text-lg mb-4 ${
          theme === 'default' 
            ? 'text-white/80' 
            : theme === 'third'
              ? 'text-[#999999]'
              : 'text-gray-600'
        }`}>Yakında burada bölgenizdeki turnuvaları görebilecek ve katılabileceksiniz!</p>
      </div>
    </main>
  );
} 