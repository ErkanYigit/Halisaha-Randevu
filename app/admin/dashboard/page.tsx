'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMoneyBillWave, FaUsers, FaChartLine, FaCog, FaBell, FaStar, FaClock } from 'react-icons/fa';
import FieldEditForm from "./FieldEditForm";
import ReservationCalendar from "./ReservationCalendar";

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  averageRating: number;
}

interface Booking {
  id: string;
  fieldName: string;
  date: string;
  time: string;
  duration: number;
  players: number;
  price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const mockStats: DashboardStats = {
  totalBookings: 156,
  totalRevenue: 62400,
  activeUsers: 89,
  averageRating: 4.7
};

const mockBookings: Booking[] = [
  {
    id: '1',
    fieldName: 'Saha 1',
    date: '2024-03-20',
    time: '19:00',
    duration: 2,
    players: 10,
    price: 400,
    status: 'upcoming'
  },
  {
    id: '2',
    fieldName: 'Saha 2',
    date: '2024-03-20',
    time: '20:00',
    duration: 1,
    players: 8,
    price: 200,
    status: 'upcoming'
  }
];

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'bookings' | 'settings'>('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, activeUsers: 0, averageRating: 0 });
  const [field, setField] = useState<any>(null);

  useEffect(() => {
    // Saha bilgisi çek
    const token = localStorage.getItem('admin_token');
    fetch('/api/field/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setField(data));
  }, []);

  useEffect(() => {
    if (!field) return;
    const token = localStorage.getItem('admin_token');
    // Bu ayın başı ve sonu
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    // Tüm rezervasyonları çek
    fetch(`/api/field/me/reservations`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        // Yaklaşan rezervasyonlar (startTime >= now veya endTime >= now)
        const upcoming = data.filter((r: any) => new Date(r.startTime) >= now || new Date(r.endTime) >= now);
        // Bu ayki rezervasyonlar
        const thisMonth = data.filter((r: any) => {
          const s = new Date(r.startTime);
          return s >= monthStart && s <= monthEnd;
        });
        // Toplam gelir: bu ayki rezervasyon sayısı * saatlik ücret
        const price = field.price || 0;
        setStats({
          totalBookings: thisMonth.length,
          totalRevenue: thisMonth.length * price,
          activeUsers: 0, // Geliştirilebilir
          averageRating: 0 // Geliştirilebilir
        });
      });
  }, [field]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Başlık */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
              Yönetim Paneli
            </h1>
            <p className="text-xl text-white/80">
              Halı sahanızı yönetin ve istatistikleri takip edin
            </p>
          </div>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                  <FaCalendarAlt className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-white/60">Toplam Rezervasyon</p>
                  <h3 className="text-2xl font-bold text-white">{stats.totalBookings}</h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                  <FaMoneyBillWave className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-white/60">Toplam Gelir</p>
                  <h3 className="text-2xl font-bold text-white">{stats.totalRevenue} TL</h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-white/60">Aktif Kullanıcılar</p>
                  <h3 className="text-2xl font-bold text-white">{mockStats.activeUsers}</h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                  <FaStar className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-white/60">Ortalama Puan</p>
                  <h3 className="text-2xl font-bold text-white">{mockStats.averageRating}</h3>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sekmeler */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Saha Bilgileri & Ayarlar</h2>
            <FieldEditForm />
          </div>

          <ReservationCalendar />
        </motion.div>
      </div>
    </main>
  );
} 