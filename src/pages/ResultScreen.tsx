// src/pages/Result.tsx
import { useLocation, Link } from "react-router-dom";
import { getRankedResults } from "../lib/forwardChaining";

export default function ResultScreen() {
  const location = useLocation();
  const userPrefs = location.state?.userPrefs as
    | Record<string, number>
    | undefined;

  if (!userPrefs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-rose-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Data tidak ditemukan
          </h2>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const results = getRankedResults(userPrefs);

  if (results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-rose-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Tidak cukup data untuk memberikan rekomendasi
          </h2>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      {/* soft radial accents */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000_40%,transparent_100%)]">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 size-[600px] rounded-full bg-rose-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl p-6 md:p-10">
        <div className="rounded-3xl border border-slate-100/80 bg-white/80 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="px-8 py-8 md:px-12 md:py-10">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-600 shadow-sm">
                <span className="inline-block size-1.5 rounded-full bg-green-500" />
                Hasil Rekomendasi
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                aria-label="Kembali ke beranda"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.5 12a.75.75 0 0 1-.75.75H7.06l3.72 3.72a.75.75 0 1 1-1.06 1.06l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06L7.06 11.25h11.69c.414 0 .75.336.75.75Z"
                    clipRule="evenodd"
                  />
                </svg>
                Kembali
              </Link>
            </div>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Rekomendasi Pekerjaan IT
              </h1>
              <p className="mt-2 text-slate-600">
                Berdasarkan preferensi Anda terhadap mata kuliah, berikut adalah
                rekomendasi pekerjaan IT yang sesuai.
              </p>
            </div>

            {/* Results List */}
            <div className="space-y-4">
              {results.map((result, index) => {
                const cfPercentage = Math.round(result.cf * 100);
                const isTop = index === 0;

                return (
                  <div
                    key={result.job}
                    className={[
                      "rounded-2xl border p-6 transition-all",
                      isTop
                        ? "bg-indigo-50 border-indigo-200 shadow-lg"
                        : "bg-white border-slate-200 shadow",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {isTop && (
                            <span className="inline-flex items-center justify-center size-8 rounded-full bg-indigo-600 text-white text-sm font-bold">
                              #1
                            </span>
                          )}
                          <h3 className="text-xl font-bold text-slate-900">
                            {result.job}
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-indigo-600">
                          {cfPercentage}%
                        </div>
                        <div className="text-xs text-slate-500">
                          CF: {result.cf.toFixed(4)}
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                        style={{ width: `${cfPercentage}%` }}
                      />
                    </div>

                    {/* Contributions */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">
                        Faktor Pendukung:
                      </h4>
                      <div className="space-y-2">
                        {result.contributions.map((contrib) => (
                          <div
                            key={contrib.course}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-slate-700">
                              • {contrib.course}
                            </span>
                            <span className="text-slate-500">
                              Evidence: {contrib.evidence.toFixed(4)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                Sistem menggunakan metode Forward Chaining dengan Certainty
                Factor
              </p>
              <Link
                to="/question"
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700 active:scale-95 transition"
              >
                Ulangi Kuesioner
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* footer strip */}
          <div className="h-2 rounded-b-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-500" />
        </div>
      </div>
    </div>
  );
}
