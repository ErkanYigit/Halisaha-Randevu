'use client';

import { motion } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaFutbol, FaUsers, FaTrophy, FaStar, FaClock } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <main className={`min-h-screen flex flex-col justify-center items-center relative overflow-x-hidden ${
      theme === 'default'
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800'
        : theme === 'third'
          ? 'bg-gradient-to-br from-black via-[#111111] to-[#222222]'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animasyonlu Arka Plan Elementleri */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-500 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse" />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-6 tracking-tight">
            FUTURE FOOTBALL
          </h1>
          <p className={`text-2xl md:text-3xl mb-12 font-light tracking-wide ${
            theme === 'default'
              ? 'text-white/90'
              : theme === 'third'
                ? 'text-[var(--text-secondary)]'
                : 'text-gray-700'
          }`}>
            Geleceğin Futbol Deneyimi Burada Başlıyor
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            className={`backdrop-blur-xl p-8 rounded-3xl flex flex-col items-center transition-all duration-300 cursor-pointer ${
              theme === 'default'
                ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                : theme === 'third'
                  ? 'bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--card-hover)]'
                  : 'bg-white/80 border border-gray-200 hover:bg-white shadow-lg'
            }`}
            onClick={() => router.push('/fields')}
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl mb-6">
              <FaFutbol className="text-4xl text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${
              theme === 'default'
                ? 'text-white'
                : theme === 'third'
                  ? 'text-[var(--text-primary)]'
                  : 'text-gray-800'
            }`}>Saha Keşfi</h3>
            <p className={`text-center ${
              theme === 'default'
                ? 'text-white/80'
                : theme === 'third'
                  ? 'text-[var(--text-muted)]'
                  : 'text-gray-600'
            }`}>
              En yakın halı sahaları keşfedin ve anında rezervasyon yapın.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            className={`backdrop-blur-xl p-8 rounded-3xl flex flex-col items-center transition-all duration-300 cursor-pointer ${
              theme === 'default'
                ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                : theme === 'third'
                  ? 'bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--card-hover)]'
                  : 'bg-white/80 border border-gray-200 hover:bg-white shadow-lg'
            }`}
            onClick={() => router.push('/kadro-kur')}
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-2xl mb-6">
              <FaUsers className="text-4xl text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${
              theme === 'default'
                ? 'text-white'
                : theme === 'third'
                  ? 'text-[var(--text-primary)]'
                  : 'text-gray-800'
            }`}>Takım Kur</h3>
            <p className={`text-center ${
              theme === 'default'
                ? 'text-white/80'
                : theme === 'third'
                  ? 'text-[var(--text-muted)]'
                  : 'text-gray-600'
            }`}>
              Arkadaşlarınızla takım kurun ve turnuvalara katılın.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            className={`backdrop-blur-xl p-8 rounded-3xl flex flex-col items-center transition-all duration-300 cursor-pointer ${
              theme === 'default'
                ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                : theme === 'third'
                  ? 'bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--card-hover)]'
                  : 'bg-white/80 border border-gray-200 hover:bg-white shadow-lg'
            }`}
            onClick={() => router.push('/tournaments')}
          >
            <div className="bg-gradient-to-br from-pink-500 to-red-500 p-4 rounded-2xl mb-6">
              <FaTrophy className="text-4xl text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${
              theme === 'default'
                ? 'text-white'
                : theme === 'third'
                  ? 'text-[var(--text-primary)]'
                  : 'text-gray-800'
            }`}>Turnuvalar</h3>
            <p className={`text-center ${
              theme === 'default'
                ? 'text-white/80'
                : theme === 'third'
                  ? 'text-[var(--text-muted)]'
                  : 'text-gray-600'
            }`}>
              Bölgenizdeki turnuvalara katılın ve ödüller kazanın.
            </p>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-16">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/auth/login"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl font-bold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all text-lg tracking-wide inline-block"
            >
              Giriş Yap
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/auth/register"
              className={`backdrop-blur-xl px-12 py-4 rounded-2xl font-bold shadow-lg transition-all text-lg tracking-wide inline-block ${
                theme === 'default'
                  ? 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
                  : theme === 'third'
                    ? 'bg-[#111111] text-gray-300 border-2 border-[#333333] hover:bg-[#222222]'
                    : 'bg-white text-gray-800 border-2 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Kayıt Ol
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 