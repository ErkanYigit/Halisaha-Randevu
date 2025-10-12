"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("admin_token", data.token);
      router.push("/admin/dashboard");
    } else {
      setError(data.error || "Giriş başarısız");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col md:flex-row items-stretch justify-stretch p-0">
      <div className="hidden md:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <span className="text-6xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg select-none">SANTRA</span>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-2">
                Admin Girişi
              </h1>
              <p className="text-white/80">
                Yönetici hesabınızla giriş yapın
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="E-posta"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                    required
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Şifre"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                    required
                  />
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-white/80">
                  <input type="checkbox" className="mr-2" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  Beni hatırla
                </label>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Giriş Yap
              </motion.button>
              {error && <div className="text-red-400 text-center font-semibold mt-2">{error}</div>}
            </form>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.push('/auth/login')}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg hover:from-pink-700 hover:to-purple-800 transition-all"
            >
              <FaUser className="text-lg" /> Kullanıcı Girişi
            </motion.button>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 