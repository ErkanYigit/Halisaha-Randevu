# HaliSaha Randevu Sistemi

Modern ve kullanıcı dostu bir halı saha rezervasyon platformu. Halı saha sahipleri ve futbol severler için geliştirilmiş kapsamlı bir web uygulaması.

## Özellikler

- 🏟️ Halı Saha Listesi ve Detaylı Arama
- 📅 Rezervasyon Sistemi
- 🌍 En Yakın Halı Saha Bulma
- 👥 Takım Oluşturma
- 🏆 Turnuva Sistemi
- 🌓 Çoklu Tema Desteği (Aydınlık, Default, Night Mode)
- 📱 Responsive Tasarım
- 🔐 Kullanıcı Kimlik Doğrulama
- 💳 Ödeme Sistemi Entegrasyonu
- 📍 Google Maps Entegrasyonu

## Teknolojiler

- Next.js 14
- React
- TypeScript
- Prisma ORM
- MySQL
- NextAuth.js
- Tailwind CSS
- Framer Motion
- Google Maps API
- Leaflet Maps

## Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/KULLANICI_ADINIZ/HaliSaha-Randevu.git
cd HaliSaha-Randevu
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun:
```env
DATABASE_URL="mysql://kullanici:sifre@localhost:3306/hali_saha_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

4. Veritabanı migration'larını çalıştırın:
```bash
npx prisma migrate deploy
```

5. Veritabanı seed işlemini gerçekleştirin:
```bash
npx prisma db seed
```

6. Uygulamayı başlatın:
```bash
npm run dev
```

## Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## İletişim

Proje Sahibi - [@GITHUB_KULLANICI_ADINIZ](https://github.com/KULLANICI_ADINIZ)

Proje Linki: [https://github.com/KULLANICI_ADINIZ/HaliSaha-Randevu](https://github.com/KULLANICI_ADINIZ/HaliSaha-Randevu)