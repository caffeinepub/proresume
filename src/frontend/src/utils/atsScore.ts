import type { ResumeData } from "../backend";

export interface ATSCategory {
  id: string;
  label: string;
  maxPoints: number;
  earnedPoints: number;
  tip: string;
  passed: boolean;
}

export interface ATSResult {
  total: number;
  categories: ATSCategory[];
}

export function calculateATSScore(resume: ResumeData): ATSResult {
  const categories: ATSCategory[] = [];

  // 1. Contact info completeness (+15)
  const { email, phone, location } = resume.personalInfo;
  const contactFields = [email, phone, location].filter(Boolean);
  const contactEarned = Math.round((contactFields.length / 3) * 15);
  const missingContact = [
    !email && "email",
    !phone && "phone",
    !location && "location",
  ]
    .filter(Boolean)
    .join(", ");
  categories.push({
    id: "contact",
    label: "Contact Information",
    maxPoints: 15,
    earnedPoints: contactEarned,
    passed: contactEarned === 15,
    tip:
      contactEarned < 15
        ? `Add your ${missingContact} to boost ATS score.`
        : "Contact info complete — all required fields present.",
  });

  // 2. Professional summary (+10)
  const summaryEarned = resume.summary.trim().length > 50 ? 10 : 0;
  categories.push({
    id: "summary",
    label: "Professional Summary",
    maxPoints: 10,
    earnedPoints: summaryEarned,
    passed: summaryEarned === 10,
    tip:
      summaryEarned === 0
        ? "Add a professional summary with at least 50 characters."
        : "Professional summary is present and well-formed.",
  });

  // 3. Work experience (+15)
  const hasWork = resume.workExperience.length > 0;
  categories.push({
    id: "experience",
    label: "Work Experience",
    maxPoints: 15,
    earnedPoints: hasWork ? 15 : 0,
    passed: hasWork,
    tip: !hasWork
      ? "Add at least one work experience entry."
      : "Work experience section is populated.",
  });

  // 4. Quantified achievements (+10)
  const hasNumbers = resume.workExperience.some((exp) =>
    exp.bullets.some((b) => /\d/.test(b)),
  );
  categories.push({
    id: "quantified",
    label: "Quantified Achievements",
    maxPoints: 10,
    earnedPoints: hasNumbers ? 10 : 0,
    passed: hasNumbers,
    tip: !hasNumbers
      ? "Add metrics to bullets (e.g., 'Increased sales by 30%', 'Managed 8-person team')."
      : "Bullet points include numbers and metrics.",
  });

  // 5. Skills (+10)
  const skillCount = resume.skills.reduce(
    (sum, cat) => sum + cat.skills.length,
    0,
  );
  const skillsEarned = skillCount >= 3 ? 10 : Math.round((skillCount / 3) * 10);
  categories.push({
    id: "skills",
    label: "Skills Section",
    maxPoints: 10,
    earnedPoints: skillsEarned,
    passed: skillCount >= 3,
    tip:
      skillCount < 3
        ? `Add ${3 - skillCount} more skill${3 - skillCount > 1 ? "s" : ""} to reach minimum of 3.`
        : `${skillCount} skills listed — strong coverage.`,
  });

  // 6. Education (+10)
  const hasEducation = resume.education.length > 0;
  categories.push({
    id: "education",
    label: "Education",
    maxPoints: 10,
    earnedPoints: hasEducation ? 10 : 0,
    passed: hasEducation,
    tip: !hasEducation
      ? "Add your educational background."
      : "Education section is complete.",
  });

  // 7. No profile photo (+5) — always earned
  categories.push({
    id: "photo",
    label: "ATS-Safe Format",
    maxPoints: 5,
    earnedPoints: 5,
    passed: true,
    tip: "No profile photo included — maximizes ATS compatibility.",
  });

  // 8. Keyword matching (+15)
  if (resume.targetJobDescription.trim()) {
    const words = resume.targetJobDescription
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const jobWords = new Set(words);
    const resumeText = [
      resume.summary,
      ...resume.workExperience.flatMap((e) => [
        e.title,
        e.company,
        ...e.bullets,
      ]),
      ...resume.skills.flatMap((s) => s.skills),
      ...resume.projects.flatMap((p) => [p.description, p.name, ...p.bullets]),
      resume.personalInfo.jobTitle,
    ]
      .join(" ")
      .toLowerCase();

    let matched = 0;
    for (const word of jobWords) {
      if (resumeText.includes(word)) matched++;
    }
    const ratio = jobWords.size > 0 ? matched / jobWords.size : 0;
    const keywordEarned = Math.round(ratio * 15);
    const pct = Math.round(ratio * 100);
    categories.push({
      id: "keywords",
      label: "Keyword Match",
      maxPoints: 15,
      earnedPoints: keywordEarned,
      passed: ratio >= 0.5,
      tip:
        ratio < 0.5
          ? `${pct}% keyword match. Add more relevant terms from the job description.`
          : `${pct}% keyword match — outstanding alignment with the job posting.`,
    });
  } else {
    categories.push({
      id: "keywords",
      label: "Keyword Match",
      maxPoints: 15,
      earnedPoints: 0,
      passed: false,
      tip: "Paste the target job description in 'Target Job' to enable keyword analysis (+15 pts).",
    });
  }

  // 9. Standard section headings (+5)
  const hasStandardSections = hasWork && hasEducation && skillCount > 0;
  categories.push({
    id: "sections",
    label: "Standard Sections",
    maxPoints: 5,
    earnedPoints: hasStandardSections ? 5 : 0,
    passed: hasStandardSections,
    tip: !hasStandardSections
      ? "Fill in Experience, Education, and Skills sections."
      : "All standard resume sections are present.",
  });

  // 10. No first-person pronouns (+5)
  const hasFirstPerson = /\b(I|my|me|I'm|I've|I'll|myself)\b/.test(
    resume.summary,
  );
  categories.push({
    id: "pronouns",
    label: "Professional Tone",
    maxPoints: 5,
    earnedPoints: hasFirstPerson ? 0 : 5,
    passed: !hasFirstPerson,
    tip: hasFirstPerson
      ? "Remove first-person pronouns (I, my, me) from your summary."
      : "Summary uses professional tone — no first-person pronouns.",
  });

  const total = Math.min(
    100,
    categories.reduce((sum, c) => sum + c.earnedPoints, 0),
  );
  return { total, categories };
}

export function scoreColor(score: number): string {
  if (score >= 80) return "oklch(0.65 0.18 155)";
  if (score >= 60) return "oklch(0.72 0.18 75)";
  return "oklch(0.60 0.22 25)";
}

export function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 60) return "Needs Work";
  return "Poor";
}
