"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FaFutbol, FaUsers, FaTshirt, FaDownload } from 'react-icons/fa';
import html2canvas from "html2canvas";

const shiftX = (x: number) => Math.max(0, x - 4);
const formations = [
  { name: "11 - 4-2-3-1", count: 11, positions: [
    { name: "Levent", x: shiftX(50), y: 10 },
    { name: "Harun", x: shiftX(50), y: 25 },
    { name: "Kerem", x: shiftX(25), y: 35 },
    { name: "Mehmet", x: shiftX(75), y: 35 },
    { name: "Furkan", x: shiftX(35), y: 45 },
    { name: "Serdar", x: shiftX(65), y: 45 },
    { name: "Murat", x: shiftX(20), y: 65 },
    { name: "Berk", x: shiftX(40), y: 65 },
    { name: "Serkan", x: shiftX(60), y: 65 },
    { name: "Umut", x: shiftX(80), y: 65 },
    { name: "Polat", x: shiftX(50), y: 85 },
  ]},
  { name: "11 - 4-3-3", count: 11, positions: [
    { name: "Kaleci", x: shiftX(50), y: 10 },
    { name: "Bek 1", x: shiftX(20), y: 30 },
    { name: "Bek 2", x: shiftX(80), y: 30 },
    { name: "Stoper 1", x: shiftX(35), y: 30 },
    { name: "Stoper 2", x: shiftX(65), y: 30 },
    { name: "Orta 1", x: shiftX(30), y: 55 },
    { name: "Orta 2", x: shiftX(50), y: 55 },
    { name: "Orta 3", x: shiftX(70), y: 55 },
    { name: "Forvet 1", x: shiftX(30), y: 80 },
    { name: "Forvet 2", x: shiftX(50), y: 80 },
    { name: "Forvet 3", x: shiftX(70), y: 80 },
  ]},
  { name: "11 - 3-5-2", count: 11, positions: [
    { name: "Kaleci", x: shiftX(50), y: 10 },
    { name: "Stoper 1", x: shiftX(30), y: 30 },
    { name: "Stoper 2", x: shiftX(50), y: 30 },
    { name: "Stoper 3", x: shiftX(70), y: 30 },
    { name: "Orta 1", x: shiftX(20), y: 55 },
    { name: "Orta 2", x: shiftX(35), y: 55 },
    { name: "Orta 3", x: shiftX(50), y: 55 },
    { name: "Orta 4", x: shiftX(65), y: 55 },
    { name: "Orta 5", x: shiftX(80), y: 55 },
    { name: "Forvet 1", x: shiftX(40), y: 80 },
    { name: "Forvet 2", x: shiftX(60), y: 80 },
  ]},
  { name: "11 - 4-1-4-1", count: 11, positions: [
    { name: "Kaleci", x: shiftX(50), y: 10 },
    { name: "Bek 1", x: shiftX(20), y: 30 },
    { name: "Bek 2", x: shiftX(80), y: 30 },
    { name: "Stoper 1", x: shiftX(35), y: 30 },
    { name: "Stoper 2", x: shiftX(65), y: 30 },
    { name: "Defansif Orta", x: shiftX(50), y: 45 },
    { name: "Orta 1", x: shiftX(20), y: 60 },
    { name: "Orta 2", x: shiftX(40), y: 60 },
    { name: "Orta 3", x: shiftX(60), y: 60 },
    { name: "Orta 4", x: shiftX(80), y: 60 },
    { name: "Forvet", x: shiftX(50), y: 85 },
  ]},
  { name: "8 - 3-3-1", count: 8, positions: [
    { name: "Kaleci", x: shiftX(50), y: 10 },
    { name: "Defans 1", x: shiftX(25), y: 30 },
    { name: "Defans 2", x: shiftX(50), y: 30 },
    { name: "Defans 3", x: shiftX(75), y: 30 },
    { name: "Orta 1", x: shiftX(30), y: 55 },
    { name: "Orta 2", x: shiftX(50), y: 55 },
    { name: "Orta 3", x: shiftX(70), y: 55 },
    { name: "Forvet", x: shiftX(50), y: 85 },
  ]},
  { name: "8 - 2-3-2", count: 8, positions: [
    { name: "Kaleci", x: shiftX(50), y: 10 },
    { name: "Defans 1", x: shiftX(35), y: 30 },
    { name: "Defans 2", x: shiftX(65), y: 30 },
    { name: "Orta 1", x: shiftX(25), y: 55 },
    { name: "Orta 2", x: shiftX(50), y: 55 },
    { name: "Orta 3", x: shiftX(75), y: 55 },
    { name: "Hücum 1", x: shiftX(40), y: 75 },
    { name: "Hücum 2", x: shiftX(60), y: 75 },
  ]},
  { name: "8 - 2-4-1", count: 8, positions: [
    { name: "Kaleci", x: shiftX(50), y: 10 },
    { name: "Defans 1", x: shiftX(35), y: 30 },
    { name: "Defans 2", x: shiftX(65), y: 30 },
    { name: "Orta 1", x: shiftX(25), y: 55 },
    { name: "Orta 2", x: shiftX(40), y: 55 },
    { name: "Orta 3", x: shiftX(60), y: 55 },
    { name: "Orta 4", x: shiftX(75), y: 55 },
    { name: "Forvet", x: shiftX(50), y: 85 },
  ]},
  { name: "7 - 2-3-1", count: 7, positions: [
    { name: "Kaleci", x: shiftX(50), y: 10 },
    { name: "Defans 1", x: shiftX(35), y: 35 },
    { name: "Defans 2", x: shiftX(65), y: 35 },
    { name: "Orta 1", x: shiftX(30), y: 55 },
    { name: "Orta 2", x: shiftX(70), y: 55 },
    { name: "Hücum", x: shiftX(50), y: 70 },
    { name: "Forvet", x: shiftX(50), y: 85 },
  ]},
  { name: "7 - 3-2-1", count: 7, positions: [
    { name: "Kaleci", x: shiftX(50), y: 10 },
    { name: "Defans 1", x: shiftX(25), y: 35 },
    { name: "Defans 2", x: shiftX(50), y: 35 },
    { name: "Defans 3", x: shiftX(75), y: 35 },
    { name: "Orta 1", x: shiftX(35), y: 60 },
    { name: "Orta 2", x: shiftX(65), y: 60 },
    { name: "Forvet", x: shiftX(50), y: 85 },
  ]},
  { name: "7 - 2-2-2", count: 7, positions: [
    { name: "Kaleci", x: shiftX(50), y: 10 },
    { name: "Defans 1", x: shiftX(35), y: 35 },
    { name: "Defans 2", x: shiftX(65), y: 35 },
    { name: "Orta 1", x: shiftX(30), y: 55 },
    { name: "Orta 2", x: shiftX(70), y: 55 },
    { name: "Hücum 1", x: shiftX(40), y: 70 },
    { name: "Hücum 2", x: shiftX(60), y: 70 },
  ]},
  { name: "5 - 2-2", count: 5, positions: [
    { name: "Kaleci", x: shiftX(50), y: 15 },
    { name: "Defans 1", x: shiftX(35), y: 40 },
    { name: "Defans 2", x: shiftX(65), y: 40 },
    { name: "Orta", x: shiftX(50), y: 60 },
    { name: "Forvet", x: shiftX(50), y: 85 },
  ]},
  { name: "5 - 1-2-1", count: 5, positions: [
    { name: "Kaleci", x: shiftX(50), y: 15 },
    { name: "Defans", x: shiftX(50), y: 35 },
    { name: "Orta 1", x: shiftX(35), y: 60 },
    { name: "Orta 2", x: shiftX(65), y: 60 },
    { name: "Forvet", x: shiftX(50), y: 85 },
  ]},
  { name: "5 - 3-1", count: 5, positions: [
    { name: "Kaleci", x: shiftX(50), y: 15 },
    { name: "Defans 1", x: shiftX(30), y: 40 },
    { name: "Defans 2", x: shiftX(50), y: 40 },
    { name: "Defans 3", x: shiftX(70), y: 40 },
    { name: "Forvet", x: shiftX(50), y: 85 },
  ]},
];

