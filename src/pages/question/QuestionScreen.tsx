// src/pages/Question.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses, SCALE_TO_CF } from "../../lib/forwardChaining";

export default function QuestionScreen() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [value, setValue] = useState<number | null>(null);
  const [userPrefs, setUserPrefs] = useState<Record<string, number>>({});

  // Load all ordered courses on mount
  useEffect(() => {
    const allCourses = getAllCourses();
    setCourses(allCourses);
  }, []);

  const handleNext = () => {
    if (value === null) return;

    const currentCourse = courses[currentIndex];
    const cfUser = SCALE_TO_CF[value.toString()];

    // Save user answer
    const newPrefs = { ...userPrefs, [currentCourse]: cfUser };
    setUserPrefs(newPrefs);
    setValue(null);

    // If this was the last question → go to result
    if (currentIndex >= courses.length - 1) {
      navigate("/result", { state: { userPrefs: newPrefs } });
      return;
    }

    // Otherwise move to next question
    setCurrentIndex((prev) => prev + 1);
  };

  if (courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-slate-600">Memuat pertanyaan...</div>
        </div>
      </div>
    );
  }

  const currentCourse = courses[currentIndex];
  const questionNumber = currentIndex + 1;

  const choices = [
    { v: 1, label: "Sangat tidak suka" },
    { v: 2, label: "Tidak suka" },
    { v: 3, label: "Biasa saja" },
    { v: 4, label: "Suka" },
    { v: 5, label: "Sangat suka" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      {/* background blur accents */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000_40%,transparent_100%)]">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 size-[600px] rounded-full bg-rose-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl p-6 md:p-10">
        <div className="rounded-3xl border border-slate-100/80 bg-white/80 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="px-8 py-8 md:px-12 md:py-10">
            {/* header */}
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-600 shadow-sm">
                <span className="inline-block size-1.5 rounded-full bg-indigo-500" />
                Kuesioner
              </div>
              <div className="text-sm font-medium text-slate-600">
                Pertanyaan {questionNumber} dari {courses.length}
              </div>
            </div>

            {/* question title */}
            <div className="mt-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                {currentCourse}
              </h2>
              <p className="mt-2 text-slate-600">
                Seberapa suka Anda dengan mata kuliah ini?
              </p>
            </div>

            <div className="mt-4 text-sm text-slate-500">
              Skala 1–5 mewakili "sangat tidak suka" hingga "sangat suka".
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
                disabled={value === null}
                className={[
                  "inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                  value === null
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 cursor-pointer",
                ].join(" ")}
                aria-disabled={value === null}
              >
                {currentIndex === courses.length - 1 ? "Selesai" : "Lanjut"}
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
          </div>

          <div className="h-2 rounded-b-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-500" />
        </div>
      </div>
    </div>
  );
}
