// tests/forwardChaining.test.ts
import { cfCombinePos, forwardChain } from "../src/lib/forwardChaining";

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

  test("TC-CF-004: Boundary values", () => {
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
    expect(result.cfJobs["Database Engineer"]).toBeCloseTo(0.7764, 4);
    expect(result.cfJobs["Web Developer"]).toBeCloseTo(0.768, 4);

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
