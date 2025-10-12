'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFutbol, FaClock, FaUsers, FaTrophy, FaChartLine } from 'react-icons/fa';

interface LiveMatch {
  id: string;
  fieldName: string;
  team1: string;
  team2: string;
  score: [number, number];
  time: string;
  status: 'live' | 'upcoming' | 'completed';
  players: number;
  tournament?: string;
}

const mockMatches: LiveMatch[] = [
  {
    id: '1',
    fieldName: 'Futbol Arena',
    team1: 'Galatasaray',
    team2: 'Fenerbahçe',
    score: [2, 1],
    time: '35:00',
    status: 'live',
    players: 10,
    tournament: 'İstanbul Ligi'
  },
  {
    id: '2',
    fieldName: 'Spor Kompleksi',
    team1: 'Beşiktaş',
    team2: 'Trabzonspor',
    score: [0, 0],
    time: '20:00',
    status: 'upcoming',
    players: 8
  }
];

export default function LiveMatches() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Başlık */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
              Canlı Maçlar
            </h1>
            <p className="text-xl text-white/80">
              Halı sahalardaki maçları canlı takip edin
            </p>
          </div>

          {/* Filtreler */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter('all')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Tümü
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter('live')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                selectedFilter === 'live'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Canlı
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter('upcoming')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                selectedFilter === 'upcoming'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Yaklaşan
            </motion.button>
          </div>

          {/* Maç Listesi */}
          <div className="space-y-6">
            {mockMatches
              .filter(match => selectedFilter === 'all' || match.status === selectedFilter)
              .map((match) => (
                <motion.div
                  key={match.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Saha Bilgisi */}
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                        <FaFutbol className="text-2xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{match.fieldName}</h3>
                        {match.tournament && (
                          <div className="flex items-center text-white/60 text-sm">
                            <FaTrophy className="mr-2" />
                            {match.tournament}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Maç Detayları */}
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-white font-bold text-xl">{match.team1}</p>
                        <p className="text-white/60 text-sm">Ev Sahibi</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-white/10 rounded-xl px-6 py-2">
                          <p className="text-white font-bold text-2xl">
                            {match.status === 'live' ? `${match.score[0]} - ${match.score[1]}` : 'VS'}
                          </p>
                          {match.status === 'live' && (
                            <div className="flex items-center justify-center text-red-400 text-sm mt-1">
                              <FaClock className="mr-1" />
                              {match.time}
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm mt-2 inline-block ${
                          match.status === 'live'
                            ? 'bg-red-500/20 text-red-400'
                            : match.status === 'upcoming'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {match.status === 'live' ? 'Canlı' : 
                           match.status === 'upcoming' ? 'Yaklaşan' : 'Tamamlandı'}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold text-xl">{match.team2}</p>
                        <p className="text-white/60 text-sm">Deplasman</p>
                      </div>
                    </div>

                    {/* Oyuncu Sayısı */}
                    <div className="flex items-center gap-2 text-white/60">
                      <FaUsers />
                      <span>{match.players} Oyuncu</span>
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