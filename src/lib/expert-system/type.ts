// src/lib/expert-system/types.ts
export type JobName =
  | "Software Engineer"
  | "Web Developer"
  | "Mobile Developer"
  | "Data Analyst"
  | "Data Scientist"
  | "Cybersecurity Analyst"
  | "System/Network Administrator"
  | "Database Engineer"
  | "Business Analyst (IT)"
  | "IT Project Manager";

export type CourseName =
  | "Software Development"
  | "Algorithms and Programming"
  | "Object Oriented Programming"
  | "Software Testing"
  | "Database"
  | "Web Programming"
  | "Information Retrieval"
  | "Mobile Programming"
  | "Business Data Analytics"
  | "Descriptive Statistics"
  | "Data Visualization and Analysis"
  | "Quantitative Methods of Business"
  | "Machine Learning"
  | "Data Mining"
  | "Inferential Statistics"
  | "Discrete Mathematics"
  | "Information System Security"
  | "Computer Network"
  | "Information Technology Risk Management"
  | "Operating System"
  | "Information Technology Service Management"
  | "Enterprise Application Development"
  | "Analysis and Design of Information System"
  | "Business Function and Process"
  | "Enterprise System"
  | "Information Technology Project Management"
  | "Leadership and Organizational Management"
  | "Information Technology Governance";

// 👇 Each job maps to a subset of courses
export type Rules = Record<JobName, Partial<Record<CourseName, number>>>;

export type UserPrefs = Partial<Record<CourseName, number>>;

export type TraceRow = { course: CourseName; cfUser: number; evidence: number };

// 👇 Not every job will appear in results
export type Traces = Partial<Record<JobName, TraceRow[]>>;

export type EngineResult = {
  cfJobs: Partial<Record<JobName, number>>;
  traces: Traces;
};
