'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGoogle, FaFacebook } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    // Şifreler eşleşiyor mu kontrolü
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Şifreler uyuşmuyor!");
      return;
    }
    const ruleError = validatePassword(formData.password);
    if (ruleError) {
      setPasswordError(ruleError);
      return;
    }
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });
      const data = await response.json();
      console.log("API cevabı:", data);
      if (data.success) {
        router.push('/'); // Ana sayfaya yönlendir
      } else {
        setPasswordError('Kayıt başarısız: ' + data.error);
      }
    } catch (err: any) {
      setPasswordError('Bir hata oluştu: ' + err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Şifre kuralları kontrolü
  function validatePassword(pw: string) {
    if (pw.length < 8) return "Şifre en az 8 karakter olmalı.";
    if (!/[A-Z]/.test(pw)) return "Şifre en az bir büyük harf içermeli.";
    if (!/[a-z]/.test(pw)) return "Şifre en az bir küçük harf içermeli.";
    if (!/[0-9]/.test(pw)) return "Şifre en az bir rakam içermeli.";
    return "";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-2">
              Kayıt Ol
            </h1>
            <p className="text-white/80">
              Hemen ücretsiz hesap oluşturun ve futbola başlayın
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ad Soyad"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  required
                />
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefon"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  required
                />
                <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Şifre"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  required
                />
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Şifre Tekrar"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  required
                />
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
              </div>
            </div>

            {passwordError && <div className="text-red-400 text-sm">{passwordError}</div>}

            <div className="flex items-center text-sm">
              <label className="flex items-center text-white/80">
                <input type="checkbox" className="mr-2" required />
                <span>
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                    Kullanım şartlarını
                  </Link>{' '}
                  ve{' '}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                    gizlilik politikasını
                  </Link>{' '}
                  kabul ediyorum
                </span>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Kayıt Ol
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/10 text-white/60">veya</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="flex items-center justify-center gap-2 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                <FaGoogle />
                Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="flex items-center justify-center gap-2 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                <FaFacebook />
                Facebook
              </motion.button>
            </div>
          </form>

          <p className="mt-8 text-center text-white/60">
            Zaten hesabınız var mı?{' '}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Giriş Yap
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
} 
