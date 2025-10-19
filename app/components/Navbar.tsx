'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaBell, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { BsSun, BsMoon } from 'react-icons/bs';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { theme, setTheme, toggleTheme } = useTheme();
  const [hasNotifications, setHasNotifications] = useState(false); // Bildirim durumu için state
  const [notificationCount, setNotificationCount] = useState(0);
  const [userBalance, setUserBalance] = useState(0); // Kullanıcı bakiyesi

  useEffect(() => {
    if (session?.user) {
      fetchNotificationCount();
      fetchUserBalance();
    }
  }, [session]);

  // Dropdown menülerin dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      
      if (data.success) {
        const unreadCount = data.notifications.filter((n: any) => !n.isRead).length;
        setNotificationCount(unreadCount);
        setHasNotifications(unreadCount > 0);
      }
    } catch (error) {
      console.error('Bildirim sayısı yüklenirken hata:', error);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      
      if (data && data.balance !== undefined) {
        setUserBalance(data.balance);
      }
    } catch (error) {
      console.error('Bakiye yüklenirken hata:', error);
    }
  };

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
            <Link href="/kadro-kur" className={`transition-colors font-semibold hover:drop-shadow-glow ${
                theme === 'default' 
                  ? 'text-cyan-400 hover:text-pink-400'
                  : theme === 'third'
                    ? 'text-gray-100 hover:text-gray-300'
                    : 'text-blue-600 hover:text-pink-500'
              }`}>
              Kadro Kur
            </Link>
            <Link href="/rakip-bul" className={`transition-colors font-semibold hover:drop-shadow-glow ${
                theme === 'default' 
                  ? 'text-green-400 hover:text-green-300'
                  : theme === 'third'
                    ? 'text-gray-100 hover:text-gray-300'
                    : 'text-green-600 hover:text-green-500'
              }`}>
              Rakip Bul
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

            {/* Tema, Bildirim ve Profil Butonları */}
            <div className="flex items-center space-x-4 ml-8">
              {/* Bildirim Butonu */}
              <Link href="/notifications">
                <button
                  className={`relative p-2 transition-colors ${
                    theme === 'default'
                      ? 'text-gray-200 hover:text-cyan-400'
                      : theme === 'third'
                        ? 'text-gray-300 hover:text-gray-100'
                        : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <FaBell className="w-5 h-5" />
                  {hasNotifications && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </Link>


              {/* Profil Kartı */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    theme === 'default'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : theme === 'third'
                        ? 'bg-[#222222] text-gray-300 hover:bg-[#333333] border border-[#333333]'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    theme === 'default'
                      ? 'bg-cyan-400/20 text-cyan-400'
                      : theme === 'third'
                        ? 'bg-gray-600 text-gray-300'
                        : 'bg-blue-100 text-blue-600'
                  }`}>
                    <FaUser className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-medium ${
                      theme === 'default' ? 'text-white' : theme === 'third' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {session?.user?.name || 'Kullanıcı'}
                    </div>
                    <div className={`text-xs ${
                      theme === 'default' ? 'text-gray-300' : theme === 'third' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {Number(userBalance || 0).toFixed(2)} ₺
                    </div>
                  </div>
                </button>

                {/* Profil Dropdown Menü */}
                {isProfileMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl overflow-hidden z-50 ${
                    theme === 'default'
                      ? 'bg-[#1a1a2e] border border-[#23234b]'
                      : theme === 'third'
                        ? 'bg-[#111111] border border-[#333333]'
                        : 'bg-white border border-gray-200'
                  }`}>
                    {/* Profil Bilgileri */}
                    <div className={`px-4 py-3 border-b ${
                      theme === 'default' ? 'border-[#23234b]' : theme === 'third' ? 'border-[#333333]' : 'border-gray-200'
                    }`}>
                      <div className={`text-sm font-medium ${
                        theme === 'default' ? 'text-white' : theme === 'third' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {session?.user?.name || 'Kullanıcı'}
                      </div>
                      <div className={`text-xs ${
                        theme === 'default' ? 'text-gray-300' : theme === 'third' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {session?.user?.email}
                      </div>
                    </div>

                    {/* Menü Öğeleri */}
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        theme === 'default'
                          ? 'text-gray-200 hover:bg-[#23234b]'
                          : theme === 'third'
                            ? 'text-gray-300 hover:bg-[#222222]'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaUser className="w-4 h-4" />
                      Profil Bilgileri
                    </Link>

                    {/* Bakiye Yükle Kartı */}
                    <Link
                      href="/profile?topup=true"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        theme === 'default'
                          ? 'text-green-400 hover:bg-[#23234b] bg-green-500/10'
                          : theme === 'third'
                            ? 'text-green-400 hover:bg-[#222222] bg-green-500/10'
                            : 'text-green-600 hover:bg-gray-100 bg-green-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                      Bakiye Yükle
                    </Link>
                    
                    <Link
                      href="/profile/settings"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        theme === 'default'
                          ? 'text-gray-200 hover:bg-[#23234b]'
                          : theme === 'third'
                            ? 'text-gray-300 hover:bg-[#222222]'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaCog className="w-4 h-4" />
                      Ayarlar
                    </Link>

                    {/* Tema Seçimi */}
                    <div className={`border-t ${
                      theme === 'default' ? 'border-[#23234b]' : theme === 'third' ? 'border-[#333333]' : 'border-gray-200'
                    }`}>
                      <div className={`px-4 py-2 text-xs font-medium ${
                        theme === 'default' ? 'text-gray-400' : theme === 'third' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        Tema Seçimi
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 px-4 py-3">
                        {/* Aydınlık Tema */}
                        <button
                          onClick={() => setTheme('light')}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                            theme === 'light'
                              ? 'bg-blue-500 text-white shadow-lg'
                              : theme === 'default'
                                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                                : theme === 'third'
                                  ? 'bg-gray-600/30 text-gray-400 hover:bg-gray-600/50'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title="Aydınlık Tema"
                        >
                          <BsSun className="w-5 h-5" />
                        </button>

                        {/* Karanlık Tema */}
                        <button
                          onClick={() => setTheme('default')}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                            theme === 'default'
                              ? 'bg-cyan-500 text-white shadow-lg'
                              : theme === 'third'
                                ? 'bg-gray-600/30 text-gray-400 hover:bg-gray-600/50'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title="Karanlık Tema"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>

                        {/* Night Mode */}
                        <button
                          onClick={() => setTheme('third')}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                            theme === 'third'
                              ? 'bg-purple-500 text-white shadow-lg'
                              : theme === 'default'
                                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title="Night Mode"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        signOut();
                        setIsProfileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors w-full text-left ${
                        theme === 'default'
                          ? 'text-red-400 hover:bg-[#23234b]'
                          : theme === 'third'
                            ? 'text-red-400 hover:bg-[#222222]'
                            : 'text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      Çıkış Yap
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
              <div className="flex items-center gap-2">
                <FaUser className="w-4 h-4" />
                {session?.user?.name ? `Profil (${session.user.name})` : session?.user?.email ? `Profil (${session.user.email})` : 'Profil'}
              </div>
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
            <Link
              href="/rakip-bul"
              className={`block px-4 py-2 transition-colors font-semibold hover:drop-shadow-glow
                ${theme === 'default'
                  ? 'text-green-400 hover:bg-[#23234b]/60 hover:text-green-300'
                  : 'text-green-600 hover:bg-gray-100 hover:text-green-500'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Rakip Bul
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