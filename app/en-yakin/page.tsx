"use client";

import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaStar, FaFutbol, FaLocationArrow, FaSearch, FaMapPin } from "react-icons/fa";
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LeafletMouseEvent, LeafletEvent } from "leaflet";
import L from "leaflet";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  photos?: { photo_reference: string }[];
  geometry: { location: { lat: number; lng: number } };
}

function getPhotoUrl(photoReference: string, maxwidth = 400) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
}

function LocationMarker({ setManualLat, setManualLng }: { setManualLat: (lat: string) => void, setManualLng: (lng: string) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      setManualLat(e.latlng.lat.toString());
      setManualLng(e.latlng.lng.toString());
    },
  });
  return null;
}

export default function EnYakinPage() {
  const { theme } = useTheme();
  const [places, setPlaces] = useState<Place[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);

  // Filtreleme ve sıralama state'leri
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [minRating, setMinRating] = useState(0);
  const [minReviews, setMinReviews] = useState(0);

  // Manuel konum modalı
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [mapPos, setMapPos] = useState<[number, number]>([39.92, 32.85]); // Türkiye merkez default

  useEffect(() => {
    if (userLocation === null) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => setError("Konum alınamadı! Konum izni vermelisiniz."),
          { enableHighAccuracy: true }
        );
      } else {
        setError("Tarayıcınız konum desteği sunmuyor.");
      }
    }
  }, [userLocation]);

  useEffect(() => {
    if (!userLocation) return;
    setLoading(true);
    setError(null);
    setStatus(null);
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.lat},${userLocation.lng}&radius=15000&keyword=halı+saha&key=${GOOGLE_API_KEY}`;
    fetch(`/api/proxy?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        setDebug(data);
        setStatus(data.status);
        if (data.results && Array.isArray(data.results)) {
          setPlaces(data.results);
        } else {
          setError("Google'dan veri alınamadı.");
        }
      })
      .catch(() => setError("Google API hatası!"))
      .finally(() => setLoading(false));
  }, [userLocation]);

  // Filtreleme ve sıralama işlemleri
  const filteredPlaces = places.filter(place => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (place.vicinity && place.vicinity.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRating = !place.rating || place.rating >= minRating;
    const matchesReviews = !place.user_ratings_total || place.user_ratings_total >= minReviews;
    return matchesSearch && matchesRating && matchesReviews;
  });

  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "reviews":
        return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Manuel konum kullan
  const handleManualLocation = () => {
    if (!manualLat || !manualLng) {
      alert("Lütfen haritadan bir nokta seçin veya enlem/boylam girin!");
      return;
    }
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) {
      alert("Geçerli bir enlem ve boylam giriniz!");
      return;
    }
    setUserLocation({ lat, lng });
    setIsModalOpen(false);
  };

  // Haritada tıklama ile konum seç
  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    setManualLat(lat.toString());
    setManualLng(lng.toString());
  };

  // Modal açıldığında haritayı mevcut konuma ortala
  useEffect(() => {
    if (isModalOpen) {
      if (userLocation) setMapPos([userLocation.lat, userLocation.lng]);
      setManualLat("");
      setManualLng("");
    }
  }, [isModalOpen, userLocation]);

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
          className={`backdrop-blur-xl p-8 rounded-3xl mb-12 ${
            theme === 'default'
              ? 'bg-white/10'
              : theme === 'third'
                ? 'bg-[#111111]/80 border border-[#333333]'
                : 'bg-white/80 shadow-lg'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 className={`text-3xl font-bold mb-2 flex items-center gap-2 ${
                theme === 'default' 
                  ? 'text-white' 
                  : theme === 'third'
                    ? 'text-[#e5e5e5]'
                    : 'text-gray-800'
              }`}>
                <FaLocationArrow className="text-pink-400" /> Bana Yakın Halı Sahalar
              </h2>
              <p className={`mb-2 ${
                theme === 'default' 
                  ? 'text-white/70' 
                  : theme === 'third'
                    ? 'text-[#999999]'
                    : 'text-gray-600'
              }`}>Google Haritalar üzerinden konumunuza en yakın halı sahaları listeliyoruz.</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow hover:from-purple-600 hover:to-pink-600 transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              <FaMapPin /> Manuel Konum Gir
            </button>
          </div>
          {status && status !== 'OK' && <div className="text-blue-300 text-sm mb-2">Google API status: {status}</div>}
          {error && <div className="text-red-500 font-bold mt-4">{error}</div>}
          {!error && !userLocation && <div className="text-white/80 mt-4">Konumunuz alınıyor...</div>}

          {/* Filtre ve sıralama arayüzü */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Halı saha veya adres ara..."
                className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 ${
                  theme === 'default'
                    ? 'bg-white/10 border border-white/20 text-white placeholder-white/50'
                    : theme === 'third'
                      ? 'bg-[#222222] border border-[#333333] text-[#e5e5e5] placeholder-[#666666]'
                      : 'bg-white border border-gray-200 text-gray-800 placeholder-gray-400'
                }`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FaSearch className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                theme === 'default' 
                  ? 'text-white/50' 
                  : theme === 'third'
                    ? 'text-[#666666]'
                    : 'text-gray-400'
              }`} />
            </div>
            <select
              className={`rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 ${
                theme === 'default'
                  ? 'bg-white/10 border border-white/20 text-white'
                  : theme === 'third'
                    ? 'bg-[#222222] border border-[#333333] text-[#e5e5e5]'
                    : 'bg-white border border-gray-200 text-gray-800'
              }`}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="default">Sıralama</option>
              <option value="rating">Puan (Yüksekten Düşüğe)</option>
              <option value="reviews">Yorum (Çoktan Aza)</option>
              <option value="name">İsim (A-Z)</option>
            </select>
            <select
              className={`rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 ${
                theme === 'default'
                  ? 'bg-white/10 border border-white/20 text-white'
                  : theme === 'third'
                    ? 'bg-[#222222] border border-[#333333] text-[#e5e5e5]'
                    : 'bg-white border border-gray-200 text-gray-800'
              }`}
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
            >
              <option value={0}>Min. Puan</option>
              <option value={3}>3.0+</option>
              <option value={3.5}>3.5+</option>
              <option value={4}>4.0+</option>
              <option value={4.5}>4.5+</option>
            </select>
            <select
              className={`rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 ${
                theme === 'default'
                  ? 'bg-white/10 border border-white/20 text-white'
                  : theme === 'third'
                    ? 'bg-[#222222] border border-[#333333] text-[#e5e5e5]'
                    : 'bg-white border border-gray-200 text-gray-800'
              }`}
              value={minReviews}
              onChange={e => setMinReviews(Number(e.target.value))}
            >
              <option value={0}>Min. Yorum</option>
              <option value={10}>10+</option>
              <option value={50}>50+</option>
              <option value={100}>100+</option>
              <option value={200}>200+</option>
            </select>
          </div>
        </motion.div>

        {/* Manuel konum modalı */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`rounded-3xl p-8 w-full max-w-md shadow-2xl relative ${
                theme === 'third'
                  ? 'bg-[#111111] border border-[#333333]'
                  : 'bg-white border border-purple-100'
              }`}
              >
                <button
                  className={`absolute top-4 right-4 text-2xl transition-colors ${
                    theme === 'third'
                      ? 'text-[#666666] hover:text-[#999999]'
                      : 'text-gray-400 hover:text-pink-500'
                  }`}
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Kapat"
                >
                  ×
                </button>
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                  theme === 'third'
                    ? 'text-[#e5e5e5]'
                    : 'text-purple-700'
                }`}>
                  <FaMapPin className="text-pink-500" /> Manuel Konum Gir
                </h3>
                <div className="mb-4">
                  <label className={`block font-semibold mb-1 ${
                    theme === 'third'
                      ? 'text-[#999999]'
                      : 'text-gray-700'
                  }`}>Haritadan Seç</label>
                  <div className={`w-full h-56 rounded-xl overflow-hidden mb-4 border ${
                    theme === 'third'
                      ? 'border-[#333333]'
                      : 'border-purple-200'
                  }`}>
                    <MapContainer
                      center={mapPos}
                      zoom={12}
                      style={{ width: "100%", height: "100%" }}
                      whenReady={() => {
                        setTimeout(() => {
                          // Burada harita referansına erişilemiyor, invalidateSize() çağrısı gerekirse useRef ile yapılmalı.
                        }, 200);
                      }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {manualLat && manualLng && (
                        <Marker position={[parseFloat(manualLat), parseFloat(manualLng)]} />
                      )}
                      <LocationMarker setManualLat={setManualLat} setManualLng={setManualLng} />
                    </MapContainer>
                  </div>
                </div>
                <div className="mb-4">
                  <label className={`block font-semibold mb-1 ${
                    theme === 'third'
                      ? 'text-[#999999]'
                      : 'text-gray-700'
                  }`}>Enlem (Latitude)</label>
                  <input
                    type="number"
                    step="any"
                    className={`w-full p-2 rounded outline-none border focus:border-pink-400 ${
                      theme === 'third'
                        ? 'bg-[#222222] border-[#333333] text-[#e5e5e5] placeholder-[#666666]'
                        : 'bg-white border-purple-200 text-gray-800 placeholder-gray-400'
                    }`}
                    value={manualLat}
                    onChange={e => setManualLat(e.target.value)}
                    placeholder="Örn: 40.9923"
                  />
                </div>
                <div className="mb-6">
                  <label className={`block font-semibold mb-1 ${
                    theme === 'third'
                      ? 'text-[#999999]'
                      : 'text-gray-700'
                  }`}>Boylam (Longitude)</label>
                  <input
                    type="number"
                    step="any"
                    className={`w-full p-2 rounded outline-none border focus:border-pink-400 ${
                      theme === 'third'
                        ? 'bg-[#222222] border-[#333333] text-[#e5e5e5] placeholder-[#666666]'
                        : 'bg-white border-purple-200 text-gray-800 placeholder-gray-400'
                    }`}
                    value={manualLng}
                    onChange={e => setManualLng(e.target.value)}
                    placeholder="Örn: 29.0277"
                  />
                </div>
                <button
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow hover:from-purple-600 hover:to-pink-600 transition-all"
                  onClick={handleManualLocation}
                >
                  Bu Konumu Kullan
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {userLocation && !loading && sortedPlaces.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPlaces.map(place => (
              <motion.div
                key={place.place_id}
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
                    {place.photos && place.photos[0] ? (
                      <img src={getPhotoUrl(place.photos[0].photo_reference)} alt={place.name} className="object-cover w-full h-full rounded-3xl opacity-80" />
                    ) : (
                      <FaFutbol className="text-6xl text-white/80" />
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    theme === 'default' 
                      ? 'text-white' 
                      : theme === 'third'
                        ? 'text-[#e5e5e5]'
                        : 'text-gray-800'
                  }`}>{place.name}</h3>
                  <div className={`flex items-center mb-2 ${
                    theme === 'default' 
                      ? 'text-white/80' 
                      : theme === 'third'
                        ? 'text-[#999999]'
                        : 'text-gray-600'
                  }`}>
                    <FaMapMarkerAlt className="mr-2" />
                    {place.vicinity}
                  </div>
                  {place.rating && (
                    <div className="flex items-center text-yellow-400 mb-2">
                      <FaStar className="mr-1" />
                      {place.rating} ({place.user_ratings_total})
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      Haritada Aç
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {userLocation && !loading && sortedPlaces.length === 0 && (
          <div className="text-white/80 text-center mt-8">
            Yakınınızda Google Haritalar'da halı saha bulunamadı.<br />
            {status && status !== 'OK' && <span className="text-blue-300 text-xs">Google API status: {status}</span>}
            {debug && <pre className="text-xs text-gray-300 mt-2 bg-black/30 p-2 rounded max-h-64 overflow-auto">{JSON.stringify(debug, null, 2)}</pre>}
          </div>
        )}
      </div>
    </main>
  );
}