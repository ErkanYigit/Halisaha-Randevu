"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTheme } from '../context/ThemeContext';
import MatchRequestList from "../components/match-requests/MatchRequestList";
import MatchRequestFilters from "../components/match-requests/MatchRequestFilters";
import CreateMatchRequestForm from "../components/match-requests/CreateMatchRequestForm";
import MatchRequestDetail from "../components/match-requests/MatchRequestDetail";
import JoinMatchRequestForm from "../components/match-requests/JoinMatchRequestForm";

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

export default function MatchRequestsPage() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    date: "",
    level: "",
    fieldId: "",
    city: "",
    page: 1,
  });
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedMatchRequest, setSelectedMatchRequest] = useState<MatchRequest | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  const fetchMatchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/match-requests/list?${params}`);
      const data = await response.json();

      if (data.success) {
        setMatchRequests(data.data);
      } else {
        setError(data.error || "Bir hata oluştu");
      }
    } catch (err) {
      setError("Sunucu hatası");
    } finally {
      setLoading(false);
    }
  };

  const fetchFields = async () => {
    try {
      const response = await fetch("/api/fields");
      const data = await response.json();
      console.log('Fields API Response:', data); // Debug log
      
      // API artık doğrudan dizi döndürüyor
      if (Array.isArray(data)) {
        setFields(data);
        console.log('Fields loaded:', data); // Debug log
      } else {
        console.error('Fields fetch failed - not an array:', data);
        setFields([]);
      }
    } catch (error) {
      console.error("Sahalar yüklenirken hata:", error);
      setFields([]);
    }
  };

  useEffect(() => {
    fetchMatchRequests();
    fetchFields();
    // eslint-disable-next-line
  }, [filters]);

  useEffect(() => {
    const user: any = session?.user;
    if (user?.id) {
      setCurrentUserId(user.id);
    } else if (user?.email) {
      fetch('/api/user/profile').then(res => res.json()).then(data => {
        if (data.id) setCurrentUserId(data.id);
      });
    }
  }, [session]);

  const handleJoinMatch = (matchRequestId: string) => {
    setSelectedMatchRequest(matchRequests.find(mr => mr.id === matchRequestId) || null);
    setShowJoinModal(true);
  };

  const handleCancelMatch = async (matchRequestId: string) => {
    if (!confirm("Bu ilanı iptal etmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(`/api/match-requests/cancel?id=${matchRequestId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("İlan başarıyla iptal edildi");
        fetchMatchRequests(); // Listeyi yenile
        setShowDetailModal(false); // Modal'ı kapat
      } else {
        alert(data.error || "Bir hata oluştu");
      }
    } catch (err) {
      alert("Sunucu hatası");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchMatchRequests();
  };

  const handleJoinSuccess = () => {
    setShowJoinModal(false);
    setShowDetailModal(false);
    fetchMatchRequests();
  };

  const openDetailModal = (matchRequest: MatchRequest) => {
    setSelectedMatchRequest(matchRequest);
    setShowDetailModal(true);
  };

  if (!session) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'default'
          ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800'
          : theme === 'third'
            ? 'bg-gradient-to-br from-black via-[#111111] to-[#222222]'
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className={`text-center backdrop-blur-xl rounded-3xl border p-10 ${
          theme === 'default'
            ? 'bg-white/10 border-white/20'
            : theme === 'third'
              ? 'bg-[var(--card-bg)] border-[var(--card-border)]'
              : 'bg-white/80 border-gray-200'
        }`}>
          <h1 className={`text-3xl font-extrabold mb-4 ${
            theme === 'default'
              ? 'text-white'
              : theme === 'third'
                ? 'text-[var(--text-primary)]'
                : 'text-gray-800'
          }`}>Rakip Bul</h1>
          <p className={`mb-6 ${
            theme === 'default'
              ? 'text-white/80'
              : theme === 'third'
                ? 'text-[var(--text-secondary)]'
                : 'text-gray-600'
          }`}>Bu özelliği kullanmak için giriş yapmanız gerekiyor.</p>
          <Link
            href="/auth/login"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all font-bold shadow-lg"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6 md:gap-0">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4 tracking-tight">
              Rakip Bul
            </h1>
            <p className={`text-xl font-light tracking-wide ${
              theme === 'default'
                ? 'text-white/90'
                : theme === 'third'
                  ? 'text-[var(--text-secondary)]'
                  : 'text-gray-700'
            }`}>
              Halı saha arkadaşları bulun ve maç yapın
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-2xl shadow-lg hover:from-green-500 hover:to-blue-600 transition-all font-bold text-lg"
            >
              + Yeni İlan Oluştur
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-10">
          <div className={`backdrop-blur-xl rounded-3xl border p-8 shadow-lg ${
            theme === 'default'
              ? 'bg-white/10 border-white/20'
              : theme === 'third'
                ? 'bg-[var(--card-bg)] border-[var(--card-border)]'
                : 'bg-white/80 border-gray-200'
          }`}>
            <MatchRequestFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto"></div>
              <p className={`mt-6 text-lg font-semibold ${
                theme === 'default'
                  ? 'text-white/90'
                  : theme === 'third'
                    ? 'text-[var(--text-primary)]'
                    : 'text-gray-800'
              }`}>Yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-400 text-lg font-bold">{error}</p>
              <button
                onClick={fetchMatchRequests}
                className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all font-bold"
              >
                Tekrar Dene
              </button>
            </div>
          ) : matchRequests.length === 0 ? (
            <div className="text-center py-16">
              <p className={`text-lg mb-6 ${
                theme === 'default'
                  ? 'text-white/90'
                  : theme === 'third'
                    ? 'text-[var(--text-secondary)]'
                    : 'text-gray-700'
              }`}>Henüz açık ilan bulunmuyor.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-2xl shadow-lg hover:from-green-500 hover:to-blue-600 transition-all font-bold text-lg"
              >
                İlk İlanı Sen Oluştur
              </button>
            </div>
          ) : (
            <MatchRequestList 
              matchRequests={matchRequests}
              onJoinMatch={handleJoinMatch}
              onViewDetail={openDetailModal}
              currentUserId={currentUserId}
            />
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`backdrop-blur-xl rounded-3xl border p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            theme === 'default'
              ? 'bg-white/10 border-white/20'
              : theme === 'third'
                ? 'bg-[var(--card-bg)] border-[var(--card-border)]'
                : 'bg-white/90 border-gray-200'
          }`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${
                  theme === 'default'
                    ? 'text-white'
                    : theme === 'third'
                      ? 'text-[var(--text-primary)]'
                      : 'text-gray-800'
                }`}>Yeni İlan Oluştur</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`text-2xl font-bold ${
                    theme === 'default'
                      ? 'text-white/70 hover:text-white'
                      : theme === 'third'
                        ? 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ×
                </button>
              </div>
              <CreateMatchRequestForm 
                fields={fields} 
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowCreateModal(false)}
              />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedMatchRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`backdrop-blur-xl rounded-3xl border p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
            theme === 'default'
              ? 'bg-white/10 border-white/20'
              : theme === 'third'
                ? 'bg-[var(--card-bg)] border-[var(--card-border)]'
                : 'bg-white/90 border-gray-200'
          }`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${
                  theme === 'default'
                    ? 'text-white'
                    : theme === 'third'
                      ? 'text-[var(--text-primary)]'
                      : 'text-gray-800'
                }`}>İlan Detayı</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className={`text-2xl font-bold ${
                    theme === 'default'
                      ? 'text-white/70 hover:text-white'
                      : theme === 'third'
                        ? 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ×
                </button>
              </div>
              <MatchRequestDetail
                matchRequest={selectedMatchRequest}
                onJoinMatch={handleJoinMatch}
                onCancelMatch={handleCancelMatch}
                currentUserId={currentUserId}
              />
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && selectedMatchRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`backdrop-blur-xl rounded-3xl border p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            theme === 'default'
              ? 'bg-white/10 border-white/20'
              : theme === 'third'
                ? 'bg-[var(--card-bg)] border-[var(--card-border)]'
                : 'bg-white/90 border-gray-200'
          }`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${
                  theme === 'default'
                    ? 'text-white'
                    : theme === 'third'
                      ? 'text-[var(--text-primary)]'
                      : 'text-gray-800'
                }`}>İlana Katıl</h2>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className={`text-2xl font-bold ${
                    theme === 'default'
                      ? 'text-white/70 hover:text-white'
                      : theme === 'third'
                        ? 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ×
                </button>
              </div>
              <JoinMatchRequestForm
                matchRequestId={selectedMatchRequest.id}
                onSuccess={handleJoinSuccess}
                onCancel={() => setShowJoinModal(false)}
              />
          </div>
        </div>
      )}
    </div>
  );
}
