"use client";

import { useState } from "react";
import { useTheme } from '../../context/ThemeContext';

interface JoinMatchRequestFormProps {
  matchRequestId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function JoinMatchRequestForm({ matchRequestId, onSuccess, onCancel }: JoinMatchRequestFormProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/match-requests/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchRequestId,
          message: message.trim() || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Katılım isteğiniz gönderildi! İlan sahibi onayladığında bildirim alacaksınız.');
        onSuccess();
      } else {
        alert(data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Katılım isteği gönderilirken hata:', error);
      alert('Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className={`text-lg font-bold mb-4 ${
          theme === 'default'
            ? 'text-white'
            : theme === 'third'
              ? 'text-[var(--text-primary)]'
              : 'text-gray-800'
        }`}>
          Bu ilana katılmak istiyorsunuz
        </h3>
        <p className={`text-sm mb-6 ${
          theme === 'default'
            ? 'text-white/80'
            : theme === 'third'
              ? 'text-[var(--text-secondary)]'
              : 'text-gray-600'
        }`}>
          İlan sahibine bir mesaj bırakabilirsiniz (opsiyonel). Bu mesaj onay sürecinde size yardımcı olabilir.
        </p>
      </div>

      {/* Mesaj */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'default'
            ? 'text-white/80'
            : theme === 'third'
              ? 'text-[var(--text-secondary)]'
              : 'text-gray-600'
        }`}>
          Mesaj (Opsiyonel)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="İlan sahibine söylemek istediğiniz bir şey var mı? (Örn: Oyuncu seviyeniz, deneyiminiz vb.)"
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
          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Gönderiliyor...' : 'Katılım İsteği Gönder'}
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
