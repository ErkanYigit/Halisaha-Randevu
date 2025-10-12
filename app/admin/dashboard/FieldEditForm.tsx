"use client";
import { useEffect, useState } from "react";
import cities from "../../../public/turkey-cities.json";

const FEATURES = [
  { key: 'dus', label: 'Duş' },
  { key: 'otopark', label: 'Otopark' },
  { key: 'acik', label: 'Açık Saha' },
  { key: 'kapali', label: 'Kapalı Saha' },
  { key: 'tuvalet', label: 'Tuvalet' },
  { key: 'krampon', label: 'Krampon Kiralama' },
  { key: 'eldiven', label: 'Eldiven Kiralama' },
  { key: 'cim', label: 'Çim Saha' },
  { key: 'hali', label: 'Halı Saha' },
];

export default function FieldEditForm() {
  const [field, setField] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [features, setFeatures] = useState<string[]>(field?.features || []);
  const [selectedCity, setSelectedCity] = useState(field?.city || "");
  const [selectedDistrict, setSelectedDistrict] = useState(field?.district || "");
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return setError("Giriş yapmalısınız");
    fetch("/api/field/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setField(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const cityObj = (cities as any[]).find(c => c.name === selectedCity);
      setDistricts(cityObj ? cityObj.districts : []);
    } else {
      setDistricts([]);
    }
  }, [selectedCity]);

  const handleChange = (e: any) => {
    setField({ ...field, [e.target.name]: e.target.value });
  };

  const handleFeatureToggle = (key: string) => {
    setFeatures((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("admin_token");
    const res = await fetch("/api/field/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...field, features, city: selectedCity, district: selectedDistrict }),
    });
    const data = await res.json();
    if (res.ok) setSuccess("Başarıyla güncellendi");
    else setError(data.error || "Hata oluştu");
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!field) return <div>Saha verisi bulunamadı</div>;

  return (
    <div className="bg-purple-900/80 rounded-2xl p-8 shadow-xl">
      <h3 className="text-white text-lg font-semibold mb-6">Saha Bilgileri</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            name="name"
            value={field.name || ""}
            onChange={handleChange}
            placeholder="Saha Adı"
            className="p-3 rounded-lg bg-white/90 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            name="address"
            value={field.address || ""}
            onChange={handleChange}
            placeholder="Adres"
            className="p-3 rounded-lg bg-white/90 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <select
            name="city"
            value={selectedCity}
            onChange={e => { setSelectedCity(e.target.value); setSelectedDistrict(""); }}
            className="p-3 rounded-lg bg-white/90 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Şehir Seçin</option>
            {(cities as any[]).map((c, i) => (
              <option key={i} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select
            name="district"
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="p-3 rounded-lg bg-white/90 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={!selectedCity}
          >
            <option value="">İlçe Seçin</option>
            {districts.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>
          <input
            name="phone"
            value={field.phone || ""}
            onChange={handleChange}
            placeholder="Telefon Numarası"
            className="p-3 rounded-lg bg-white/90 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            name="email"
            value={field.email || ""}
            onChange={handleChange}
            placeholder="E-posta Adresi"
            className="p-3 rounded-lg bg-white/90 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            name="price"
            value={field.price || ""}
            onChange={handleChange}
            placeholder="Saatlik Ücret"
            type="number"
            style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", outline: "none" }}
          />
          <input
            name="size"
            value={field.size || ""}
            onChange={handleChange}
            placeholder="Ölçü"
            style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", outline: "none" }}
          />
        </div>
        <div className="mb-6">
          <div className="text-white font-semibold mb-2">Saha Özellikleri</div>
          <div className="flex flex-wrap gap-3">
            {FEATURES.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => handleFeatureToggle(f.key)}
                className={`px-4 py-2 rounded-full border-2 transition-all font-semibold text-sm shadow-md backdrop-blur-md
                  ${features.includes(f.key)
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400 text-white scale-105'
                    : 'bg-white/10 border-white/30 text-white/70 hover:bg-white/20'}
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" style={{ width: "100%", background: "#e11d48", color: "#fff", padding: 12, border: "none", borderRadius: 8, fontWeight: 600, fontSize: 18, marginTop: 8 }}>Kaydet</button>
        {success && <div style={{ color: "#22c55e", marginTop: 12, textAlign: "center" }}>{success}</div>}
        {error && <div style={{ color: "#e11d48", marginTop: 12, textAlign: "center" }}>{error}</div>}
      </form>
    </div>
  );
} 