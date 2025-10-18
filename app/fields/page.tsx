'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FaSearch, FaMapMarkerAlt, FaStar, FaClock, FaMoneyBillWave, FaFutbol, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './reservation-modal.css'; // Özel stiller için
import { useSession } from "next-auth/react";

interface Field {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  features: string[];
}

interface Reservation {
  fieldId: string;
  date: Date;
}

const mockFields: Field[] = [
  {
    id: "demo-field-id",
    name: "Futbol Arena",
    location: "Kadıköy, İstanbul",
    rating: 4.8,
    price: 400,
    image: "/fields/field1.jpg",
    features: ["Açık Alan", "Kafeterya", "Duş", "Parking"]
  },
  {
    id: "demo-field-id",
    name: "Spor Kompleksi",
    location: "Beşiktaş, İstanbul",
    rating: 4.5,
    price: 350,
    image: "/fields/field2.jpg",
    features: ["Kapalı Alan", "Kafeterya", "Duş", "Parking"]
  },
  // Daha fazla saha eklenebilir
];

function PaymentModal({ appointmentId, fieldPrice, userId, userBalance, onClose, onSuccess }: { appointmentId: string, fieldPrice: number, userId: string, userBalance: number, onClose: () => void, onSuccess: () => void }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'card' | 'other' | null>('balance');

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      if (paymentMethod === 'balance') {
        const res = await fetch(`/api/appointments/${appointmentId}/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amount: fieldPrice })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSuccess(true);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1500);
        } else {
          setError(data.error || 'Onay başarısız.');
        }
      } else if (paymentMethod === 'card') {
        setTimeout(() => {
          setSuccess(true);
          setError(null);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1500);
        }, 1200);
      } else if (paymentMethod === 'other') {
        setError('Diğer yöntemler için lütfen saha sahibiyle iletişime geçin.');
      }
    } catch (e) {
      setError('Sunucuya ulaşılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className={`rounded-3xl p-8 w-full max-w-md shadow-2xl relative flex flex-col items-center ${
        theme === 'third'
          ? 'bg-[#111111] border border-[#333333]'
          : 'bg-white border border-purple-100'
      }`}>
        <h2 className={`text-2xl font-extrabold mb-4 ${
          theme === 'third'
            ? 'text-[#e5e5e5]'
            : 'text-gray-800'
        }`}>Rezervasyon Onayı</h2>
        <p className={`mb-2 font-semibold ${theme === 'third' ? 'text-[#999999]' : 'text-gray-700'}`}>
          Saha ücreti: <span className={theme === 'third' ? 'text-[#e5e5e5] font-bold' : 'text-purple-700 font-bold'}>
            {fieldPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </span>
        </p>
        <p className={`mb-2 font-semibold ${theme === 'third' ? 'text-[#999999]' : 'text-gray-700'}`}>
          Bakiyeniz: <span className={
            theme === 'third'
              ? userBalance < fieldPrice ? 'text-red-400 font-bold' : 'text-green-400 font-bold'
              : userBalance < fieldPrice ? 'text-red-600 font-bold' : 'text-green-600 font-bold'
          }>{userBalance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
        </p>
        <div className="w-full mb-4">
          <div className="flex gap-2 w-full mb-2">
            <button 
              className={`flex-1 px-3 py-2 rounded-lg font-bold border ${
                paymentMethod === 'balance' 
                  ? theme === 'third'
                    ? 'bg-[#333333] text-[#e5e5e5] border-[#444444]'
                    : 'bg-purple-500 text-white'
                  : theme === 'third'
                    ? 'bg-[#222222] text-[#999999] border-[#333333]'
                    : 'bg-white text-purple-700 border-purple-200'
              }`} 
              onClick={() => setPaymentMethod('balance')}
            >
              Bakiyeden Öde
            </button>
            <button 
              className={`flex-1 px-3 py-2 rounded-lg font-bold border ${
                paymentMethod === 'card' 
                  ? theme === 'third'
                    ? 'bg-[#333333] text-[#e5e5e5] border-[#444444]'
                    : 'bg-yellow-400 text-white'
                  : theme === 'third'
                    ? 'bg-[#222222] text-[#999999] border-[#333333]'
                    : 'bg-white text-yellow-700 border-yellow-200'
              }`} 
              onClick={() => setPaymentMethod('card')}
            >
              Kart ile Öde
            </button>
            <button 
              className={`flex-1 px-3 py-2 rounded-lg font-bold border ${
                paymentMethod === 'other' 
                  ? theme === 'third'
                    ? 'bg-[#333333] text-[#e5e5e5] border-[#444444]'
                    : 'bg-blue-400 text-white'
                  : theme === 'third'
                    ? 'bg-[#222222] text-[#999999] border-[#333333]'
                    : 'bg-white text-blue-700 border-blue-200'
              }`} 
              onClick={() => setPaymentMethod('other')}
            >
              Diğer
            </button>
          </div>
          {paymentMethod === 'card' && <div className={`text-sm mb-2 ${theme === 'third' ? 'text-green-400' : 'text-green-700'}`}>(Test ortamı: Kart ile ödeme işlemi mock olarak yapılacaktır.)</div>}
          {paymentMethod === 'other' && <div className={`text-sm mb-2 ${theme === 'third' ? 'text-blue-400' : 'text-blue-700'}`}>(Havale/EFT veya diğer yöntemler için lütfen saha sahibiyle iletişime geçin.)</div>}
        </div>
        {error && <div className={`mb-2 ${theme === 'third' ? 'text-red-400' : 'text-red-500'}`}>{error}</div>}
        {success ? (
          <div className={`font-bold text-lg ${theme === 'third' ? 'text-green-400' : 'text-green-600'}`}>Onay başarılı! Rezervasyon onaylandı.</div>
        ) : (
          <button
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 mt-4"
            onClick={handlePayment}
            disabled={loading || (paymentMethod === 'balance' && userBalance < fieldPrice)}
          >
            {paymentMethod === 'balance'
              ? (userBalance < fieldPrice ? 'Yetersiz Bakiye' : (loading ? 'Onaylanıyor...' : 'Bakiyeden Öde'))
              : paymentMethod === 'card'
                ? (loading ? 'Ödeniyor...' : 'Kart ile Öde')
                : 'Diğer Yöntemle Devam Et'}
          </button>
        )}
          <button
            className={`mt-4 text-sm ${
              theme === 'third'
                ? 'text-[#666666] hover:text-[#999999]'
                : 'text-gray-500 hover:text-pink-500'
            }`}
            onClick={onClose}
            disabled={loading}
          >
          Kapat
        </button>
      </div>
    </div>
  );
}

export default function FieldsPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [reservationDate, setReservationDate] = useState<Date | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [busySlots, setBusySlots] = useState<{ startTime: string; endTime: string }[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('default');
  const [paymentModal, setPaymentModal] = useState<{ appointmentId: string } | null>(null);
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);

  useEffect(() => {
    // Kullanıcı id ve bakiyesini çek
    const fetchProfile = async () => {
      if (status === 'authenticated') {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setUserId(data.id);
          setUserBalance(Number(data.balance) || 0);
        }
      }
    };
    fetchProfile();
  }, [status]);

  const handleReserveClick = (field: Field) => {
    setSelectedField(field);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen && selectedField) {
      // Modal açıldığında seçili tarih varsa o tarihin dolu saatlerini yükle
      if (reservationDate) {
        const dateStr = reservationDate.toISOString().split('T')[0];
        fetch(`/api/appointments?fieldId=${selectedField.id}&date=${dateStr}`)
          .then(res => res.json())
          .then(data => setBusySlots(data));
      }
    } else if (!isModalOpen) {
      setBusySlots([]);
    }
  }, [isModalOpen, selectedField]);

  // Tarih değiştiğinde dolu saatleri yeniden yükle
  useEffect(() => {
    if (isModalOpen && selectedField && reservationDate) {
      const dateStr = reservationDate.toISOString().split('T')[0];
      fetch(`/api/appointments?fieldId=${selectedField.id}&date=${dateStr}`)
        .then(res => res.json())
        .then(data => {
          console.log('API\'den dönen dolu saatler:', data); // Debug için
          setBusySlots(data);
        })
        .catch(error => {
          console.error('Dolu saatler yüklenirken hata:', error);
          setBusySlots([]);
        });
    }
  }, [reservationDate, selectedField, isModalOpen]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/fields')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFields(data);
          setError(null);
        } else {
          setFields([]);
          setError('Veri formatı hatalı!');
        }
      })
      .catch(() => setError('Sunucuya ulaşılamadı!'))
      .finally(() => setLoading(false));
  }, []);

  const isSlotReserved = (fieldId: string, date: Date | null): boolean => {
    if (!date) return false;
    
    // Sadece backend'den gelen dolu saatleri kontrol et (yerel rezervasyonları şimdilik devre dışı bırak)
    const backend = (Array.isArray(busySlots) ? busySlots : []).some(slot => {
      if (!slot.startTime) return false;
      try {
        const slotStart = new Date(slot.startTime);
        const isSameDate = slotStart.toDateString() === date.toDateString();
        const isSameHour = slotStart.getHours() === date.getHours();
        return isSameDate && isSameHour;
      } catch (error) {
        return false;
      }
    });
    
    return backend;
  };

  const handleReservation = async () => {
    if (selectedField && reservationDate && session?.user?.email) {
      const userEmail = session.user.email;
      const fieldId = String(selectedField.id);
      const dateStr = reservationDate.toISOString().split('T')[0];
      const startTime = new Date(reservationDate);
      const endTime = new Date(reservationDate);
      endTime.setHours(startTime.getHours() + 1);
      try {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: String(userEmail),
            fieldId: String(fieldId),
            date: dateStr,
            startTime,
            endTime
          })
        });
        const data = await res.json();
        if (res.status === 409) {
          setFeedback('Bu saat aralığı dolu!');
        } else if (res.ok && data.status === 'pending' && data.appointmentId) {
          // Yerel rezervasyon listesine ekle
          setReservations(prev => [...prev, {
            fieldId: fieldId,
            date: reservationDate
          }]);
          setIsModalOpen(false);
          setPaymentModal({ appointmentId: data.appointmentId });
        } else {
          setFeedback('Bir hata oluştu: ' + (data?.error || 'Bilinmeyen hata.'));
        }
      } catch (e) {
        setFeedback('Sunucuya ulaşılamadı.');
      }
    } else {
      setFeedback('Eksik bilgi: Kullanıcı, saha veya tarih seçilmedi.');
    }
  };

  // Filtrelenmiş ve sıralanmış saha listesi
  const filteredFields = fields.filter(field => {
    // Arama
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      field.name.toLowerCase().includes(query) ||
      field.location.toLowerCase().includes(query);
    // Konum filtresi
    const matchesLocation =
      !selectedLocation || field.location.toLowerCase().includes(selectedLocation.toLowerCase());
    // Fiyat filtresi
    const matchesPrice = field.price >= priceRange[0] && field.price <= priceRange[1];
    return matchesSearch && matchesLocation && matchesPrice;
  });

  const sortedFields = [...filteredFields].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <main className={`min-h-screen py-12 ${
      theme === 'default'
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800'
        : theme === 'third'
          ? 'bg-gradient-to-br from-black via-[#111111] to-[#222222]'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4">
        {/* Arama ve Filtreleme Bölümü */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-xl p-8 rounded-3xl mb-12 ${
            theme === 'default' 
              ? 'bg-white/10'
              : theme === 'third'
                ? 'bg-[#111111]/80 border border-[#333333]'
                : 'bg-white/80 shadow-lg'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Halı saha ara..."
                  className={`w-full rounded-xl px-4 py-3 focus:outline-none ${
                    theme === 'default'
                      ? 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-500'
                      : theme === 'third'
                        ? 'bg-[#111111] border border-[#333333] text-[#e5e5e5] placeholder-[#666666] focus:border-[#444444]'
                        : 'bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500'
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                  theme === 'default' 
                    ? 'text-white/50' 
                    : theme === 'third'
                      ? 'text-[#666666]'
                      : 'text-gray-400'
                }`} />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                className={`rounded-xl px-4 py-3 focus:outline-none ${
                  theme === 'default'
                    ? 'bg-white/10 border border-white/20 text-white focus:border-purple-500'
                    : theme === 'third'
                      ? 'bg-[#111111] border border-[#333333] text-[#e5e5e5] focus:border-[#444444]'
                      : 'bg-white border border-gray-200 text-gray-800 focus:border-blue-500'
                }`}
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Konum Seçin</option>
                <option value="kadıköy">Kadıköy</option>
                <option value="beşiktaş">Beşiktaş</option>
                <option value="şişli">Şişli</option>
                <option value="ataşehir">Ataşehir</option>
                <option value="nilüfer">Nilüfer</option>
                <option value="çankaya">Çankaya</option>
                <option value="konak">Konak</option>
                <option value="lara">Lara</option>
              </select>
              <select
                className={`rounded-xl px-4 py-3 focus:outline-none ${
                  theme === 'default'
                    ? 'bg-white/10 border border-white/20 text-white focus:border-purple-500'
                    : theme === 'third'
                      ? 'bg-[#111111] border border-[#333333] text-[#e5e5e5] focus:border-[#444444]'
                      : 'bg-white border border-gray-200 text-gray-800 focus:border-blue-500'
                }`}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              >
                <option value="1000">Fiyat Aralığı</option>
                <option value="200">0-200 TL</option>
                <option value="400">200-400 TL</option>
                <option value="600">400-600 TL</option>
                <option value="1000">600+ TL</option>
              </select>
              <select
                className={`rounded-xl px-4 py-3 focus:outline-none ${
                  theme === 'default'
                    ? 'bg-white/10 border border-white/20 text-white focus:border-purple-500'
                    : theme === 'third'
                      ? 'bg-[#111111] border border-[#333333] text-[#e5e5e5] focus:border-[#444444]'
                      : 'bg-white border border-gray-200 text-gray-800 focus:border-blue-500'
                }`}
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="default">Sıralama</option>
                <option value="price-asc">Fiyat (Artan)</option>
                <option value="price-desc">Fiyat (Azalan)</option>
                <option value="rating">Puan</option>
                <option value="name">İsim (A-Z)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Halı Saha Listesi */}
        {loading && <div>Yükleniyor...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && Array.isArray(fields) && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedFields.map((field) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                className={`backdrop-blur-xl rounded-3xl overflow-hidden ${
                  theme === 'default'
                    ? 'bg-white/10 border border-white/20'
                    : theme === 'third'
                      ? 'bg-[#111111]/90 border border-[#333333]'
                      : 'bg-white/90 border border-gray-200 shadow-lg'
                }`}
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-pink-500/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaFutbol className="text-6xl text-white/80" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    theme === 'default' 
                      ? 'text-white' 
                      : theme === 'third'
                        ? 'text-[#e5e5e5]'
                        : 'text-gray-800'
                  }`}>{field.name}</h3>
                  <div className={`flex items-center mb-4 ${
                    theme === 'default' 
                      ? 'text-white/80' 
                      : theme === 'third'
                        ? 'text-[#999999]'
                        : 'text-gray-600'
                  }`}>
                    <FaMapMarkerAlt className="mr-2" />
                    {field.location}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-yellow-400">
                      <FaStar className="mr-1" />
                      {field.rating}
                    </div>
                    <div className={`flex items-center ${
                      theme === 'default' 
                        ? 'text-white/80' 
                        : theme === 'third'
                          ? 'text-[#999999]'
                          : 'text-gray-600'
                    }`}>
                      <FaMoneyBillWave className="mr-1" />
                      {field.price} TL/saat
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.features.map((feature, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          theme === 'default'
                            ? 'bg-white/10 text-white/80'
                            : theme === 'third'
                              ? 'bg-[#222222] text-[#999999] border border-[#333333]'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button
                    className={`w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all ${isSlotReserved(field.id, reservationDate) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleReserveClick(field)}
                    disabled={isSlotReserved(field.id, reservationDate)}
                  >
                    {isSlotReserved(field.id, reservationDate) ? 'Dolu' : 'Rezervasyon Yap'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/80 via-pink-900/80 to-indigo-900/80 z-50 animate-fade-in">
            <div className={`rounded-3xl p-8 w-full max-w-md shadow-2xl relative ${
              theme === 'third'
                ? 'bg-[#111111] border border-[#333333]'
                : 'bg-white border border-purple-100'
            }`}>
              {/* Kapatma Butonu */}
              <button
                className={`absolute top-4 right-4 text-2xl transition-colors ${
                  theme === 'third'
                    ? 'text-[#666666] hover:text-[#999999]'
                    : 'text-gray-400 hover:text-pink-500'
                }`}
                onClick={() => { setIsModalOpen(false); setFeedback(null); }}
                aria-label="Kapat"
              >
                <FaTimes />
              </button>
              {/* Başlık ve ikon */}
              <div className="flex items-center gap-2 mb-4">
                <FaCalendarAlt className="text-pink-500 text-3xl" />
                <h2 className={`text-2xl font-extrabold tracking-wide ${
                  theme === 'third'
                    ? 'text-[#e5e5e5]'
                    : 'text-gray-800'
                }`}>Rezervasyon Yap</h2>
              </div>
              <p className={`mb-2 font-semibold text-lg ${
                theme === 'third'
                  ? 'text-[#999999]'
                  : 'text-gray-700'
              }`}>{selectedField?.name}</p>
              {/* Takvim ve custom saat seçici */}
              <div className="mb-4">
                <ReactDatePicker
                  selected={reservationDate}
                  onChange={(date) => setReservationDate(date)}
                  inline
                  calendarClassName="modern-datepicker"
                  dayClassName={date => "rounded-xl hover:bg-pink-100 transition-colors"}
                  minDate={new Date()}
                  renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                    <div className="flex justify-between items-center mb-2 px-2">
                      <button onClick={decreaseMonth} className="text-purple-500 hover:text-pink-500 text-lg">‹</button>
                      <span className="font-semibold text-purple-700">{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                      <button onClick={increaseMonth} className="text-purple-500 hover:text-pink-500 text-lg">›</button>
                    </div>
                  )}
                />
                {/* Saat seçimi kutuları */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {Array.from({length: 24}, (_, hour) => hour).map(hour => {
                    const date = reservationDate ? new Date(reservationDate) : new Date();
                    date.setHours(hour, 0, 0, 0);
                    const isSelected = reservationDate && reservationDate.getHours() === hour;
                    return (
                      <button
                        key={hour}
                        className={`rounded-xl px-0 py-2 font-semibold text-sm shadow transition-all border ${
                          isSlotReserved(selectedField?.id || '', date)
                            ? 'bg-red-500 text-white border-red-400 cursor-not-allowed opacity-60'
                            : isSelected 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-pink-400 scale-105' 
                              : theme === 'third'
                                ? 'bg-[#222222] text-[#999999] border-[#333333] hover:bg-[#333333]'
                                : 'bg-white text-purple-700 border-purple-100 hover:bg-pink-50'
                        }`}
                        onClick={() => !isSlotReserved(selectedField?.id || '', date) && setReservationDate(date)}
                        disabled={isSlotReserved(selectedField?.id || '', date)}
                        title={isSlotReserved(selectedField?.id || '', date) ? 'Bu saat dolu' : ''}
                      >
                        {isSlotReserved(selectedField?.id || '', date) ? 'DOLU' : `${hour.toString().padStart(2, '0')}:00`}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Seçili tarih/saat özeti */}
              {reservationDate && (
                <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 shadow-inner border ${
                  theme === 'third'
                    ? 'bg-[#222222] text-[#999999] border-[#333333]'
                    : 'bg-gradient-to-r from-pink-200 via-purple-100 to-indigo-100 text-purple-900 border-pink-200'
                }`}>
                  <FaCalendarAlt className="text-pink-500" />
                  <span className="font-semibold">{reservationDate.toLocaleDateString()} - {reservationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
              {busySlots.length > 0 && (
                <div className="mb-2 text-sm text-red-500">
                  Dolu saatler: {busySlots.map(slot => new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })).join(', ')}
                </div>
              )}
              {feedback && <div className="mb-2 text-sm text-blue-600">{feedback}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold shadow ${
                    theme === 'third'
                      ? 'bg-[#222222] text-[#999999] hover:bg-[#333333] border border-[#333333]'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => { setIsModalOpen(false); setFeedback(null); }}
                >
                  İptal
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                  onClick={handleReservation}
                  disabled={!reservationDate || isSlotReserved(selectedField?.id || '', reservationDate)}
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}
        {paymentModal && userId && (
          <PaymentModal
            appointmentId={paymentModal.appointmentId}
            fieldPrice={selectedField?.price || 0}
            userId={userId}
            userBalance={userBalance}
            onClose={() => setPaymentModal(null)}
            onSuccess={() => {
              // Rezervasyon başarılıysa bakiyeyi güncelle
              setUserBalance(b => b - (selectedField?.price || 0));
            }}
          />
        )}
      </div>
    </main>
  );
} 