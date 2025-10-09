// src/pages/Home.tsx
import { Link } from "react-router-dom";

const contributors = [
  { name: "Muhammad Yusuf Rahman", id: "187221024" },
  { name: "Bernhard Betlest Surenggono", id: "187221025" },
  { name: "Ali Ahmad Fahrezy", id: "187221042" },
  { name: "Naufaldo Rafi Brahmana", id: "187221054" },
  { name: "Hansen Dafa", id: "187221088" },
];

export default function HomeScreen() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      {/* soft radial accents */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000_40%,transparent_100%)]">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 size-[600px] rounded-full bg-rose-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl p-6 md:p-10">
        <div className="rounded-3xl border border-slate-100/80 bg-white/80 shadow-2xl backdrop-blur-xl">
          <div className="px-8 py-10 md:px-12 md:py-14">
            <div className="text-center space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-600 shadow-sm">
                <span className="inline-block size-1.5 rounded-full bg-indigo-500" />
                Sistem Berbasis Pengetahuan
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-900">
                Sistem Rekomendasi Karir
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-600 bg-clip-text text-transparent">
                  Jurusan Sistem Informasi
                </span>
                <br />
                <span className="text-slate-700/80 text-xl md:text-2xl font-semibold">
                  Universitas Airlangga
                </span>
              </h1>

              <p className="text-slate-600 max-w-2xl mx-auto">Dibuat oleh:</p>

              {/* Contributors list */}
              <ul
                aria-label="Daftar kontributor"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left"
              >
                {contributors.map((c) => (
                  <li
                    key={c.id}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100">
                      <span className="text-sm font-bold text-indigo-700">
                        {c.name
                          .split(" ")
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-500">NIM {c.id}</p>
                    </div>
                    <span className="ml-auto hidden text-xs text-slate-400 group-hover:text-indigo-600 sm:inline">
                      •
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link
                  to="/question"
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition active:scale-95 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  aria-label="Mulai mengisi pertanyaan"
                >
                  Mulai
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
                </Link>
              </div>
            </div>
          </div>

          {/* subtle footer strip */}
          <div className="h-2 rounded-b-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-500" />
        </div>
      </div>
    </div>
  );
}
