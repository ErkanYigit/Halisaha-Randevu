'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaCalendarAlt, FaMoneyBillWave, FaUsers, FaTrophy, FaInfoCircle, FaHandshake } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useTheme } from '../context/ThemeContext';

interface Notification {
  id: string;
  type: 'appointment' | 'payment' | 'team' | 'tournament' | 'info' | 'join_request';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  joinRequest?: {
    id: string;
    message: string;
    userName: string;
    userEmail: string;
    fieldName: string;
    matchRequestId: string;
    date: string;
    time: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string | null;
  };
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
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'clear' | 'delete' | null>(null);
  const [confirmJoinRequestId, setConfirmJoinRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        console.error('Bildirimler yüklenirken hata:', data.error);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

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
      case 'join_request':
        return <FaHandshake className="text-2xl text-white" />;
      default:
        return <FaInfoCircle className="text-2xl text-white" />;
    }
  };

  const handleApproveJoinRequest = (joinRequestId: string) => {
    setConfirmAction('approve');
    setConfirmJoinRequestId(joinRequestId);
    setShowConfirmModal(true);
  };

  const handleRejectJoinRequest = (joinRequestId: string) => {
    setConfirmAction('reject');
    setConfirmJoinRequestId(joinRequestId);
    setRejectReason('');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      let response;
      
      if (confirmAction === 'approve' && confirmJoinRequestId) {
        response = await fetch(`/api/match-requests/join-requests/${confirmJoinRequestId}/approve`, {
          method: 'POST',
        });
      } else if (confirmAction === 'reject' && confirmJoinRequestId) {
        response = await fetch(`/api/match-requests/join-requests/${confirmJoinRequestId}/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason: rejectReason }),
        });
      } else if (confirmAction === 'clear') {
        response = await fetch('/api/notifications/clear', {
          method: 'DELETE',
        });
      } else if (confirmAction === 'delete' && confirmJoinRequestId) {
        response = await fetch(`/api/notifications/${confirmJoinRequestId}`, {
          method: 'DELETE',
        });
      }

      if (response?.ok) {
        // Bildirimleri yenile
        fetchNotifications();
        setShowConfirmModal(false);
        setShowClearModal(false);
        setConfirmAction(null);
        setConfirmJoinRequestId(null);
        setRejectReason('');
      } else {
        const data = await response?.json();
        alert(data?.error || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('İşlem sırasında hata:', error);
      alert('Sunucu hatası');
    }
  };

  const handleClearAll = () => {
    setConfirmAction('clear');
    setShowClearModal(true);
  };

  const handleDeleteNotification = (notificationId: string) => {
    setConfirmAction('delete');
    setConfirmJoinRequestId(notificationId);
    setShowConfirmModal(true);
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  return (
    <main className={`min-h-screen py-12 ${
      theme === 'default' 
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800'
        : theme === 'light'
        ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        : 'bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900'
    }`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Başlık */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-black mb-4 ${
              theme === 'default' 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'
                : theme === 'light'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-blue-400 to-purple-400'
            }`}>
              Bildirimler
            </h1>
            <p className={`text-xl ${
              theme === 'default' 
                ? 'text-white/80'
                : theme === 'light'
                ? 'text-gray-600'
                : 'text-gray-300'
            }`}>
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
                  ? theme === 'default'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : theme === 'light'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gradient-to-r from-gray-600 to-blue-600 text-white'
                  : theme === 'default'
                  ? 'bg-white/10 text-white/80 hover:bg-white/20'
                  : theme === 'light'
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                  ? theme === 'default'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : theme === 'light'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gradient-to-r from-gray-600 to-blue-600 text-white'
                  : theme === 'default'
                  ? 'bg-white/10 text-white/80 hover:bg-white/20'
                  : theme === 'light'
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Okunmamış
            </motion.button>
          </div>

          {/* Temizleme Butonları */}
          {notifications.length > 0 && (
            <div className="flex justify-center gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearAll}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  theme === 'default'
                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                    : theme === 'light'
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                }`}
              >
                🗑️ Tümünü Temizle
              </motion.button>
            </div>
          )}

          {/* Bildirim Listesi */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-16">
                <div className={`animate-spin rounded-full h-16 w-16 border-b-4 mx-auto ${
                  theme === 'default' 
                    ? 'border-purple-400'
                    : theme === 'light'
                    ? 'border-blue-500'
                    : 'border-gray-400'
                }`}></div>
                <p className={`mt-6 text-lg font-semibold ${
                  theme === 'default' 
                    ? 'text-white/90'
                    : theme === 'light'
                    ? 'text-gray-700'
                    : 'text-gray-300'
                }`}>Bildirimler yükleniyor...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-16">
                <FaBell className={`text-6xl mx-auto mb-4 ${
                  theme === 'default' 
                    ? 'text-white/30'
                    : theme === 'light'
                    ? 'text-gray-300'
                    : 'text-gray-600'
                }`} />
                <p className={`text-xl ${
                  theme === 'default' 
                    ? 'text-white/80'
                    : theme === 'light'
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}>Henüz bildiriminiz bulunmuyor</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className={`backdrop-blur-xl rounded-3xl p-6 border ${
                    theme === 'default'
                      ? `bg-white/10 border-white/20 ${!notification.isRead ? 'border-purple-500/50' : ''}`
                      : theme === 'light'
                      ? `bg-white/80 border-gray-200 ${!notification.isRead ? 'border-blue-500/50' : ''}`
                      : `bg-gray-800/50 border-gray-700 ${!notification.isRead ? 'border-blue-500/50' : ''}`
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      theme === 'default'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : theme === 'light'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                        : 'bg-gradient-to-br from-gray-600 to-blue-600'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`text-xl font-bold mb-2 ${
                          theme === 'default' 
                            ? 'text-white'
                            : theme === 'light'
                            ? 'text-gray-800'
                            : 'text-white'
                        }`}>{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${
                            theme === 'default' 
                              ? 'text-white/60'
                              : theme === 'light'
                              ? 'text-gray-500'
                              : 'text-gray-400'
                          }`}>{notification.date}</span>
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className={`transition-colors p-1 ${
                              theme === 'default'
                                ? 'text-red-400 hover:text-red-300'
                                : theme === 'light'
                                ? 'text-red-500 hover:text-red-600'
                                : 'text-red-400 hover:text-red-300'
                            }`}
                            title="Bildirimi sil"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <p className={`mb-4 ${
                        theme === 'default' 
                          ? 'text-white/80'
                          : theme === 'light'
                          ? 'text-gray-600'
                          : 'text-gray-300'
                      }`}>{notification.message}</p>
                      
                      {/* Katılım isteği için özel mesaj ve durum */}
                      {notification.type === 'join_request' && notification.joinRequest && (
                        <div className={`rounded-xl p-4 mb-4 ${
                          theme === 'default'
                            ? 'bg-white/5'
                            : theme === 'light'
                            ? 'bg-gray-100'
                            : 'bg-gray-700/50'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-sm font-medium ${
                              theme === 'default' 
                                ? 'text-white/90'
                                : theme === 'light'
                                ? 'text-gray-700'
                                : 'text-gray-300'
                            }`}>Durum:</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              notification.joinRequest.status === 'PENDING' 
                                ? theme === 'default'
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : theme === 'light'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-yellow-900/30 text-yellow-400'
                              : notification.joinRequest.status === 'APPROVED' 
                                ? theme === 'default'
                                  ? 'bg-green-500/20 text-green-300'
                                  : theme === 'light'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-green-900/30 text-green-400'
                              : theme === 'default'
                                ? 'bg-red-500/20 text-red-300'
                                : theme === 'light'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-red-900/30 text-red-400'
                            }`}>
                              {notification.joinRequest.status === 'PENDING' ? 'Beklemede' :
                               notification.joinRequest.status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${
                            theme === 'default' 
                              ? 'text-white/90'
                              : theme === 'light'
                              ? 'text-gray-700'
                              : 'text-gray-300'
                          }`}>
                            <strong>Mesaj:</strong> {notification.joinRequest.message || 'Mesaj yok'}
                          </p>
                          {/* Geçici olarak kapatıldı - rejectionReason henüz aktif değil */}
                          {/* {notification.joinRequest.status === 'REJECTED' && notification.joinRequest.rejectionReason && (
                            <p className="text-red-300 text-sm mb-2 bg-red-500/10 p-2 rounded">
                              <strong>Reddetme Sebebi:</strong> {notification.joinRequest.rejectionReason}
                            </p>
                          )} */}
                          <p className={`text-sm ${
                            theme === 'default' 
                              ? 'text-white/70'
                              : theme === 'light'
                              ? 'text-gray-600'
                              : 'text-gray-400'
                          }`}>
                            <strong>Saha:</strong> {notification.joinRequest.fieldName} | 
                            <strong> Tarih:</strong> {new Date(notification.joinRequest.date).toLocaleDateString('tr-TR')} | 
                            <strong> Saat:</strong> {notification.joinRequest.time}
                          </p>
                        </div>
                      )}
                      
                      {/* Katılım isteği için aksiyon butonları - sadece PENDING durumunda */}
                      {notification.type === 'join_request' && notification.joinRequest && notification.joinRequest.status === 'PENDING' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApproveJoinRequest(notification.joinRequest!.id)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                              theme === 'default'
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : theme === 'light'
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => handleRejectJoinRequest(notification.joinRequest!.id)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                              theme === 'default'
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : theme === 'light'
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                          >
                            Reddet
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Onay Modalı */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {confirmAction === 'approve' ? 'Katılım İsteğini Onayla' : 
               confirmAction === 'reject' ? 'Katılım İsteğini Reddet' :
               confirmAction === 'delete' ? 'Bildirimi Sil' : 'İşlem Onayı'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {confirmAction === 'approve' 
                ? 'Bu katılım isteğini onaylamak istediğinizden emin misiniz?' 
                : confirmAction === 'reject'
                ? 'Bu katılım isteğini reddetmek istediğinizden emin misiniz?'
                : confirmAction === 'delete'
                ? 'Bu bildirimi silmek istediğinizden emin misiniz?'
                : 'Bu işlemi yapmak istediğinizden emin misiniz?'}
            </p>

            {confirmAction === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reddetme Sebebi (İsteğe bağlı)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reddetme sebebinizi yazın..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                  setConfirmJoinRequestId(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  confirmAction === 'approve' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : confirmAction === 'delete'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {confirmAction === 'approve' ? 'Onayla' : 
                 confirmAction === 'delete' ? 'Sil' : 'Reddet'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Temizleme Onay Modalı */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Tüm Bildirimleri Temizle
            </h3>
            
            <p className="text-gray-600 mb-4">
              Tüm bildirimlerinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowClearModal(false);
                  setConfirmAction(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleConfirmAction}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Tümünü Temizle
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
} 