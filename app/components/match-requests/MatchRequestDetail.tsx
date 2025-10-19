"use client";

import { useState, useEffect } from "react";
import { useTheme } from '../../context/ThemeContext';

interface MatchRequest {
  id: string;
  date: string;
  time: string;
  teamSize: number;
  lookingForTeamSize: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  feeSharing: "SPLIT" | "FULL" | "FREE";
  description?: string;
  status: "OPEN" | "MATCHED" | "CLOSED";
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  field: {
    id: string;
    name: string;
    address: string;
    city: string;
    district: string;
    price: number;
  };
}

interface MatchRequestDetailProps {
  matchRequest: MatchRequest;
  onJoinMatch: (matchRequestId: string) => void;
  onCancelMatch: (matchRequestId: string) => void;
  currentUserId?: string;
}

interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function MatchRequestDetail({ 
  matchRequest, 
  onJoinMatch, 
  onCancelMatch, 
  currentUserId 
}: MatchRequestDetailProps) {
  const { theme } = useTheme();
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const isOwner = matchRequest.creator.id === currentUserId;

  useEffect(() => {
    if (isOwner) {
      fetchJoinRequests();
    }
  }, [isOwner, matchRequest.id]);

  const fetchJoinRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/match-requests/${matchRequest.id}/join-requests`);
      const data = await response.json();
      
      if (data.success) {
        setJoinRequests(data.data);
      }
    } catch (error) {
      console.error('Katılım istekleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (joinRequestId: string) => {
    try {
      const response = await fetch(`/api/match-requests/join-requests/${joinRequestId}/approve`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        alert('Katılım isteği onaylandı!');
        fetchJoinRequests();
      } else {
        alert(data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Onaylama hatası:', error);
      alert('Sunucu hatası');
    }
  };

  const handleRejectRequest = async (joinRequestId: string) => {
    try {
      const response = await fetch(`/api/match-requests/join-requests/${joinRequestId}/reject`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        alert('Katılım isteği reddedildi');
        fetchJoinRequests();
      } else {
        alert(data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Reddetme hatası:', error);
      alert('Sunucu hatası');
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "BEGINNER": return "Başlangıç";
      case "INTERMEDIATE": return "Orta";
      case "ADVANCED": return "İleri";
      default: return level;
    }
  };

  const getFeeSharingLabel = (feeSharing: string) => {
    switch (feeSharing) {
      case "SPLIT": return "Bölüşümlü";
      case "FULL": return "Tam Ödeme";
      case "FREE": return "Ücretsiz";
      default: return feeSharing;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="space-y-6">
      {/* İlan Bilgileri */}
      <div className={`backdrop-blur-xl rounded-2xl border p-6 ${
        theme === 'default'
          ? 'bg-white/10 border-white/20'
          : theme === 'third'
            ? 'bg-[var(--card-bg)] border-[var(--card-border)]'
            : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-2xl font-bold ${
            theme === 'default'
              ? 'text-white'
              : theme === 'third'
                ? 'text-[var(--text-primary)]'
                : 'text-gray-800'
          }`}>
            {matchRequest.field.name}
          </h3>
          <div className="flex gap-2">
            {matchRequest.status === 'OPEN' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Açık
              </span>
            )}
            {matchRequest.status === 'MATCHED' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Eşleşti
              </span>
            )}
            {matchRequest.status === 'CLOSED' && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                Kapalı
              </span>
            )}
          </div>
        </div>

        <p className={`text-sm mb-4 ${
          theme === 'default'
            ? 'text-white/70'
            : theme === 'third'
              ? 'text-[var(--text-muted)]'
              : 'text-gray-600'
        }`}>
          {matchRequest.field.address}, {matchRequest.field.city}, {matchRequest.field.district}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            matchRequest.level === 'BEGINNER' 
              ? 'bg-green-100 text-green-800'
              : matchRequest.level === 'INTERMEDIATE'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {getLevelLabel(matchRequest.level)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            matchRequest.feeSharing === 'SPLIT'
              ? 'bg-blue-100 text-blue-800'
              : matchRequest.feeSharing === 'FULL'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-green-100 text-green-800'
          }`}>
            {getFeeSharingLabel(matchRequest.feeSharing)}
          </span>
        </div>

        {/* Detaylar */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className={`text-sm font-medium ${
              theme === 'default'
                ? 'text-white/80'
                : theme === 'third'
                  ? 'text-[var(--text-secondary)]'
                  : 'text-gray-600'
            }`}>
              Tarih
            </p>
            <p className={`text-lg font-bold ${
              theme === 'default'
                ? 'text-white'
                : theme === 'third'
                  ? 'text-[var(--text-primary)]'
                  : 'text-gray-800'
            }`}>
              {formatDate(matchRequest.date)}
            </p>
          </div>
          <div>
            <p className={`text-sm font-medium ${
              theme === 'default'
                ? 'text-white/80'
                : theme === 'third'
                  ? 'text-[var(--text-secondary)]'
                  : 'text-gray-600'
            }`}>
              Saat
            </p>
            <p className={`text-lg font-bold ${
              theme === 'default'
                ? 'text-white'
                : theme === 'third'
                  ? 'text-[var(--text-primary)]'
                  : 'text-gray-800'
            }`}>
              {matchRequest.time.substring(0, 5)}
            </p>
          </div>
          <div>
            <p className={`text-sm font-medium ${
              theme === 'default'
                ? 'text-white/80'
                : theme === 'third'
                  ? 'text-[var(--text-secondary)]'
                  : 'text-gray-600'
            }`}>
              Mevcut Takım
            </p>
            <p className={`text-lg font-bold ${
              theme === 'default'
                ? 'text-white'
                : theme === 'third'
                  ? 'text-[var(--text-primary)]'
                  : 'text-gray-800'
            }`}>
              {matchRequest.teamSize} kişi
            </p>
          </div>
          <div>
            <p className={`text-sm font-medium ${
              theme === 'default'
                ? 'text-white/80'
                : theme === 'third'
                  ? 'text-[var(--text-secondary)]'
                  : 'text-gray-600'
            }`}>
              Aranan Oyuncu
            </p>
            <p className={`text-lg font-bold ${
              theme === 'default'
                ? 'text-white'
                : theme === 'third'
                  ? 'text-[var(--text-primary)]'
                  : 'text-gray-800'
            }`}>
              {matchRequest.lookingForTeamSize} kişi
            </p>
          </div>
        </div>

        {/* Açıklama */}
        {matchRequest.description && (
          <div className="mb-6">
            <p className={`text-sm font-medium mb-2 ${
              theme === 'default'
                ? 'text-white/80'
                : theme === 'third'
                  ? 'text-[var(--text-secondary)]'
                  : 'text-gray-600'
            }`}>
              Açıklama
            </p>
            <p className={`${
              theme === 'default'
                ? 'text-white/90'
                : theme === 'third'
                  ? 'text-[var(--text-primary)]'
                  : 'text-gray-700'
            }`}>
              {matchRequest.description}
            </p>
          </div>
        )}

        {/* İlan Sahibi */}
        <div className="mb-6">
          <p className={`text-sm ${
            theme === 'default'
              ? 'text-white/70'
              : theme === 'third'
                ? 'text-[var(--text-muted)]'
                : 'text-gray-600'
          }`}>
            İlan Sahibi: <span className="font-medium">{matchRequest.creator.name}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isOwner && matchRequest.status === 'OPEN' && (
            <button
              onClick={() => onJoinMatch(matchRequest.id)}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-blue-600 transition-all"
            >
              Katıl
            </button>
          )}
          
          {isOwner && matchRequest.status === 'OPEN' && (
            <button
              onClick={() => onCancelMatch(matchRequest.id)}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${
                theme === 'default'
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : theme === 'third'
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              İlanı İptal Et
            </button>
          )}
        </div>
      </div>

      {/* Katılım İstekleri (Sadece İlan Sahibi Görebilir) */}
      {isOwner && (
        <div className={`backdrop-blur-xl rounded-2xl border p-6 ${
          theme === 'default'
            ? 'bg-white/10 border-white/20'
            : theme === 'third'
              ? 'bg-[var(--card-bg)] border-[var(--card-border)]'
              : 'bg-white/80 border-gray-200'
        }`}>
          <h4 className={`text-xl font-bold mb-4 ${
            theme === 'default'
              ? 'text-white'
              : theme === 'third'
                ? 'text-[var(--text-primary)]'
                : 'text-gray-800'
          }`}>
            Katılım İstekleri
          </h4>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
              <p className={`mt-2 text-sm ${
                theme === 'default'
                  ? 'text-white/70'
                  : theme === 'third'
                    ? 'text-[var(--text-muted)]'
                    : 'text-gray-600'
              }`}>
                Yükleniyor...
              </p>
            </div>
          ) : joinRequests.length === 0 ? (
            <p className={`text-center py-8 ${
              theme === 'default'
                ? 'text-white/70'
                : theme === 'third'
                  ? 'text-[var(--text-muted)]'
                  : 'text-gray-600'
            }`}>
              Henüz katılım isteği bulunmuyor.
            </p>
          ) : (
            <div className="space-y-4">
              {joinRequests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 rounded-xl border ${
                    theme === 'default'
                      ? 'bg-white/5 border-white/10'
                      : theme === 'third'
                        ? 'bg-[var(--card-bg)] border-[var(--card-border)]'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className={`font-medium ${
                        theme === 'default'
                          ? 'text-white'
                          : theme === 'third'
                            ? 'text-[var(--text-primary)]'
                            : 'text-gray-800'
                      }`}>
                        {request.userName}
                      </p>
                      <p className={`text-sm ${
                        theme === 'default'
                          ? 'text-white/70'
                          : theme === 'third'
                            ? 'text-[var(--text-muted)]'
                            : 'text-gray-600'
                      }`}>
                        {request.userEmail}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status === 'PENDING' ? 'Beklemede' :
                       request.status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}
                    </span>
                  </div>

                  {request.message && (
                    <p className={`text-sm mb-3 ${
                      theme === 'default'
                        ? 'text-white/80'
                        : theme === 'third'
                          ? 'text-[var(--text-secondary)]'
                          : 'text-gray-700'
                    }`}>
                      "{request.message}"
                    </p>
                  )}

                  {request.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveRequest(request.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
