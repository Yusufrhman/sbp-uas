import { type Rules } from "./type";

export const EXPAND_GATE = 0.3 as const;

export const SCALE_TO_CF: Record<string, number> = {
  "1": 0.0,
  "2": 0.25,
  "3": 0.5,
  "4": 0.75,
  "5": 1.0,
};

export const JOB_RULES: Rules = {
  "Software Engineer": {
    "Software Development": 0.9,
    "Algorithms and Programming": 0.9,
    "Object Oriented Programming": 0.85,
    "Software Testing": 0.7,
    "Database": 0.65,
  },
  "Web Developer": {
    "Web Programming": 0.95,
    "Software Development": 0.75,
    "Database": 0.7,
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
    "Database": 0.7,
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
    "Database": 0.95,
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
