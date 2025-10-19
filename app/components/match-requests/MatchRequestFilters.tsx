"use client";

import { useState } from "react";
import { useTheme } from '../../context/ThemeContext';

interface MatchRequestFiltersProps {
  filters: {
    date: string;
    level: string;
    fieldId: string;
    city: string;
    page: number;
  };
  onFiltersChange: (filters: any) => void;
}

export default function MatchRequestFilters({ filters, onFiltersChange }: MatchRequestFiltersProps) {
  const { theme } = useTheme();
  const [cities] = useState([
    "Tüm Şehirler",
    "İstanbul",
    "Ankara", 
    "İzmir",
    "Bursa",
    "Antalya",
    "Adana",
    "Konya",
    "Gaziantep",
    "Mersin"
  ]);

  const [levels] = useState([
    "Tüm Seviyeler",
    "BEGINNER",
    "INTERMEDIATE", 
    "ADVANCED"
  ]);

  const levelLabels = {
    "Tüm Seviyeler": "Tüm Seviyeler",
    "BEGINNER": "Başlangıç",
    "INTERMEDIATE": "Orta",
    "ADVANCED": "İleri"
  };

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === "Tüm Şehirler" || value === "Tüm Seviyeler" ? "" : value,
      page: 1
    });
  };

  return (
    <div className="space-y-6">
      <h3 className={`text-xl font-bold ${
        theme === 'default'
          ? 'text-white'
          : theme === 'third'
            ? 'text-[var(--text-primary)]'
            : 'text-gray-800'
      }`}>
        Filtreler
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tarih */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'default'
              ? 'text-white/80'
              : theme === 'third'
                ? 'text-[var(--text-secondary)]'
                : 'text-gray-600'
          }`}>
            Tarih
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-colors ${
              theme === 'default'
                ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                : theme === 'third'
                  ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)] placeholder-[var(--input-placeholder)]'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
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
            value={filters.level || "Tüm Seviyeler"}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-colors ${
              theme === 'default'
                ? 'bg-white/10 border-white/20 text-white'
                : theme === 'third'
                  ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)]'
                  : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {levelLabels[level as keyof typeof levelLabels]}
              </option>
            ))}
          </select>
        </div>

        {/* Şehir */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'default'
              ? 'text-white/80'
              : theme === 'third'
                ? 'text-[var(--text-secondary)]'
                : 'text-gray-600'
          }`}>
            Şehir
          </label>
          <select
            value={filters.city || "Tüm Şehirler"}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-colors ${
              theme === 'default'
                ? 'bg-white/10 border-white/20 text-white'
                : theme === 'third'
                  ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)]'
                  : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Saha */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'default'
              ? 'text-white/80'
              : theme === 'third'
                ? 'text-[var(--text-secondary)]'
                : 'text-gray-600'
          }`}>
            Saha
          </label>
          <select
            value={filters.fieldId || "Tüm Sahalar"}
            onChange={(e) => handleFilterChange('fieldId', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-colors ${
              theme === 'default'
                ? 'bg-white/10 border-white/20 text-white'
                : theme === 'third'
                  ? 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)]'
                  : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Tüm Sahalar</option>
            {/* Buraya saha listesi gelecek */}
          </select>
        </div>
      </div>
    </div>
  );
}
