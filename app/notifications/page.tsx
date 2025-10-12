'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaCalendarAlt, FaMoneyBillWave, FaUsers, FaTrophy, FaInfoCircle } from 'react-icons/fa';

interface Notification {
  id: string;
  type: 'appointment' | 'payment' | 'team' | 'tournament' | 'info';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Randevu Onaylandı',
    message: 'Futbol Arena\'daki randevunuz onaylandı. 20 Mart 2024, 19:00',
    date: '2024-03-19',
    isRead: false
  },
  {
    id: '2',
    type: 'payment',
    title: 'Ödeme Başarılı',
    message: 'Spor Kompleksi rezervasyonu için ödemeniz alındı.',
    date: '2024-03-18',
    isRead: true
  },
  {
    id: '3',
    type: 'team',
    title: 'Takım Daveti',
    message: 'Ahmet sizi "Galatasaraylılar" takımına davet etti.',
    date: '2024-03-17',
    isRead: false
  },
  {
    id: '4',
    type: 'tournament',
    title: 'Turnuva Başlıyor',
    message: 'Kadıköy Ligi turnuvası 1 Nisan\'da başlıyor.',
    date: '2024-03-16',
    isRead: true
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return <FaCalendarAlt className="text-2xl text-white" />;
      case 'payment':
        return <FaMoneyBillWave className="text-2xl text-white" />;
      case 'team':
        return <FaUsers className="text-2xl text-white" />;
      case 'tournament':
        return <FaTrophy className="text-2xl text-white" />;
      default:
        return <FaInfoCircle className="text-2xl text-white" />;
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Başlık */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
              Bildirimler
            </h1>
            <p className="text-xl text-white/80">
              Tüm bildirimlerinizi buradan takip edin
            </p>
          </div>

          {/* Filtreler */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Tümü
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('unread')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Okunmamış
            </motion.button>
          </div>

          {/* Bildirim Listesi */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 ${
                  !notification.isRead ? 'border-purple-500/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-white mb-2">{notification.title}</h3>
                      <span className="text-white/60 text-sm">{notification.date}</span>
                    </div>
                    <p className="text-white/80">{notification.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
} 