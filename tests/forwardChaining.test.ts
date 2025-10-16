// tests/forwardChaining.test.ts
import {
  cfCombinePos,
  forwardChain,
  getNextCourses,
  SCALE_TO_CF,
  EXPAND_GATE,
} from "../src/lib/forwardChaining";

describe("cfCombinePos Function", () => {
  test("TC-CF-001: cfOld equals zero", () => {
    const result = cfCombinePos(0, 0.5);
    expect(result).toBe(0.5);
  });

  test("TC-CF-002: cfOld is negative", () => {
    const result = cfCombinePos(-0.1, 0.3);
    expect(result).toBe(0.3);
  });

  test("TC-CF-003: Both values positive", () => {
    const result = cfCombinePos(0.4, 0.3);
    expect(result).toBeCloseTo(0.58, 4);
  });

  test('TC-CF-004: Boundary values', () => {
    const result = cfCombinePos(0.001, 0.999);
    expect(result).toBeCloseTo(0.999001, 6);
  });

  test("TC-CF-005: Maximum values", () => {
    const result = cfCombinePos(1.0, 1.0);
    expect(result).toBe(1.0);
  });
});

describe("forwardChain Function", () => {
  test("TC-FC-001: Empty user preferences", () => {
    const result = forwardChain({});
    expect(result.cfJobs).toEqual({});
    expect(result.traces).toEqual({});
  });

  test("TC-FC-002: Single course preference", () => {
    const userPrefs = { "Software Development": 0.8 };
    const result = forwardChain(userPrefs);

    expect(result.cfJobs["Software Engineer"]).toBeCloseTo(0.72, 4);
    expect(result.cfJobs["Web Developer"]).toBeCloseTo(0.6, 4);
    expect(result.cfJobs["Database Engineer"]).toBeCloseTo(0.48, 4);

    expect(result.traces["Software Engineer"]).toHaveLength(1);
    expect(result.traces["Software Engineer"][0]).toMatchObject({
      course: "Software Development",
      cfUser: 0.8,
      evidence: 0.72,
    });
  });

  test("TC-FC-003: Multiple course preferences", () => {
    const userPrefs = {
      "Software Development": 0.8,
      Database: 0.6,
    };
    const result = forwardChain(userPrefs);

    // Software Engineer should have combined CF from both courses
    expect(result.cfJobs["Software Engineer"]).toBeCloseTo(0.8292, 4);
    expect(result.traces["Software Engineer"]).toHaveLength(2);
  });

  test("TC-FC-004: All zero preferences", () => {
    const userPrefs = {
      "Software Development": 0,
      Database: 0,
    };
    const result = forwardChain(userPrefs);

    expect(result.cfJobs).toEqual({});
    expect(result.traces).toEqual({});
  });

  test("TC-FC-005: Mixed preferences", () => {
    const userPrefs = {
      "Software Development": 0.5,
      Database: 0,
      "Web Programming": 0.7,
    };
    const result = forwardChain(userPrefs);

    expect(result.cfJobs["Software Engineer"]).toBeCloseTo(0.45, 4);
    expect(result.cfJobs["Web Developer"]).toBeCloseTo(0.7906, 4);
    expect(result.traces["Web Developer"]).toHaveLength(2);
  });
});

describe("getNextCourses Function", () => {
  test("TC-GN-001: First call with empty asked set", () => {
    const result = getNextCourses({}, new Set());

    expect(result).toHaveLength(8);
    expect(result).toContain("Software Development");
    expect(result).toContain("Database");
    expect(result).toContain("Data Visualization and Analysis");
  });

  test("TC-GN-002: No jobs exceed expansion gate", () => {
    const userPrefs = { "Software Development": 0.2 };
    const asked = new Set(["Software Development"]);
    const result = getNextCourses(userPrefs, asked);

    expect(result).toHaveLength(0);
  });

  test("TC-GN-003: Job exceeds expansion gate", () => {
    const userPrefs = { "Software Development": 0.5 };
    const asked = new Set(["Software Development"]);
    const result = getNextCourses(userPrefs, asked);

    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain("Algorithms and Programming");
    expect(result).toContain("Object Oriented Programming");
  });

  test('TC-GN-004: Expansion provides new courses beyond software engineer', () => {
    const userPrefs = { "Software Development": 0.5 };
    const asked = new Set([
      "Software Development",
      "Algorithms and Programming",
      "Object Oriented Programming",
      "Software Testing",
      "Database"
    ]);
    const result = getNextCourses(userPrefs, asked);
    
    // Should get courses from other jobs that also exceeded the gate
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain("Web Programming");
  });

  test("TC-GN-005: Multiple jobs exceed gate", () => {
    const userPrefs = {
      "Software Development": 0.4,
      "Web Programming": 0.6,
    };
    const asked = new Set(["Software Development", "Web Programming"]);
    const result = getNextCourses(userPrefs, asked);

    expect(result.length).toBeGreaterThan(0);
    // Should include courses from both Software Engineer and Web Developer jobs
    const uniqueCourses = new Set(result);
    expect(uniqueCourses.size).toBe(result.length); // No duplicates
  });
});

describe("Edge Cases and Error Handling", () => {
  test("Should handle undefined course in user preferences", () => {
    const userPrefs = { "Nonexistent Course": 0.8 };
    const result = forwardChain(userPrefs);

    expect(result.cfJobs).toEqual({});
    expect(result.traces).toEqual({});
  });

  test("Should handle negative user preference values", () => {
    const userPrefs = { "Software Development": -0.5 };
    const result = forwardChain(userPrefs);

    expect(result.cfJobs).toEqual({});
    expect(result.traces).toEqual({});
  });

  test("Should handle values greater than 1", () => {
    const result = cfCombinePos(0.5, 1.5);
    expect(result).toBeCloseTo(1.25, 4);
  });
});

describe("Integration Tests", () => {
  test("Complete workflow: seed courses -> expansion -> results", () => {
    // Step 1: Get initial seed courses
    const initialCourses = getNextCourses({}, new Set());
    expect(initialCourses.length).toBe(8);

    // Step 2: Simulate user rating some seed courses
    const userPrefs = {
      "Software Development": 0.8,
      Database: 0.6,
      "Web Programming": 0.4,
    };

    // Step 3: Get next courses (should trigger expansion)
    const asked = new Set([
      "Software Development",
      "Database",
      "Web Programming",
    ]);
    const nextCourses = getNextCourses(userPrefs, asked);
    expect(nextCourses.length).toBeGreaterThan(0);

    // Step 4: Get final results
    const { cfJobs, traces } = forwardChain(userPrefs);
    expect(Object.keys(cfJobs).length).toBeGreaterThan(0);

    // Verify Web Developer has highest CF due to high Web Programming coefficient (0.95)
    const sortedJobs = Object.entries(cfJobs).sort((a, b) => b[1] - a[1]);
    expect(sortedJobs[0][0]).toBe("Web Developer");
  });
});
