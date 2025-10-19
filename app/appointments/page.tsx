'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FaCalendarAlt, FaClock, FaUsers, FaMoneyBillWave, FaCheck, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { useSession } from "next-auth/react";

interface Appointment {
  id: string;
  field: { name: string };
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  price?: number;
}

export default function AppointmentsPage() {
  const { theme } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { data: session, status } = useSession();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/appointments`)
        .then(res => res.json())
        .then(data => {
          console.log('Appointments API Response:', data); // Debug log
          if (data.success && data.appointments) {
            setAppointments(data.appointments);
          } else {
            console.error('Appointments data format error:', data);
            setAppointments([]);
          }
        })
        .catch(error => {
          console.error('Appointments fetch error:', error);
          setAppointments([]);
        });
    }
  }, [status]);

  const filteredAppointments = selectedStatus === 'all'
    ? appointments.sort((a, b) => {
        // İptal edilen randevuları en alta taşı
        if (a.status === 'cancelled' && b.status !== 'cancelled') return 1;
        if (a.status !== 'cancelled' && b.status === 'cancelled') return -1;
        // Diğer durumlar için tarih sırasına göre sırala
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
    : appointments.filter(app => app.status === selectedStatus);

  const handleShowDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const handleCancel = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment) return;
    try {
      // Status'u cancelled yap
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      
      if (response.ok) {
        // Liste güncelle - iptal edilen randevunun durumunu güncelle
        setAppointments(prev => prev.map(app => 
          app.id === selectedAppointment.id 
            ? { ...app, status: 'cancelled' }
            : app
        ));
        setShowCancelModal(false);
        setSelectedAppointment(null);
      } else {
        console.error('İptal işlemi başarısız');
      }
    } catch (error) {
      console.error('İptal işlemi sırasında hata:', error);
    }
  };

  return (
    <main className={`min-h-screen py-12 ${
      theme === 'default'
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800'
        : theme === 'third'
          ? 'bg-gradient-to-br from-black via-[#111111] to-[#222222]'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
            Randevularım
          </h1>
          <p className={`text-xl ${
            theme === 'default' 
              ? 'text-white/80' 
              : theme === 'third'
                ? 'text-[#999999]'
                : 'text-gray-600'
          }`}>
            Tüm randevularınızı buradan yönetin
          </p>
        </motion.div>

        {/* Filtreler */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              selectedStatus === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : theme === 'default'
                  ? 'bg-white/10 text-white/80 hover:bg-white/20'
                  : theme === 'third'
                    ? 'bg-[#222222] text-[#999999] hover:bg-[#333333] border border-[#333333]'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              selectedStatus === 'pending'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : theme === 'default'
                  ? 'bg-white/10 text-white/80 hover:bg-white/20'
                  : theme === 'third'
                    ? 'bg-[#222222] text-[#999999] hover:bg-[#333333] border border-[#333333]'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Yaklaşan
          </button>
          <button
            onClick={() => setSelectedStatus('completed')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              selectedStatus === 'completed'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : theme === 'default'
                  ? 'bg-white/10 text-white/80 hover:bg-white/20'
                  : theme === 'third'
                    ? 'bg-[#222222] text-[#999999] hover:bg-[#333333] border border-[#333333]'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Tamamlanan
          </button>
          <button
            onClick={() => setSelectedStatus('cancelled')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              selectedStatus === 'cancelled'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : theme === 'default'
                  ? 'bg-white/10 text-white/80 hover:bg-white/20'
                  : theme === 'third'
                    ? 'bg-[#222222] text-[#999999] hover:bg-[#333333] border border-[#333333]'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            İptal Edilen
          </button>
        </div>

        {/* Randevu Listesi */}
        <div className="grid gap-6">
          {(Array.isArray(filteredAppointments) ? filteredAppointments : []).map((appointment) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`backdrop-blur-xl rounded-3xl p-6 ${
                theme === 'default'
                  ? 'bg-white/10 border border-white/20'
                  : theme === 'third'
                    ? 'bg-[#111111]/90 border border-[#333333]'
                    : 'bg-white border border-gray-200 shadow-lg'
              } ${appointment.status === 'cancelled' ? 'opacity-60 grayscale border-red-500/30' : ''}`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${
                    theme === 'default' 
                      ? 'text-white' 
                      : theme === 'third'
                        ? 'text-[#e5e5e5]'
                        : 'text-gray-800'
                  }`}>{appointment.field?.name || '-'}</h3>
                  <div className={`flex flex-wrap gap-4 ${
                    theme === 'default' 
                      ? 'text-white/80' 
                      : theme === 'third'
                        ? 'text-[#999999]'
                        : 'text-gray-600'
                  }`}>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      {appointment.date?.slice(0, 10)}
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2" />
                      {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center">
                      <FaMoneyBillWave className="mr-2" />
                      {appointment.price ? appointment.price + ' TL' : '-'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                    <>
                      <button onClick={() => handleShowDetails(appointment)} className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
                        Detaylar
                      </button>
                      <button onClick={() => handleCancel(appointment)} className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                        theme === 'default'
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}>
                        İptal Et
                      </button>
                    </>
                  )}
                  {appointment.status === 'completed' && (
                    <div className="flex items-center text-green-400">
                      <FaCheck className="mr-2" />
                      Tamamlandı
                    </div>
                  )}
                  {appointment.status === 'cancelled' && (
                    <div className="flex items-center text-red-400 font-semibold">
                      <FaTimes className="mr-2" />
                      İptal Edildi
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detaylar Modalı */}
        {showDetailModal && selectedAppointment && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 animate-fade-in">
            <div className={`rounded-2xl p-8 w-full max-w-md shadow-2xl relative ${
              theme === 'third'
                ? 'bg-[#111111] border border-[#333333]'
                : 'bg-white'
            }`}>
              <button className={`absolute top-4 right-4 text-2xl ${
                theme === 'third'
                  ? 'text-[#666666] hover:text-[#999999]'
                  : 'text-gray-400 hover:text-pink-500'
              }`} onClick={() => setShowDetailModal(false)}><FaTimes /></button>
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
                theme === 'third'
                  ? 'text-[#e5e5e5]'
                  : 'text-purple-700'
              }`}><FaCalendarAlt /> Rezervasyon Detayları</h2>
              <div className={`mb-2 text-lg font-semibold ${
                theme === 'third'
                  ? 'text-[#e5e5e5]'
                  : 'text-gray-800'
              }`}>{selectedAppointment.field?.name}</div>
              <div className={`mb-2 flex items-center gap-2 ${
                theme === 'third'
                  ? 'text-[#999999]'
                  : 'text-gray-600'
              }`}><FaMapMarkerAlt /> Adres: <span className="font-medium">(adres eklenebilir)</span></div>
              <div className={`mb-2 flex items-center gap-2 ${
                theme === 'third'
                  ? 'text-[#999999]'
                  : 'text-gray-600'
              }`}><FaCalendarAlt /> Tarih: <span className="font-medium">{selectedAppointment.date?.slice(0, 10)}</span></div>
              <div className={`mb-2 flex items-center gap-2 ${
                theme === 'third'
                  ? 'text-[#999999]'
                  : 'text-gray-600'
              }`}><FaClock /> Saat: <span className="font-medium">{new Date(selectedAppointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
              <div className={`mb-2 flex items-center gap-2 ${
                theme === 'third'
                  ? 'text-[#999999]'
                  : 'text-gray-600'
              }`}><FaMoneyBillWave /> Fiyat: <span className="font-medium">{selectedAppointment.price ? selectedAppointment.price + ' TL' : '-'}</span></div>
              <div className={`mb-2 flex items-center gap-2 ${
                theme === 'third'
                  ? 'text-[#999999]'
                  : 'text-gray-600'
              }`}>Durum: <span className={`font-bold ${
                selectedAppointment.status === 'cancelled' 
                  ? theme === 'third' ? 'text-red-400' : 'text-red-500'
                  : selectedAppointment.status === 'completed' 
                    ? theme === 'third' ? 'text-green-400' : 'text-green-500'
                    : theme === 'third' ? 'text-[#e5e5e5]' : 'text-purple-500'
              }`}>{selectedAppointment.status}</span></div>
            </div>
          </div>
        )}

        {/* İptal Onay Modalı */}
        {showCancelModal && selectedAppointment && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 animate-fade-in">
            <div className={`rounded-2xl p-8 w-full max-w-md shadow-2xl relative ${
              theme === 'third'
                ? 'bg-[#111111] border border-[#333333]'
                : 'bg-white'
            }`}>
              <button className={`absolute top-4 right-4 text-2xl ${
                theme === 'third'
                  ? 'text-[#666666] hover:text-[#999999]'
                  : 'text-gray-400 hover:text-pink-500'
              }`} onClick={() => setShowCancelModal(false)}><FaTimes /></button>
              <h2 className={`text-2xl font-bold mb-4 ${
                theme === 'third'
                  ? 'text-[#e5e5e5]'
                  : 'text-pink-700'
              }`}>Rezervasyonu İptal Et</h2>
              <p className={`mb-4 ${
                theme === 'third'
                  ? 'text-[#999999]'
                  : 'text-gray-700'
              }`}>Bu rezervasyonu iptal etmek istediğinize emin misiniz? İptal edilen rezervasyon listeden kaldırılacak ve saat tekrar müsait hale gelecektir.</p>
              <div className="flex justify-end gap-2">
                <button className={`px-4 py-2 rounded-lg font-semibold ${
                  theme === 'third'
                    ? 'bg-[#222222] text-[#999999] hover:bg-[#333333] border border-[#333333]'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`} onClick={() => setShowCancelModal(false)}>Vazgeç</button>
                <button className={`px-4 py-2 rounded-lg font-bold ${
                  theme === 'third'
                    ? 'bg-[#333333] text-[#e5e5e5] hover:bg-[#444444] border border-[#444444]'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`} onClick={confirmCancel}>Evet, İptal Et</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 