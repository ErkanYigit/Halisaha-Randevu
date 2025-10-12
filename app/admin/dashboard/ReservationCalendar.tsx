"use client";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaUserCircle } from "react-icons/fa";

function getWeekDays(start: Date) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function ReservationCalendar() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay()); // Pazardan başlat
    return d;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return setError("Giriş yapmalısınız");
    setLoading(true);
    fetch(`/api/field/me/reservations?week=${weekStart.toISOString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setReservations(data);
      })
      .finally(() => setLoading(false));
  }, [weekStart]);

  const hours = Array.from({ length: 24 }, (_, i) => i); // 00:00-23:00
  const days = getWeekDays(weekStart);

  function isReserved(day: Date, hour: number) {
    const r = reservations.find(r => {
      const d = new Date(r.date);
      const start = new Date(r.startTime);
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate() &&
        start.getHours() === hour
      );
    });
    return r ? r.user?.name || "DOLU" : null;
  }

  // Haftanın ay ve yılını bul
  const monthYear = weekStart.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="w-full flex flex-col items-center mt-8 mb-0 pb-0 min-h-0" style={{ flexGrow: 1 }}>
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-full max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">Rezervasyon Takvimi</h3>
          <div className="flex flex-col items-end gap-1">
            <span className="text-white/80 text-sm font-semibold mb-1">{monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setWeekStart(new Date(weekStart.getTime() - 7 * 86400000))}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:scale-105 transition"
              >
                <FaChevronLeft /> Önceki Hafta
              </button>
              <button
                onClick={() => setWeekStart(new Date(weekStart.getTime() + 7 * 86400000))}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow hover:scale-105 transition"
              >
                Sonraki Hafta <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-tl-2xl sticky left-0 z-10">Saat</th>
                {days.map((d, i) => (
                  <th
                    key={i}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 font-semibold"
                  >
                    {d.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric" })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(hour => (
                <tr key={hour}>
                  <td className="bg-white/20 text-white font-bold p-2 sticky left-0 z-10">{hour}:00</td>
                  {days.map((d, i) => {
                    const reservedBy = isReserved(d, hour);
                    return (
                      <td
                        key={i}
                        className={`p-2 text-center transition-all duration-200 ${reservedBy ? "bg-pink-400/80" : "bg-emerald-400/80"} border-b border-white/10 min-w-[80px]`}
                        style={{ borderRadius: i === 0 ? "0 0 0 1rem" : i === days.length - 1 ? "0 0 1rem 0" : undefined }}
                      >
                        {reservedBy ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 text-pink-700 font-semibold shadow">
                            <FaUserCircle className="text-lg" /> {reservedBy}
                          </span>
                        ) : (
                          <span className="text-emerald-900 font-medium">BOŞ</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 