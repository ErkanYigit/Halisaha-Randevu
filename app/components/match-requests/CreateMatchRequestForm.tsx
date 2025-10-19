"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from '../../context/ThemeContext';

interface Field {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  price: number;
}

interface CreateMatchRequestFormProps {
  fields: Field[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  fieldId: string;
  date: string;
  time: string;
  teamSize: number;
  lookingForTeamSize: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  feeSharing: "SPLIT" | "FULL" | "FREE";
  description: string;
}

export default function CreateMatchRequestForm({ fields, onSuccess, onCancel }: CreateMatchRequestFormProps) {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [userReservations, setUserReservations] = useState<any[]>([]);

  const [formData, setFormData] = useState<FormData>({
    fieldId: "",
    date: "",
    time: "",
    teamSize: 5,
    lookingForTeamSize: 5,
    level: "INTERMEDIATE",
    feeSharing: "SPLIT",
    description: ""
  });
  const [selectedReservationId, setSelectedReservationId] = useState<string>("");

  const levelOptions = [
    { value: "BEGINNER", label: "Başlangıç" },
    { value: "INTERMEDIATE", label: "Orta" },
    { value: "ADVANCED", label: "İleri" }
  ];

  const feeSharingOptions = [
    { value: "SPLIT", label: "Bölüşümlü" },
    { value: "FULL", label: "Tam Ödeme" },
    { value: "FREE", label: "Ücretsiz" }
  ];

  useEffect(() => {
    if (session?.user) {
      fetchUserReservations();
    }
  }, [session]);

  useEffect(() => {
    console.log('Fields prop changed:', fields); // Debug log
  }, [fields]);

  const fetchUserReservations = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      if (data.success) {
        // Sadece confirmed durumundaki ve gelecekteki rezervasyonları al
        const confirmedReservations = data.appointments.filter((appointment: any) => {
          const appointmentDate = new Date(appointment.date);
          const now = new Date();
          return appointment.status === 'confirmed' && appointmentDate > now;
        });
        console.log('Confirmed Reservations:', confirmedReservations); // Debug log
        setUserReservations(confirmedReservations);
      }
    } catch (error) {
      console.error('Rezervasyonlar yüklenirken hata:', error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Seçilen rezervasyonu bul ve fieldId'yi al
      const selectedReservation = userReservations.find(r => r.id === selectedReservationId);
      if (!selectedReservation) {
        alert('Lütfen bir rezervasyon seçin');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/match-requests/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fieldId: selectedReservation.fieldId // Rezervasyon ID'si yerine field ID'si gönder
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('İlan başarıyla oluşturuldu!');
        onSuccess();
      } else {
        alert(data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('İlan oluşturulurken hata:', error);
      alert('Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleReservationSelect = (reservation: any) => {
    console.log('Selected reservation:', reservation); // Debug log
    setFormData(prev => ({
      ...prev,
      fieldId: reservation.fieldId,
      date: reservation.date.split('T')[0], // YYYY-MM-DD format
      time: new Date(reservation.startTime).toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }) // HH:MM format
    }));
    console.log('Updated formData.fieldId:', reservation.fieldId); // Debug log
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rezervasyon Seçimi */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'default'
            ? 'text-white/80'
            : theme === 'third'
              ? 'text-[var(--text-secondary)]'
              : 'text-gray-600'
        }`}>
          Rezervasyon *
        </label>
        <select
          value={selectedReservationId}
          onChange={(e) => {
            const reservation = userReservations.find(r => r.id === e.target.value);
            if (reservation) {
              setSelectedReservationId(e.target.value);
              handleReservationSelect(reservation);
            }
          }}
          required
          className={`w-full px-4 py-3 rounded-xl border transition-colors ${
            theme === 'default'
              ? 'bg-white/10 border-white/20 text-white'
              : theme === 'third'
                ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)]'
                : 'bg-white border-gray-300 text-gray-900'
          }`}
          style={{
            color: theme === 'default' ? 'white' : 
                   theme === 'third' ? '#e5e5e5' : '#374151'
          }}
        >
          <option 
            value="" 
            style={{
              backgroundColor: theme === 'default' ? '#1a1a2e' : 
                               theme === 'third' ? '#111111' : 'white',
              color: theme === 'default' ? 'white' : 
                     theme === 'third' ? '#e5e5e5' : '#374151'
            }}
          >
            Rezervasyonunuzu seçin
          </option>
          {userReservations.length === 0 ? (
            <option 
              value=""
              disabled
              style={{
                backgroundColor: theme === 'default' ? '#1a1a2e' : 
                                 theme === 'third' ? '#111111' : 'white',
                color: theme === 'default' ? 'rgba(255,255,255,0.5)' : 
                       theme === 'third' ? '#666666' : '#9CA3AF'
              }}
            >
              Onaylanmış rezervasyonunuz bulunmuyor
            </option>
          ) : (
            userReservations.map((reservation) => {
              // API'den gelen field bilgilerini kullan (fields array'ine bağımlı değil)
              const fieldName = reservation.field?.name || 'Bilinmeyen Saha';
              const startTime = new Date(reservation.startTime).toLocaleTimeString('tr-TR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              const endTime = new Date(reservation.endTime).toLocaleTimeString('tr-TR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              return (
                <option 
                  key={reservation.id} 
                  value={reservation.id}
                  style={{
                    backgroundColor: theme === 'default' ? '#1a1a2e' : 
                                     theme === 'third' ? '#111111' : 'white',
                    color: theme === 'default' ? 'white' : 
                           theme === 'third' ? '#e5e5e5' : '#374151'
                  }}
                >
                  {fieldName} - {new Date(reservation.date).toLocaleDateString('tr-TR')} {startTime}-{endTime}
                </option>
              );
            })
          )}
        </select>
      </div>

      {/* Seçilen Rezervasyon Bilgileri */}
      {selectedReservationId && formData.date && formData.time && (
        <div className={`p-6 rounded-xl border ${
          theme === 'default'
            ? 'bg-white/5 border-white/10'
            : theme === 'third'
              ? 'bg-[var(--card-bg)] border-[var(--card-border)]'
              : 'bg-gray-50 border-gray-200'
        }`}>
          <h4 className={`text-xl font-bold mb-4 ${
            theme === 'default'
              ? 'text-white'
              : theme === 'third'
                ? 'text-[var(--text-primary)]'
                : 'text-gray-800'
          }`}>
            🏟️ Seçilen Rezervasyon Bilgileri
          </h4>
          
          {(() => {
            const selectedReservation = userReservations.find(r => r.id === selectedReservationId);
            
            // API'den gelen field bilgilerini kullan (fields array'ine bağımlı değil)
            const fieldName = selectedReservation?.field?.name || 'Bilinmeyen Saha';
            const fieldAddress = selectedReservation?.field?.address || 'Adres bilgisi yok';
            const fieldPrice = selectedReservation?.field?.price || 'Bilinmiyor';
            
            const startTime = selectedReservation ? new Date(selectedReservation.startTime).toLocaleTimeString('tr-TR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : formData.time;
            const endTime = selectedReservation ? new Date(selectedReservation.endTime).toLocaleTimeString('tr-TR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : '';
            
            return (
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${
                  theme === 'default'
                    ? 'bg-white/10'
                    : theme === 'third'
                      ? 'bg-[var(--button-bg)]'
                      : 'bg-white'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🏟️</span>
                    <span className={`font-semibold ${
                      theme === 'default'
                        ? 'text-white'
                        : theme === 'third'
                          ? 'text-[var(--text-primary)]'
                          : 'text-gray-800'
                    }`}>
                      {fieldName}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    theme === 'default'
                      ? 'text-white/80'
                      : theme === 'third'
                        ? 'text-[var(--text-secondary)]'
                        : 'text-gray-600'
                  }`}>
                    📍 {fieldAddress}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${
                    theme === 'default'
                      ? 'bg-white/10'
                      : theme === 'third'
                        ? 'bg-[var(--button-bg)]'
                        : 'bg-white'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>📅</span>
                      <span className={`font-medium text-sm ${
                        theme === 'default'
                          ? 'text-white/80'
                          : theme === 'third'
                            ? 'text-[var(--text-secondary)]'
                            : 'text-gray-600'
                      }`}>Tarih</span>
                    </div>
                    <div className={`font-semibold ${
                      theme === 'default'
                        ? 'text-white'
                        : theme === 'third'
                          ? 'text-[var(--text-primary)]'
                          : 'text-gray-800'
                    }`}>
                      {new Date(formData.date).toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    theme === 'default'
                      ? 'bg-white/10'
                      : theme === 'third'
                        ? 'bg-[var(--button-bg)]'
                        : 'bg-white'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>⏰</span>
                      <span className={`font-medium text-sm ${
                        theme === 'default'
                          ? 'text-white/80'
                          : theme === 'third'
                            ? 'text-[var(--text-secondary)]'
                            : 'text-gray-600'
                      }`}>Saat</span>
                    </div>
                    <div className={`font-semibold ${
                      theme === 'default'
                        ? 'text-white'
                        : theme === 'third'
                          ? 'text-[var(--text-primary)]'
                          : 'text-gray-800'
                    }`}>
                      {startTime}{endTime ? ` - ${endTime}` : ''}
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    theme === 'default'
                      ? 'bg-white/10'
                      : theme === 'third'
                        ? 'bg-[var(--button-bg)]'
                        : 'bg-white'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>💰</span>
                      <span className={`font-medium text-sm ${
                        theme === 'default'
                          ? 'text-white/80'
                          : theme === 'third'
                            ? 'text-[var(--text-secondary)]'
                            : 'text-gray-600'
                      }`}>Ücret</span>
                    </div>
                    <div className={`font-semibold ${
                      theme === 'default'
                        ? 'text-white'
                        : theme === 'third'
                          ? 'text-[var(--text-primary)]'
                          : 'text-gray-800'
                    }`}>
                      {fieldPrice !== 'Bilinmiyor' ? `${fieldPrice} TL/saat` : 'Bilinmiyor'}
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    theme === 'default'
                      ? 'bg-white/10'
                      : theme === 'third'
                        ? 'bg-[var(--button-bg)]'
                        : 'bg-white'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>✅</span>
                      <span className={`font-medium text-sm ${
                        theme === 'default'
                          ? 'text-white/80'
                          : theme === 'third'
                            ? 'text-[var(--text-secondary)]'
                            : 'text-gray-600'
                      }`}>Durum</span>
                    </div>
                    <div className={`font-semibold ${
                      theme === 'default'
                        ? 'text-green-400'
                        : theme === 'third'
                          ? 'text-green-400'
                          : 'text-green-600'
                    }`}>
                      Onaylandı
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tarih */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'default'
            ? 'text-white/80'
            : theme === 'third'
              ? 'text-[var(--text-secondary)]'
              : 'text-gray-600'
        }`}>
          Tarih * (Rezervasyon seçildiğinde otomatik doldurulur)
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          required
          disabled={!!selectedReservationId}
          className={`w-full px-4 py-3 rounded-xl border transition-colors ${
            selectedReservationId
              ? theme === 'default'
                ? 'bg-white/10 border-white/20 text-white/80 cursor-not-allowed'
                : theme === 'third'
                  ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-muted)] cursor-not-allowed'
                  : 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed'
              : theme === 'default'
                ? 'bg-white/10 border-white/20 text-white'
                : theme === 'third'
                  ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)]'
                  : 'bg-white border-gray-300 text-gray-900'
          }`}
          style={{
            color: selectedReservationId 
              ? (theme === 'default' ? 'rgba(255,255,255,0.8)' : 
                 theme === 'third' ? '#999999' : '#6B7280')
              : (theme === 'default' ? 'white' : 
                 theme === 'third' ? '#e5e5e5' : '#374151')
          }}
        />
      </div>

      {/* Saat */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'default'
            ? 'text-white/80'
            : theme === 'third'
              ? 'text-[var(--text-secondary)]'
              : 'text-gray-600'
        }`}>
          Saat * (Rezervasyon seçildiğinde otomatik doldurulur)
        </label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => handleInputChange('time', e.target.value)}
          required
          disabled={!!selectedReservationId}
          className={`w-full px-4 py-3 rounded-xl border transition-colors ${
            selectedReservationId
              ? theme === 'default'
                ? 'bg-white/10 border-white/20 text-white/80 cursor-not-allowed'
                : theme === 'third'
                  ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-muted)] cursor-not-allowed'
                  : 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed'
              : theme === 'default'
                ? 'bg-white/10 border-white/20 text-white'
                : theme === 'third'
                  ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)]'
                  : 'bg-white border-gray-300 text-gray-900'
          }`}
          style={{
            color: selectedReservationId 
              ? (theme === 'default' ? 'rgba(255,255,255,0.8)' : 
                 theme === 'third' ? '#999999' : '#6B7280')
              : (theme === 'default' ? 'white' : 
                 theme === 'third' ? '#e5e5e5' : '#374151')
          }}
        />
      </div>

      {/* Mevcut Takım Büyüklüğü */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'default'
            ? 'text-white/80'
            : theme === 'third'
              ? 'text-[var(--text-secondary)]'
              : 'text-gray-600'
        }`}>
          Mevcut Takım Büyüklüğü
        </label>
        <input
          type="number"
          min="1"
          max="11"
          value={formData.teamSize}
          onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))}
          className={`w-full px-4 py-3 rounded-xl border transition-colors ${
            theme === 'default'
              ? 'bg-white/10 border-white/20 text-white'
              : theme === 'third'
                ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)]'
                : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>

      {/* Aranan Oyuncu Sayısı */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'default'
            ? 'text-white/80'
            : theme === 'third'
              ? 'text-[var(--text-secondary)]'
              : 'text-gray-600'
        }`}>
          Aranan Oyuncu Sayısı
        </label>
        <input
          type="number"
          min="1"
          max="11"
          value={formData.lookingForTeamSize}
          onChange={(e) => handleInputChange('lookingForTeamSize', parseInt(e.target.value))}
          className={`w-full px-4 py-3 rounded-xl border transition-colors ${
            theme === 'default'
              ? 'bg-white/10 border-white/20 text-white'
              : theme === 'third'
                ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)]'
                : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>

      {/* Seviye */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'default'
            ? 'text-white/80'
            : theme === 'third'
              ? 'text-[var(--text-secondary)]'
              : 'text-gray-600'
        }`}>
          Seviye
        </label>
        <select
          value={formData.level}
          onChange={(e) => handleInputChange('level', e.target.value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED")}
          className={`w-full px-4 py-3 rounded-xl border transition-colors ${
            theme === 'default'
              ? 'bg-white/10 border-white/20 text-white'
              : theme === 'third'
                ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)]'
                : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {levelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Ücret Paylaşımı */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'default'
            ? 'text-white/80'
            : theme === 'third'
              ? 'text-[var(--text-secondary)]'
              : 'text-gray-600'
        }`}>
          Ücret Paylaşımı
        </label>
        <select
          value={formData.feeSharing}
          onChange={(e) => handleInputChange('feeSharing', e.target.value as "SPLIT" | "FULL" | "FREE")}
          className={`w-full px-4 py-3 rounded-xl border transition-colors ${
            theme === 'default'
              ? 'bg-white/10 border-white/20 text-white'
              : theme === 'third'
                ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)]'
                : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {feeSharingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Açıklama */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'default'
            ? 'text-white/80'
            : theme === 'third'
              ? 'text-[var(--text-secondary)]'
              : 'text-gray-600'
        }`}>
          Açıklama (Opsiyonel)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          placeholder="Maç hakkında ek bilgiler, özel istekler vb..."
          className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
            theme === 'default'
              ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
              : theme === 'third'
                ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)] placeholder-[var(--input-placeholder)]'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-500 hover:to-blue-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Oluşturuluyor...' : 'İlan Oluştur'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${
            theme === 'default'
              ? 'bg-white/10 text-white hover:bg-white/20'
              : theme === 'third'
                ? 'bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)]'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          İptal
        </button>
      </div>
    </form>
  );
}
