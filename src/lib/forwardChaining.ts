// src/utils/forwardChaining.ts

// Pemetaan skala Likert (string) -> nilai CF [0..1]
export const SCALE_TO_CF: Record<string, number> = {
  "1": 0.0,
  "2": 0.25,
  "3": 0.5,
  "4": 0.75,
  "5": 1.0,
};

// --- Jobs dan rules ---
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

// --- Types ---
export type CourseContribution = {
  course: string;
  cfUser: number;
  evidence: number;
};

export type JobResult = {
  job: string;
  cf: number;
  contributions: CourseContribution[];
};

// --- Fungsi CF ---
export function cfCombinePos(cfOld: number, cfNew: number): number {
  if (cfOld <= 0) return cfNew;
  return cfOld + cfNew * (1 - cfOld);
}

// --- Forward chaining utama ---
export function forwardChain(userPrefs: Record<string, number>): {
  cfJobs: Record<string, number>;
  traces: Record<string, CourseContribution[]>;
} {
  const cfJobs: Record<string, number> = {};
  const traces: Record<string, CourseContribution[]> = {};

  for (const [job, mapping] of Object.entries(JOB_RULES)) {
    let cfJob = 0.0;
    const contribs: CourseContribution[] = [];

    for (const [course, cfExpert] of Object.entries(mapping)) {
      const cfUser = userPrefs[course] || 0.0;
      if (cfUser > 0) {
        const evidence = cfUser * cfExpert;
        cfJob = cfCombinePos(cfJob, evidence);
        contribs.push({
          course,
          cfUser,
          evidence: Math.round(evidence * 10000) / 10000,
        });
      }
    }

    if (contribs.length > 0) {
      contribs.sort((a, b) => b.evidence - a.evidence);
      cfJobs[job] = Math.round(cfJob * 10000) / 10000;
      traces[job] = contribs;
    }
  }

  return { cfJobs, traces };
}

// --- NEW: Ordered list of all unique courses by job sequence ---
export function getAllCourses(): string[] {
  const orderedCourses: string[] = [];
  const seen = new Set<string>();

  for (const job of Object.keys(JOB_RULES)) {
    const mapping = JOB_RULES[job];
    for (const course of Object.keys(mapping)) {
      if (!seen.has(course)) {
        orderedCourses.push(course);
        seen.add(course);
      }
    }
  }

  return orderedCourses;
}

// --- Hasil akhir ranking ---
export function getRankedResults(
  userPrefs: Record<string, number>
): JobResult[] {
  const { cfJobs, traces } = forwardChain(userPrefs);
  return Object.entries(cfJobs)
    .map(([job, cf]) => ({
      job,
      cf,
      contributions: traces[job].slice(0, 4),
    }))
    .sort((a, b) => b.cf - a.cf);
}
