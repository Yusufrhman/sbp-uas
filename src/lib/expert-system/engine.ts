// src/lib/expert-system/engine.ts
import { JOB_RULES } from "./rules";
import type {
  EngineResult,
  TraceRow,
  Traces,
  UserPrefs,
  CourseName,
  JobName,
} from "./type";

export const cfCombinePos = (oldCF: number, newCF: number) =>
  oldCF <= 0 ? newCF : oldCF + newCF * (1 - oldCF);

export function forwardChain(userPrefs: UserPrefs): EngineResult {
  const cfJobs: EngineResult["cfJobs"] = {};
  const traces: Traces = {};

  (
    Object.entries(JOB_RULES) as [
      JobName,
      Partial<Record<CourseName, number>>
    ][]
  ).forEach(([job, mapping]) => {
    let cfJob = 0;
    const contribs: TraceRow[] = [];

    (Object.entries(mapping) as [CourseName, number | undefined][]).forEach(
      ([course, cfExpert]) => {
        if (typeof cfExpert !== "number") return;
        const cfUser = userPrefs[course] ?? 0;
        if (cfUser > 0) {
          const evidence = cfUser * cfExpert;
          cfJob = cfCombinePos(cfJob, evidence);
          contribs.push({ course, cfUser, evidence: round4(evidence) });
        }
      }
    );

    if (contribs.length) {
      contribs.sort((a, b) => b.evidence - a.evidence);
      cfJobs[job] = round4(cfJob);
      traces[job] = contribs;
    }
  });

  return { cfJobs, traces };
}

function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}

export function courseWeight(): Record<CourseName, number> {
  const w: Partial<Record<CourseName, number>> = {};
  Object.values(JOB_RULES).forEach((mapping) => {
    (Object.entries(mapping) as [CourseName, number | undefined][]).forEach(
      ([course, cfExp]) => {
        if (typeof cfExp !== "number") return;
        w[course] = (w[course] ?? 0) + cfExp;
      }
    );
  });
  return w as Record<CourseName, number>;
}

export function buildSeedCourses(topK = 8): CourseName[] {
  const ranked = Object.entries(courseWeight()).sort((a, b) => b[1] - a[1]);
  return ranked.slice(0, topK).map(([c]) => c as CourseName);
}
