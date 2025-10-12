'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  return (
    <footer className={`shadow-inner transition-colors duration-300 ${
      theme === 'default'
        ? 'bg-gradient-to-tr from-blue-900 via-blue-800 to-blue-700 text-white'
        : theme === 'third'
          ? 'bg-gradient-to-tr from-black via-[#111111] to-[#222222] text-[#e5e5e5]'
          : 'bg-gradient-to-tr from-gray-100 via-gray-50 to-white text-gray-800'
    }`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-extrabold mb-4 tracking-tight">HalıSaha</h2>
            <p className={
              theme === 'default' 
                ? 'text-blue-100' 
                : theme === 'third'
                  ? 'text-[#999999]'
                  : 'text-gray-600'
            }>
              En yakın halı sahayı bulun, randevu alın ve maçınızı oynayın. Modern ve kullanıcı dostu platformumuz ile halı saha organizasyonunu kolaylaştırıyoruz.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/fields" className={`transition-colors ${
                  theme === 'default'
                    ? 'text-blue-200 hover:text-white'
                    : theme === 'third'
                      ? 'text-[#999999] hover:text-[#e5e5e5]'
                      : 'text-gray-600 hover:text-blue-600'
                }`}>
                  Halı Sahalar
                </Link>
              </li>
              <li>
                <Link href="/appointments" className={`transition-colors ${
                  theme === 'default'
                    ? 'text-blue-200 hover:text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}>
                  Randevularım
                </Link>
              </li>
              <li>
                <Link href="/profile" className={`transition-colors ${
                  theme === 'default'
                    ? 'text-blue-200 hover:text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}>
                  Hesabım
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li className={
                theme === 'default' 
                  ? 'text-blue-200' 
                  : theme === 'third'
                    ? 'text-[#999999]'
                    : 'text-gray-600'
              }>info@halisaha.com</li>
              <li className={
                theme === 'default' 
                  ? 'text-blue-200' 
                  : theme === 'third'
                    ? 'text-[#999999]'
                    : 'text-gray-600'
              }>+90 555 123 4567</li>
              <li className="flex space-x-4 mt-4">
                <a href="#" className={`transition-colors ${
                  theme === 'default'
                    ? 'text-blue-200 hover:text-white'
                    : theme === 'third'
                      ? 'text-[#999999] hover:text-[#e5e5e5]'
                      : 'text-gray-600 hover:text-blue-600'
                }`}>
                  <FaFacebook size={20} />
                </a>
                <a href="#" className={`transition-colors ${
                  theme === 'default'
                    ? 'text-blue-200 hover:text-white'
                    : theme === 'third'
                      ? 'text-[#999999] hover:text-[#e5e5e5]'
                      : 'text-gray-600 hover:text-blue-600'
                }`}>
                  <FaTwitter size={20} />
                </a>
                <a href="#" className={`transition-colors ${
                  theme === 'default'
                    ? 'text-blue-200 hover:text-white'
                    : theme === 'third'
                      ? 'text-[#999999] hover:text-[#e5e5e5]'
                      : 'text-gray-600 hover:text-blue-600'
                }`}>
                  <FaInstagram size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Alt Bilgi */}
        <div className={`border-t mt-8 pt-8 text-center ${
          theme === 'default' 
            ? 'border-blue-800 text-blue-200' 
            : theme === 'third'
              ? 'border-[#333333] text-[#999999]'
              : 'border-gray-200 text-gray-600'
        }`}>
          <p>&copy; 2024 HalıSaha. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 