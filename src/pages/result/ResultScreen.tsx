// src/pages/Result.tsx
import { Link, useLocation } from "react-router-dom";

type Rec = { title: string; percent: number };

function Progress({ value }: { value: number }) {
  return (
    <div className="w-full">
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-indigo-600 rounded-full transition-all"
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-700">
        {value}% cocok
      </div>
    </div>
  );
}

export default function ResultScreen() {
  const location = useLocation() as { state?: { score?: number } };
  const score = location.state?.score ?? 3; // default

  // Simple demo mapping: tweak base percentages by selected score
  const base: Rec[] = [
    { title: "Data Analyst", percent: 78 },
    { title: "Business Analyst", percent: 72 },
    { title: "System Developer", percent: 65 },
  ];

  const adjusted = base.map((r, i) => ({
    ...r,
    percent: Math.min(
      95,
      Math.max(40, r.percent + (score - 3) * (i === 0 ? 6 : i === 1 ? 4 : 3))
    ),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-xl rounded-3xl overflow-hidden">
          <div className="px-8 md:px-10 py-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-800">
                Hasil Rekomendasi
              </h2>
            </div>

            <p className="mt-2 text-slate-600">
              Berikut 3 rekomendasi karir berdasarkan jawaban Anda.
            </p>

            <div className="mt-6 grid gap-4">
              {adjusted.map((rec, idx) => (
                <div
                  key={rec.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-slate-500">
                        Rekomendasi {idx + 1}
                      </div>
                      <div className="text-xl font-bold text-slate-900">
                        {rec.title}
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-indigo-700">
                      {rec.percent}%
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={rec.percent} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold bg-white text-slate-700 border border-slate-200 hover:shadow"
              >
                ← Kembali ke Beranda
              </Link>
              <Link
                to="/question"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold bg-indigo-600 text-white shadow-lg hover:shadow-indigo-200 active:scale-95"
              >
                Coba Lagi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
