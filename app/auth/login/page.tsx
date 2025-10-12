'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaUserShield } from 'react-icons/fa';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        return;
      }

      toast.success('Giriş başarılı!');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      toast.error('Sosyal medya girişi başarısız oldu.');
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
                Hoş Geldiniz
              </h1>
              <p className="text-white/80">
                Hesabınıza giriş yapın ve futbola devam edin
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifre"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                    required
                  />
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-white/80">
                  <input type="checkbox" className="mr-2" />
                  Beni hatırla
                </label>
                <Link href="/auth/forgot-password" className="text-purple-400 hover:text-purple-300">
                  Şifremi unuttum
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </motion.button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/10 text-white/60">veya</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center gap-2 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  <FaGoogle />
                  Google
                </motion.button>
              </div>
            </form>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.push('/admin/login')}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg hover:from-pink-700 hover:to-purple-800 transition-all"
            >
              <FaUserShield className="text-lg" /> Admin Login
            </motion.button>

            <p className="mt-8 text-center text-white/60">
              Hesabınız yok mu?{' '}
              <Link href="/auth/register" className="text-purple-400 hover:text-purple-300 font-semibold">
                Kayıt Ol
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 