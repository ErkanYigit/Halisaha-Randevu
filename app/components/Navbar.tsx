'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaBell } from 'react-icons/fa';
import { BsSun, BsMoon } from 'react-icons/bs';
import { useSession } from 'next-auth/react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { theme, setTheme, toggleTheme } = useTheme();
  const [hasNotifications, setHasNotifications] = useState(false); // Bildirim durumu için state

  return (
    <nav className={`sticky top-0 z-50 shadow-xl backdrop-blur-md border-b transition-all duration-300
      ${theme === 'default' 
        ? 'bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] border-[#23234b]/60'
        : theme === 'third'
          ? 'bg-gradient-to-r from-black via-[#111111] to-[#222222] border-[#333333]'
          : 'bg-gradient-to-r from-white via-gray-50 to-gray-100 border-gray-200'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold text-cyan-400 drop-shadow-glow tracking-wider select-none">
            HalıSaha
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-8">
              <Link href="/fields" className={`transition-colors font-medium hover:drop-shadow-glow ${
                theme === 'default' 
                  ? 'text-gray-200 hover:text-cyan-400'
                  : theme === 'third'
                    ? 'text-gray-300 hover:text-gray-100'
                    : 'text-gray-700 hover:text-blue-600'
              }`}>
                Halı Sahalar
              </Link>
            <Link href="/appointments" className={`transition-colors font-medium hover:drop-shadow-glow ${
                theme === 'default' 
                  ? 'text-gray-200 hover:text-cyan-400'
                  : theme === 'third'
                    ? 'text-gray-300 hover:text-gray-100'
                    : 'text-gray-700 hover:text-blue-600'
              }`}>
              Randevularım
            </Link>
            <Link href="/profile" className={`transition-colors font-medium hover:drop-shadow-glow ${
                theme === 'default' 
                  ? 'text-gray-200 hover:text-cyan-400'
                  : theme === 'third'
                    ? 'text-gray-300 hover:text-gray-100'
                    : 'text-gray-700 hover:text-blue-600'
              }`}>
              {session?.user?.name ? `Hesabım (${session.user.name})` : session?.user?.email ? `Hesabım (${session.user.email})` : 'Hesabım'}
            </Link>
            <Link href="/kadro-kur" className={`transition-colors font-semibold hover:drop-shadow-glow ${
                theme === 'default' 
                  ? 'text-cyan-400 hover:text-pink-400'
                  : theme === 'third'
                    ? 'text-gray-100 hover:text-gray-300'
                    : 'text-blue-600 hover:text-pink-500'
              }`}>
              Kadro Kur
            </Link>
            <Link href="/en-yakin" className={`font-bold transition-colors ${
                theme === 'default' 
                  ? 'hover:text-pink-400'
                  : theme === 'third'
                    ? 'text-gray-300 hover:text-gray-100'
                    : 'text-gray-700 hover:text-pink-500'
              }`}>Bana Yakın Halı Saha</Link>
            <Link href="/tournaments" className={`font-bold transition-colors ${
                theme === 'default' 
                  ? 'text-pink-400 hover:text-pink-600'
                  : theme === 'third'
                    ? 'text-gray-100 hover:text-gray-300'
                    : 'text-pink-500 hover:text-pink-700'
              }`}>Turnuvalar</Link>
            </div>

            {/* Tema ve Bildirim Butonları */}
            <div className="flex items-center space-x-4 ml-8">
              {/* Bildirim Butonu */}
              <button
                className={`relative p-2 transition-colors ${
                  theme === 'default'
                    ? 'text-gray-200 hover:text-cyan-400'
                    : theme === 'third'
                      ? 'text-gray-300 hover:text-gray-100'
                      : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setHasNotifications(false)}
              >
                <FaBell className="w-5 h-5" />
                {hasNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* Tema Değiştirme Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    theme === 'default'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : theme === 'third'
                        ? 'bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)]'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {theme === 'light' && <BsSun className="text-lg" />}
                  {theme === 'default' && <BsMoon className="text-lg" />}
                  {theme === 'third' && <BsMoon className="text-lg" />}
                  <span className="text-sm font-medium">
                    {theme === 'light' ? 'Aydınlık' : theme === 'default' ? 'Karanlık' : 'Night Mode'}
                  </span>
                </button>

                {/* Dropdown Menü */}
                {isThemeMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg overflow-hidden ${
                    theme === 'default'
                      ? 'bg-[#1a1a2e] border border-[#23234b]'
                      : theme === 'third'
                        ? 'bg-[var(--card-bg)] border border-[var(--card-border)]'
                        : 'bg-white border border-gray-200'
                  }`}>
                    <button
                      onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${
                        theme === 'light'
                          ? 'bg-blue-50 text-blue-600'
                          : theme === 'third'
                            ? 'text-gray-300 hover:bg-[#222222]'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <BsSun /> Aydınlık
                    </button>
                    <button
                      onClick={() => { setTheme('default'); setIsThemeMenuOpen(false); }}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${
                        theme === 'default'
                          ? 'bg-blue-50 text-blue-600'
                          : theme === 'third'
                            ? 'text-gray-300 hover:bg-[#222222]'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <BsMoon /> Default
                    </button>
                    <button
                      onClick={() => { setTheme('third'); setIsThemeMenuOpen(false); }}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${
                        theme === 'third'
                          ? 'bg-[#222222] text-gray-100'
                          : theme === 'default'
                            ? 'text-white hover:bg-[#23234b]'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <BsMoon /> Night Mode
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-cyan-300 hover:text-pink-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden shadow-xl rounded-lg mt-2 py-2 transition-all duration-300
            ${theme === 'default'
              ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border border-[#23234b]/60'
              : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200'
            }`}>
            <Link
              href="/fields"
              className={`block px-4 py-2 transition-colors font-medium hover:drop-shadow-glow
                ${theme === 'default'
                  ? 'text-gray-200 hover:bg-[#23234b]/60 hover:text-cyan-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Halı Sahalar
            </Link>
            <Link
              href="/appointments"
              className={`block px-4 py-2 transition-colors font-medium hover:drop-shadow-glow
                ${theme === 'default'
                  ? 'text-gray-200 hover:bg-[#23234b]/60 hover:text-cyan-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Randevularım
            </Link>
            <Link
              href="/profile"
              className={`block px-4 py-2 transition-colors font-medium hover:drop-shadow-glow
                ${theme === 'default'
                  ? 'text-gray-200 hover:bg-[#23234b]/60 hover:text-cyan-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {session?.user?.name ? `Hesabım (${session.user.name})` : session?.user?.email ? `Hesabım (${session.user.email})` : 'Hesabım'}
            </Link>
            <Link
              href="/kadro-kur"
              className={`block px-4 py-2 transition-colors font-semibold hover:drop-shadow-glow
                ${theme === 'default'
                  ? 'text-cyan-400 hover:bg-[#23234b]/60 hover:text-pink-400'
                  : 'text-blue-600 hover:bg-gray-100 hover:text-pink-500'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Kadro Kur
            </Link>
            <Link href="/en-yakin" className={`block px-4 py-2 font-bold ${theme === 'default' ? 'text-pink-400 hover:bg-[#23234b]/60' : 'text-pink-500 hover:bg-gray-100'}`} onClick={() => setIsMenuOpen(false)}>
              Bana Yakın Halı Saha
            </Link>
            <Link href="/tournaments" className={`block px-4 py-2 font-bold ${theme === 'default' ? 'text-pink-400 hover:bg-[#23234b]/60' : 'text-pink-500 hover:bg-gray-100'}`} onClick={() => setIsMenuOpen(false)}>
              Turnuvalar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 