// src/utils/forwardChaining.ts

// Ambang memicu pendalaman course untuk suatu job saat CF sementara melewati batas
export const EXPAND_GATE = 0.3; // jika CF sementara >= 0.30, gali matkul pendukung

// Pemetaan skala Likert (string) -> nilai CF [0..1]
export const SCALE_TO_CF: Record<string, number> = {
  "1": 0.0,
  "2": 0.25,
  "3": 0.5,
  "4": 0.75,
  "5": 1.0,
};

// --- Jobs dan rules ---
// Setiap job punya daftar course beserta bobot (keyakinan pakar) kontribusinya
export const JOB_RULES: Record<string, Record<string, number>> = {
  "Software Engineer": {
    "Software Development": 0.9,
    "Algorithms and Programming": 0.9,
    "Object Oriented Programming": 0.85,
    "Software Testing": 0.7,
    Database: 0.65,
  },
  "Web Developer": {
    "Web Programming": 0.95,
    "Software Development": 0.75,
    Database: 0.7,
    "Information Retrieval": 0.55,
  },
  "Mobile Developer": {
    "Mobile Programming": 0.95,
    "Software Development": 0.75,
    "Object Oriented Programming": 0.7,
  },
  "Data Analyst": {
    "Business Data Analytics": 0.9,
    "Descriptive Statistics": 0.85,
    "Data Visualization and Analysis": 0.85,
    Database: 0.7,
    "Quantitative Methods of Business": 0.7,
  },
  "Data Scientist": {
    "Machine Learning": 0.9,
    "Data Mining": 0.85,
    "Business Data Analytics": 0.75,
    "Descriptive Statistics": 0.8,
    "Inferential Statistics": 0.8,
    "Algorithms and Programming": 0.75,
    "Data Visualization and Analysis": 0.7,
    "Discrete Mathematics": 0.65,
  },
  "Cybersecurity Analyst": {
    "Information System Security": 0.95,
    "Computer Network": 0.8,
    "Information Technology Risk Management": 0.8,
    "Operating System": 0.6,
  },
  "System/Network Administrator": {
    "Computer Network": 0.9,
    "Operating System": 0.85,
    "Information System Security": 0.6,
    "Information Technology Service Management": 0.6,
  },
  "Database Engineer": {
    Database: 0.95,
    "Enterprise Application Development": 0.75,
    "Software Development": 0.6,
    "Information Technology Service Management": 0.65,
    "Operating System": 0.6,
  },
  "Business Analyst (IT)": {
    "Analysis and Design of Information System": 0.9,
    "Business Function and Process": 0.85,
    "Enterprise System": 0.7,
    "Data Visualization and Analysis": 0.6,
  },
  "IT Project Manager": {
    "Information Technology Project Management": 0.95,
    "Leadership and Organizational Management": 0.85,
    "Software Development": 0.6,
    "Information Technology Governance": 0.65,
  },
};

// Jejak kontribusi course pada suatu job
export type CourseContribution = {
  course: string;
  cfUser: number; // nilai preferensi user untuk course [0..1]
  evidence: number; // cfUser * cfExpert
};

// Hasil perankingan job
export type JobResult = {
  job: string;
  cf: number; // CF akhir untuk job
  contributions: CourseContribution[]; // top kontribusi course
};

// --- Fungsi CF ---
// Kombinasi evidence positif: cf_new_total = cf_old + cf_new * (1 - cf_old)
export function cfCombinePos(cfOld: number, cfNew: number): number {
  if (cfOld <= 0) {
    return cfNew;
  }
  return cfOld + cfNew * (1 - cfOld);
}

// Forward chaining: hitung CF tiap job berdasarkan preferensi user
export function forwardChain(userPrefs: Record<string, number>): {
  cfJobs: Record<string, number>;
  traces: Record<string, CourseContribution[]>;
} {
  const cfJobs: Record<string, number> = {};
  const traces: Record<string, CourseContribution[]> = {};

  for (const [job, mapping] of Object.entries(JOB_RULES)) {
    let cfJob = 0.0; // akumulator CF untuk job ini
    const contribs: CourseContribution[] = [];

    for (const [course, cfExpert] of Object.entries(mapping)) {
      const cfUser = userPrefs[course] || 0.0; // 0 jika user belum menilai course
      if (cfUser > 0) {
        const evidence = cfUser * cfExpert; // evidence dari course untuk job
        cfJob = cfCombinePos(cfJob, evidence); // gabungkan secara incremental
        contribs.push({
          course,
          cfUser,
          evidence: Math.round(evidence * 10000) / 10000, // simpan jejak (dibulatkan 4 desimal)
        });
      }
    }

    if (contribs.length > 0) {
      contribs.sort((a, b) => b.evidence - a.evidence); // urutkan kontribusi terbesar dulu
      cfJobs[job] = Math.round(cfJob * 10000) / 10000; // CF akhir untuk job (4 desimal)
      traces[job] = contribs; // simpan jejak kontribusi
    }
  }

  return { cfJobs, traces };
}

// --- Adaptive Interview ---
// Hitung bobot agregat tiap course (penjumlahan bobot di semua job)
export function courseWeight(): Record<string, number> {
  const w: Record<string, number> = {};
  for (const mapping of Object.values(JOB_RULES)) {
    for (const [c, cfExp] of Object.entries(mapping)) {
      w[c] = (w[c] || 0.0) + cfExp;
    }
  }
  return w;
}

// Ambil daftar course seed (topK) berdasarkan bobot agregat
export function buildSeedCourses(topK = 8): string[] {
  const w = courseWeight();
  const ranked = Object.entries(w).sort((a, b) => b[1] - a[1]); // tinggi -> rendah
  return ranked.slice(0, topK).map(([c]) => c);
}

// Tentukan pertanyaan course berikutnya berdasarkan CF sementara & gate
export function getNextCourses(
  userPrefs: Record<string, number>,
  asked: Set<string>
): string[] {
  const frontier: Array<{ priority: number; course: string }> = [];

  // Jika belum ada yang ditanya, mulai dari seed
  if (asked.size === 0) {
    const seeds = buildSeedCourses();
    return seeds.filter((c) => !asked.has(c));
  }

  // Hitung CF job sementara dari preferensi saat ini
  const { cfJobs } = forwardChain(userPrefs);

  // Jika CF job melewati gate, dorong course pendukung job tsb ke frontier
  for (const [job, cf] of Object.entries(cfJobs)) {
    if (cf >= EXPAND_GATE) {
      for (const [course, cfExp] of Object.entries(JOB_RULES[job])) {
        if (!asked.has(course)) {
          frontier.push({ priority: cfExp, course });
        }
      }
    }
  }

  // Urutkan berdasarkan prioritas (bobot pakar), lalu unikkan
  frontier.sort((a, b) => b.priority - a.priority);
  const uniqueCourses = Array.from(new Set(frontier.map((f) => f.course)));

  return uniqueCourses; // bisa kosong jika belum ada job melewati gate
}

// Urutkan hasil akhir job berdasarkan CF dan ambil top kontribusi untuk display
export function getRankedResults(
  userPrefs: Record<string, number>
): JobResult[] {
  const { cfJobs, traces } = forwardChain(userPrefs);

  const ranked = Object.entries(cfJobs)
    .map(([job, cf]) => ({
      job,
      cf,
      contributions: traces[job].slice(0, 4), // Top 4 contributions
    }))
    .sort((a, b) => b.cf - a.cf); // CF tertinggi di atas

  return ranked;
}
