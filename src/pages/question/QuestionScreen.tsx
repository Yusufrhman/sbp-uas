import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useInterview } from "../../lib/expert-system/useInterview";
import { SCALE_TO_CF } from "../../lib/expert-system/rules";
import type { CourseName, JobName } from "../../lib/expert-system/type";

export default function QuestionScreen() {
  const { currentCourse, answer, cfJobs, traces, isDone, reset } =
    useInterview(8);
  const [value, setValue] = useState<number | null>(null);

  const choices = [
    { v: 1, label: "Sangat tidak suka" },
    { v: 2, label: "Tidak suka" },
    { v: 3, label: "Biasa saja" },
    { v: 4, label: "Suka" },
    { v: 5, label: "Sangat suka" },
  ];

  const handleNext = () => {
    if (value === null || !currentCourse) return;
    const cf = SCALE_TO_CF[String(value)];
    answer(currentCourse as CourseName, cf);
    setValue(null);
  };

  const ranked = useMemo(
    () => Object.entries(cfJobs).sort((a, b) => b[1] - a[1]),
    [cfJobs]
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      {/* soft radial accents (consistent with Home) */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000_40%,transparent_100%)]">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 size-[600px] rounded-full bg-rose-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl p-6 md:p-10">
        <div className="rounded-3xl border border-slate-100/80 bg-white/80 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="px-8 py-8 md:px-12 md:py-10">
            {/* top bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-600 shadow-sm">
                <span className="inline-block size-1.5 rounded-full bg-indigo-500" />
                Sistem Berbasis Pengetahuan
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                aria-label="Kembali ke beranda"
              >
                {/* back icon */}
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

            {/* content */}
            {!isDone ? (
              <>
                <div className="mt-6">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    Pertanyaan
                  </h2>
                  <p className="mt-2 text-slate-600">
                    {currentCourse
                      ? `Seberapa suka Anda dengan/terhadap mata kuliah “${currentCourse}”?`
                      : "Memuat pertanyaan..."}
                  </p>
                </div>

                {/* scale hint */}
                <div className="mt-4 text-sm text-slate-500">
                  Skala 1–5 mewakili “sangat tidak suka” hingga “sangat suka”.
                </div>

                {/* choices */}
                <div
                  role="radiogroup"
                  aria-label="Pilihan tingkat kesukaan"
                  className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-3"
                >
                  {choices.map((c) => {
                    const active = value === c.v;
                    return (
                      <button
                        key={c.v}
                        type="button"
                        onClick={() => setValue(c.v)}
                        role="radio"
                        aria-checked={active}
                        className={[
                          "group w-full rounded-2xl border px-4 py-4 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                          active
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                            : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:shadow",
                        ].join(" ")}
                      >
                        <div className="text-3xl font-extrabold leading-none">
                          {c.v}
                        </div>
                        <div
                          className={[
                            "mt-1 text-sm",
                            active ? "opacity-100" : "opacity-90",
                          ].join(" ")}
                        >
                          {c.label}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* actions */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-xs md:text-sm text-slate-500">
                    Pilih salah satu untuk melanjutkan.
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={value === null || !currentCourse}
                    className={[
                      "inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                      value === null || !currentCourse
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 cursor-pointer",
                    ].join(" ")}
                    aria-disabled={value === null || !currentCourse}
                  >
                    Lanjut
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 12a.75.75 0 0 1 .75-.75h11.69l-3.72-3.72a.75.75 0 1 1 1.06-1.06l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06l3.72-3.72H5.25A.75.75 0 0 1 4.5 12Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-6">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    Rekomendasi Akhir
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Berdasarkan jawaban Anda, berikut peringkat pekerjaan (CF
                    lebih tinggi berarti kecocokan lebih kuat).
                  </p>
                </div>

                {/* results */}
                <div className="mt-6 grid gap-3">
                  {ranked.length === 0 ? (
                    <div className="text-slate-600">Tidak cukup data.</div>
                  ) : (
                    ranked.map(([job, cf]) => {
                      const safe = Number.isFinite(cf) ? (cf as number) : 0;
                      const pct = safe > 1 ? 1 : safe < 0 ? 0 : safe; // clamp to [0,1] for the bar
                      return (
                        <div
                          key={job}
                          className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold text-slate-800 truncate">
                              {job}
                            </div>
                            <div className="text-sm tabular-nums text-slate-600 shrink-0">
                              CF={safe.toFixed(3)}
                            </div>
                          </div>

                          {/* rank meter */}
                          <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-500"
                              style={{ width: `${pct * 100}%` }}
                              aria-hidden="true"
                            />
                          </div>

                          {/* top contributing courses */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {traces[job as JobName]?.slice(0, 6).map((t) => (
                              <span
                                key={t.course}
                                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
                                title={`${t.course} • user=${t.cfUser} → evidence=${t.evidence}`}
                              >
                                <span className="inline-block size-1.5 rounded-full bg-indigo-500" />
                                {t.course}
                                <span className="opacity-60">
                                  (u={t.cfUser}, e={t.evidence})
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-8">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold text-white bg-indigo-600 shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    Mulai Ulang
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M12 5.25a6.75 6.75 0 1 0 6.364 4.5H18a.75.75 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0V9.81A8.25 8.25 0 1 1 12 3.75a.75.75 0 0 1 0 1.5Z" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* subtle footer strip (match Home) */}
          <div className="h-2 rounded-b-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-500" />
        </div>
      </div>
    </div>
  );
}