const fieldWidth = 420;
const fieldHeight = 600;
const playerSize = 48;
const fieldInner = { x: 20, y: 10, width: 380, height: 580 };

export default function KadroKurPage() {
  const { theme } = useTheme();
  const [fieldType, setFieldType] = useState("Halı");
  const [formation, setFormation] = useState(formations[0]);
  const [playerCount, setPlayerCount] = useState(formation.count);
  const [bodyColor, setBodyColor] = useState("#800000");
  const [armColor, setArmColor] = useState("#fff");
  const [names, setNames] = useState(formation.positions.map(p => p.name));
  const [editMode, setEditMode] = useState(Array(22).fill(false)); // max 22 oyuncu için

  // Diziliş değişince isimleri sıfırla ve oyuncu sayısına göre ayarla
  const handleFormationChange = (idx: number) => {
    setFormation(formations[idx]);
    setPlayerCount(formations[idx].count);
    setNames(formations[idx].positions.map(p => p.name));
  };

  // Oyuncu sayısı değişince uygun formasyonu seç
  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    const uygunFormasyonlar = formations.filter(f => f.count === count);
    if (uygunFormasyonlar.length > 0) {
      setFormation(uygunFormasyonlar[0]);
      setNames(uygunFormasyonlar[0].positions.map(p => p.name));
    } else {
      setNames(prev => {
        if (count < prev.length) {
          return prev.slice(0, count);
        } else {
          return [
            ...prev,
            ...Array(count - prev.length).fill(0).map((_, i) => `Oyuncu ${prev.length + i + 1}`)
          ];
        }
      });
    }
  };

  return (
    <main className={`min-h-screen flex flex-col items-center py-10 ${
      theme === 'default'
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800'
        : theme === 'third'
          ? 'bg-gradient-to-br from-black via-[#111111] to-[#222222]'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
          Kadro Kur
        </h1>
        <p className="text-xl text-white/80">
          Takımınızı oluşturun ve dizilimi kaydedin
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl">
        {/* Sol Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`backdrop-blur-xl rounded-3xl p-8 flex flex-col gap-6 w-full md:w-1/3 shadow-2xl ${
            theme === 'default'
              ? 'bg-white/10 text-white border border-white/20'
              : theme === 'third'
                ? 'bg-[#111111]/90 text-[#e5e5e5] border border-[#333333]'
                : 'bg-white/80 text-gray-800 border border-gray-200'
          }`}
        >
          <div>
            <label className="font-bold text-lg tracking-widest flex items-center gap-2">
              <FaFutbol className="text-pink-500" /> SAHA TİPİ
            </label>
            <select value={fieldType} onChange={e => setFieldType(e.target.value)} className={`w-full mt-2 p-2 rounded font-semibold focus:outline-none focus:border-pink-500 transition-colors ${
              theme === 'default'
                ? 'bg-white/10 border border-white/20 text-white'
                : theme === 'third'
                  ? 'bg-[#222222] border border-[#333333] text-[#e5e5e5]'
                  : 'bg-white border border-gray-200 text-gray-800'
            }`}>
              <option>Halı</option>
              <option>Çim</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-lg tracking-widest flex items-center gap-2">
              <FaUsers className="text-pink-500" /> OYUNCU SAYISI
            </label>
            <select value={playerCount} onChange={e => handlePlayerCountChange(Number(e.target.value))} className={`w-full mt-2 p-2 rounded font-semibold focus:outline-none focus:border-pink-500 transition-colors ${
              theme === 'default'
                ? 'bg-white/10 border border-white/20 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
            }`}>
              <option value={11}>11</option>
              <option value={8}>8</option>
              <option value={7}>7</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-lg tracking-widest flex items-center gap-2">
              <FaTshirt className="text-pink-500" /> TAKTİK
            </label>
            <select value={formation.name} onChange={e => handleFormationChange(formations.findIndex(f => f.name === e.target.value))} className={`w-full mt-2 p-2 rounded font-semibold focus:outline-none focus:border-pink-500 transition-colors ${
              theme === 'default'
                ? 'bg-white/10 border border-white/20 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
            }`}>
              {formations.filter(f => f.count === playerCount).map((f, i) => (
                <option key={i}>{f.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-bold text-lg tracking-widest">RENKLER</label>
            <div className="flex gap-8 mt-2">
              <div className="flex flex-col items-center">
                <span className="font-bold">GÖVDE</span>
                <input type="color" value={bodyColor} onChange={e => setBodyColor(e.target.value)} className="w-12 h-8 rounded border-2 border-white/20 focus:border-pink-500 transition-colors" />
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">KOL</span>
                <input type="color" value={armColor} onChange={e => setArmColor(e.target.value)} className="w-12 h-8 rounded border-2 border-white/20 focus:border-pink-500 transition-colors" />
              </div>
            </div>
          </div>
          {/* Oyuncu İsimleri */}
          <div>
            <label className="font-bold text-lg tracking-widest">OYUNCU İSİMLERİ</label>
            <div className="mt-2 space-y-2">
              {names.slice(0, playerCount).map((name, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={name}
                  onChange={e => {
                    const newNames = [...names];
                    newNames[idx] = e.target.value;
                    setNames(newNames);
                  }}
                  className={`w-full p-2 rounded font-semibold focus:outline-none focus:border-pink-500 transition-colors ${
                    theme === 'default'
                      ? 'bg-white/10 border border-white/20 text-white'
                      : theme === 'third'
                        ? 'bg-[#222222] border border-[#333333] text-[#e5e5e5]'
                        : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                  placeholder={`Oyuncu ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
        {/* Sağ Panel - Saha */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col items-center"
        >
          <div className="relative w-[420px] h-[600px] rounded-3xl shadow-2xl border border-white/20 flex items-center justify-center"
            id="formation-canvas"
            style={fieldType === 'Halı' ? { background: '#228B22' } : { background: 'transparent' }}>
            {/* Saha çizgileri */}
            <svg className="absolute left-0 top-0 w-full h-full" viewBox="0 0 420 600">
              {fieldType === 'Çim' &&
                [0,1,2,3,4,5,6].map(i => (
                  <rect key={i} x="0" y={i*600/7} width="420" height={600/7} fill={i%2===0 ? '#7ed957' : '#4caf50'} />
                ))
              }
              {/* Ana saha dikdörtgeni */}
              <rect x="20" y="10" width="380" height="580" fill="none" stroke="#fff" strokeWidth="4" />
              {/* Ceza sahası */}
              <rect x="70" y="10" width="280" height="160" fill="none" stroke="#fff" strokeWidth="3" />
              <rect x="70" y="430" width="280" height="160" fill="none" stroke="#fff" strokeWidth="3" />
              {/* Altıpas */}
              <rect x="150" y="10" width="120" height="60" fill="none" stroke="#fff" strokeWidth="2" />
              <rect x="150" y="530" width="120" height="60" fill="none" stroke="#fff" strokeWidth="2" />
              {/* Penaltı noktası */}
              <circle cx="210" cy="90" r="4" fill="#fff" />
              <circle cx="210" cy="510" r="4" fill="#fff" />
              {/* Orta çizgi */}
              <line x1="20" y1="300" x2="400" y2="300" stroke="#fff" strokeWidth="3" />
              {/* Orta yuvarlak */}
              <circle cx="210" cy="300" r="60" fill="none" stroke="#fff" strokeWidth="3" />
              <circle cx="210" cy="300" r="4" fill="#fff" />
            </svg>
            {/* Oyuncular */}
            {formation.positions.slice(0, playerCount).map((pos, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${fieldInner.x + (pos.x / 100) * fieldInner.width - playerSize / 2}px`,
                  top: `${fieldInner.y + (pos.y / 100) * fieldInner.height - playerSize / 2}px`
                }}
              >
                <PlayerCircle color={bodyColor} number={idx + 1} />
                {editMode[idx] ? (
                  <input
                    autoFocus
                    type="text"
                    value={names[idx]}
                    onChange={e => {
                      const newNames = [...names];
                      newNames[idx] = e.target.value;
                      setNames(newNames);
                    }}
                    onBlur={() => setEditMode(m => m.map((v, i) => i === idx ? false : v))}
                    onKeyDown={e => {
                      if (e.key === "Enter") setEditMode(m => m.map((v, i) => i === idx ? false : v));
                    }}
                    className={`mt-2 px-3 py-1 rounded-lg font-bold text-base text-center z-20 max-w-[110px] overflow-hidden whitespace-nowrap text-ellipsis shadow-lg outline-none focus:border-pink-500 ${
                      theme === 'default'
                        ? 'bg-black/70 text-white border border-white/10'
                        : theme === 'third'
                          ? 'bg-[#222222] text-[#e5e5e5] border border-[#333333]'
                          : 'bg-white/90 text-gray-800 border border-gray-200'
                    }`}
                    style={{ minWidth: 80 }}
                  />
                ) : (
                  <div
                    className={`mt-2 px-3 py-1 rounded-lg font-bold text-base text-center z-20 max-w-[110px] overflow-hidden whitespace-nowrap text-ellipsis shadow-lg cursor-pointer ${
                      theme === 'default'
                        ? 'bg-black/70 text-white border border-white/10'
                        : theme === 'third'
                          ? 'bg-[#222222] text-[#e5e5e5] border border-[#333333]'
                          : 'bg-white/90 text-gray-800 border border-gray-200'
                    }`}
                    style={{ minWidth: 80 }}
                    title={names[idx]}
                    onClick={() => setEditMode(m => m.map((v, i) => i === idx ? true : v))}
                  >
                    {names[idx]}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg flex items-center gap-2 transition-all"
            onClick={async () => {
              const element = document.getElementById("formation-canvas");
              if (!element) return;
              const canvas = await html2canvas(element);
              const dataUrl = canvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.href = dataUrl;
              link.download = "dizilim.png";
              link.click();
            }}
          >
            DİZİLİMİ İNDİR <FaDownload className="text-2xl" />
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}

// Oyuncu simgesi: sade yuvarlak
function PlayerCircle({ color, number }: { color: string, number: number }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill={color} stroke="#fff" strokeWidth="4" filter="drop-shadow(0 2px 6px #0006)" />
      <text x="24" y="29" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#fff" stroke="#000" strokeWidth="0.5" dominantBaseline="middle">{number}</text>
    </svg>
  );
} 