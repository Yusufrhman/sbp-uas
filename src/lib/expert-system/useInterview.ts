// src/lib/expert-system/useInterview.ts
import { useMemo, useState } from "react";
import { buildSeedCourses, forwardChain } from "./engine";
import { EXPAND_GATE } from "./rules";
import type { CourseName, UserPrefs, JobName } from "./type";
import { JOB_RULES } from "./rules";

export function useInterview(seedCount = 8) {
  const [prefs, setPrefs] = useState<UserPrefs>({});
  const [asked, setAsked] = useState<Set<CourseName>>(new Set());
  const [frontier, setFrontier] = useState<Array<[number, CourseName]>>(() =>
    buildSeedCourses(seedCount).map((c) => [999, c])
  );

  const push = (course: CourseName, priority: number) =>
    setFrontier((prev) => {
      if (asked.has(course) || prev.some(([, c]) => c === course)) return prev;
      return [...prev, [priority, course]];
    });

  const pop = (): CourseName | null => {
    if (!frontier.length) return null;
    const sorted = [...frontier].sort((a, b) => b[0] - a[0]);
    const [, course] = sorted[0];
    const rest = sorted.slice(1);
    setFrontier(rest);
    return course;
  };

  const currentCourse: CourseName | null = useMemo(() => {
    const sorted = [...frontier].sort((a, b) => b[0] - a[0]);
    const next = sorted.find(([, c]) => !asked.has(c));
    return next ? next[1] : null;
  }, [frontier, asked]);

  const { cfJobs } = useMemo(() => forwardChain(prefs), [prefs]);

  const answer = (course: CourseName, cfUser: number) => {
    setPrefs((p) => ({ ...p, [course]: cfUser }));
    setAsked((a) => new Set(a).add(course));

    const now = forwardChain({ ...prefs, [course]: cfUser });

    // Expand supporting courses based on rules for any job whose CF passes the gate
    Object.entries(now.cfJobs).forEach(([job, cf]) => {
      if ((cf ?? 0) >= EXPAND_GATE) {
        const mapping = JOB_RULES[job as JobName] ?? {};
        (Object.entries(mapping) as [CourseName, number | undefined][]).forEach(
          ([kc, cfExp]) => {
            if (typeof cfExp === "number") push(kc, cfExp);
          }
        );
      }
    });

    pop();
  };

  const isDone = !currentCourse;

  return {
    currentCourse,
    prefs,
    cfJobs,
    traces: useMemo(() => forwardChain(prefs).traces, [prefs]),
    isDone,
    answer,
    reset: () => {
      setPrefs({});
      setAsked(new Set());
      setFrontier(buildSeedCourses(seedCount).map((c) => [999, c]));
    },
  };
}
