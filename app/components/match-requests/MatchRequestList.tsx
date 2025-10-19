"use client";

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
  approvedPlayersCount?: number;
  approvedPlayers?: string[];
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

interface MatchRequestListProps {
  matchRequests: MatchRequest[];
  onJoinMatch: (matchRequestId: string) => void;
  onViewDetail: (matchRequest: MatchRequest) => void;
  currentUserId?: string;
}

export default function MatchRequestList({ 
  matchRequests, 
  onJoinMatch, 
  onViewDetail, 
  currentUserId 
}: MatchRequestListProps) {
  const { theme } = useTheme();

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
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM format
  };

  if (matchRequests.length === 0) {
    return (
      <div className="text-center py-16">
        <p className={`text-lg ${
          theme === 'default'
            ? 'text-white/90'
            : theme === 'third'
              ? 'text-[var(--text-secondary)]'
              : 'text-gray-700'
        }`}>
          Henüz ilan bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matchRequests.map((matchRequest) => (
        <div
          key={matchRequest.id}
          className={`backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:scale-105 cursor-pointer ${
            theme === 'default'
              ? 'bg-white/10 border-white/20 hover:bg-white/20'
              : theme === 'third'
                ? 'bg-[var(--card-bg)] border-[var(--card-border)] hover:bg-[var(--card-hover)]'
                : 'bg-white/80 border-gray-200 hover:bg-white shadow-lg'
          }`}
          onClick={() => onViewDetail(matchRequest)}
        >
          {/* Header */}
          <div className="mb-4">
            <h3 className={`text-xl font-bold mb-2 ${
              theme === 'default'
                ? 'text-white'
                : theme === 'third'
                  ? 'text-[var(--text-primary)]'
                  : 'text-gray-800'
            }`}>
              {matchRequest.field.name}
            </h3>
            <p className={`text-sm ${
              theme === 'default'
                ? 'text-white/70'
                : theme === 'third'
                  ? 'text-[var(--text-muted)]'
                  : 'text-gray-600'
            }`}>
              {matchRequest.field.city}, {matchRequest.field.district}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
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

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
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
                {formatTime(matchRequest.time)}
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
                Takım
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
                Aranan
              </p>
              <p className={`text-lg font-bold ${
                theme === 'default'
                  ? 'text-white'
                  : theme === 'third'
                    ? 'text-[var(--text-primary)]'
                    : 'text-gray-800'
              }`}>
                {matchRequest.approvedPlayersCount || 0}/{matchRequest.lookingForTeamSize} kişi
              </p>
              {matchRequest.approvedPlayers && matchRequest.approvedPlayers.length > 0 && (
                <p className={`text-xs ${
                  theme === 'default'
                    ? 'text-white/60'
                    : theme === 'third'
                      ? 'text-[var(--text-muted)]'
                      : 'text-gray-500'
                }`}>
                  Onaylanan: {matchRequest.approvedPlayers.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* İlan Sahibi */}
          <div className="mb-4">
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(matchRequest);
              }}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                theme === 'default'
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : theme === 'third'
                    ? 'bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Detayları Gör
            </button>
            {matchRequest.creator.id !== currentUserId && matchRequest.status === 'OPEN' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoinMatch(matchRequest.id);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all"
              >
                Katıl
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
