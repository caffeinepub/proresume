// ─── AI Writing Templates & Helpers ────────────────────────────────────────

export type Industry =
  | "software"
  | "marketing"
  | "finance"
  | "sales"
  | "hr"
  | "healthcare"
  | "design"
  | "management"
  | "engineering"
  | "general";

export const INDUSTRY_LABELS: Record<Industry, string> = {
  software: "Software / Technology",
  marketing: "Marketing & Growth",
  finance: "Finance & Accounting",
  sales: "Sales & Business Dev",
  hr: "Human Resources",
  healthcare: "Healthcare & Medical",
  design: "Design & Creative",
  management: "Management & Leadership",
  engineering: "Engineering",
  general: "General / Other",
};

interface SummaryVariant {
  label: string;
  tone: "concise" | "achievement" | "leadership";
  text: string;
}

export const SUMMARY_TEMPLATES: Record<Industry, SummaryVariant[]> = {
  software: [
    {
      label: "Concise",
      tone: "concise",
      text: "Software engineer with {years}+ years of experience building scalable {industry} solutions. Proficient in full-stack development, cloud architecture, and Agile methodologies. Passionate about clean code and delivering high-quality products.",
    },
    {
      label: "Achievement-Focused",
      tone: "achievement",
      text: "{title} with {years}+ years of experience driving measurable outcomes in {industry}. Delivered multiple high-impact projects reducing latency by 40% and increasing system reliability to 99.9% uptime. Expert in transforming complex technical requirements into scalable, production-ready software.",
    },
    {
      label: "Leadership-Focused",
      tone: "leadership",
      text: "Senior {title} and technical leader with {years}+ years shaping engineering culture in {industry}. Led cross-functional teams of 5–15 engineers, mentored junior developers, and aligned technical roadmaps with business goals. Champion of DevOps practices and continuous improvement.",
    },
  ],
  marketing: [
    {
      label: "Concise",
      tone: "concise",
      text: "Marketing professional with {years}+ years of experience executing data-driven campaigns in {industry}. Skilled in content strategy, SEO/SEM, social media, and marketing analytics. Proven ability to grow brand awareness and drive qualified leads.",
    },
    {
      label: "Achievement-Focused",
      tone: "achievement",
      text: "{title} with {years}+ years in {industry} marketing, delivering campaigns that increased MQLs by 60% and reduced CAC by 25%. Expert in multi-channel attribution, A/B testing, and performance marketing with a track record of scaling revenue through targeted outreach.",
    },
    {
      label: "Leadership-Focused",
      tone: "leadership",
      text: "Marketing leader with {years}+ years building and directing high-performing teams in {industry}. Oversaw $[X]M marketing budgets, partnered with product and sales leadership, and developed brand strategies that elevated market positioning. Data-driven and creative in equal measure.",
    },
  ],
  finance: [
    {
      label: "Concise",
      tone: "concise",
      text: "Finance professional with {years}+ years of experience in {industry} financial planning, analysis, and reporting. Proficient in GAAP, financial modeling, and ERP systems. Committed to accuracy, compliance, and delivering actionable insights to stakeholders.",
    },
    {
      label: "Achievement-Focused",
      tone: "achievement",
      text: "{title} with {years}+ years in {industry}, delivering financial analyses that guided $[X]M investment decisions and reduced operating costs by [X]%. Expert in FP&A, risk management, and building forecasting models that improved budget accuracy by [X]%.",
    },
    {
      label: "Leadership-Focused",
      tone: "leadership",
      text: "Finance leader with {years}+ years managing financial operations in {industry}. Directed teams responsible for $[X]M in assets, led annual budgeting cycles, and collaborated with C-suite executives on strategic initiatives. Strong track record in audit preparedness and regulatory compliance.",
    },
  ],
  sales: [
    {
      label: "Concise",
      tone: "concise",
      text: "Results-oriented sales professional with {years}+ years of experience in {industry}. Consistently exceeded quota by building strong client relationships, identifying upsell opportunities, and delivering tailored solutions. Skilled in CRM tools and consultative selling.",
    },
    {
      label: "Achievement-Focused",
      tone: "achievement",
      text: "{title} with {years}+ years in {industry} sales, achieving 130%+ of quota annually and closing $[X]M in net-new ARR. Expert in enterprise sales cycles, negotiation, and territory management. Recognized as a top performer for [X] consecutive quarters.",
    },
    {
      label: "Leadership-Focused",
      tone: "leadership",
      text: "Sales leader with {years}+ years growing and managing revenue-generating teams in {industry}. Built and scaled a team of [N] AEs, implemented sales playbooks that reduced ramp time by [X]%, and partnered with marketing to improve pipeline quality by [X]%.",
    },
  ],
  hr: [
    {
      label: "Concise",
      tone: "concise",
      text: "HR professional with {years}+ years of experience in {industry}, specializing in talent acquisition, employee relations, and organizational development. Adept at aligning people strategies with business objectives and fostering inclusive workplace cultures.",
    },
    {
      label: "Achievement-Focused",
      tone: "achievement",
      text: "{title} with {years}+ years in {industry} HR, reducing time-to-fill by [X]% and improving employee retention by [X]% through targeted engagement programs. Expert in HRIS platforms, compensation benchmarking, and workforce planning.",
    },
    {
      label: "Leadership-Focused",
      tone: "leadership",
      text: "HR leader with {years}+ years partnering with executives in {industry} to scale organizations from [X] to [X] employees. Designed performance management frameworks, led DEIB initiatives, and built HR functions from the ground up in high-growth environments.",
    },
  ],
  healthcare: [
    {
      label: "Concise",
      tone: "concise",
      text: "Healthcare professional with {years}+ years of clinical and administrative experience in {industry}. Committed to patient-centered care, evidence-based practice, and cross-disciplinary collaboration. Skilled in EMR systems and quality improvement initiatives.",
    },
    {
      label: "Achievement-Focused",
      tone: "achievement",
      text: "{title} with {years}+ years in {industry}, improving patient outcomes through process innovations that reduced readmission rates by [X]% and increased patient satisfaction scores to [X]/10. Expertise in clinical protocols, care coordination, and regulatory compliance.",
    },
    {
      label: "Leadership-Focused",
      tone: "leadership",
      text: "Healthcare leader with {years}+ years directing clinical teams in {industry}. Managed departments of [N]+ professionals, led Joint Commission accreditation efforts, and implemented care pathway redesigns that cut average LOS by [X] days.",
    },
  ],
  design: [
    {
      label: "Concise",
      tone: "concise",
      text: "Creative {title} with {years}+ years crafting user-centered digital experiences in {industry}. Proficient in Figma, design systems, and cross-functional collaboration. Passionate about blending aesthetics with usability to solve real user problems.",
    },
    {
      label: "Achievement-Focused",
      tone: "achievement",
      text: "{title} with {years}+ years in {industry} design, shipping products used by [N]M+ users and increasing conversion rates by [X]% through UX research-driven redesigns. Expert in end-to-end product design from discovery to delivery.",
    },
    {
      label: "Leadership-Focused",
      tone: "leadership",
      text: "Design leader with {years}+ years building and mentoring design teams in {industry}. Established design systems adopted across [N] product lines, championed user research as a strategic asset, and collaborated with product and engineering to deliver cohesive experiences at scale.",
    },
  ],
  management: [
    {
      label: "Concise",
      tone: "concise",
      text: "Experienced manager with {years}+ years leading teams and driving operational excellence in {industry}. Strong communicator and strategic thinker with a track record of delivering projects on time and within budget.",
    },
    {
      label: "Achievement-Focused",
      tone: "achievement",
      text: "{title} with {years}+ years in {industry} management, delivering $[X]M in cost savings, launching [N] products, and growing team performance by [X]%. Expert in OKR frameworks, stakeholder management, and change management.",
    },
    {
      label: "Leadership-Focused",
      tone: "leadership",
      text: "Strategic leader with {years}+ years scaling operations and talent in {industry}. Built high-performing teams, defined organizational vision, and executed multi-year roadmaps that aligned growth objectives with business strategy.",
    },
  ],
  engineering: [
    {
      label: "Concise",
      tone: "concise",
      text: "Engineer with {years}+ years of hands-on experience in {industry} design, analysis, and project execution. Skilled in applying engineering principles to solve complex problems safely and efficiently. Proficient in industry-standard tools and methodologies.",
    },
    {
      label: "Achievement-Focused",
      tone: "achievement",
      text: "{title} with {years}+ years in {industry} engineering, delivering projects [X]% under budget and reducing system failure rates by [X]%. Expertise in root cause analysis, process optimization, and cross-discipline technical collaboration.",
    },
    {
      label: "Leadership-Focused",
      tone: "leadership",
      text: "Principal engineer and team lead with {years}+ years in {industry}, directing multi-disciplinary teams of [N]+ engineers. Championed standardization initiatives, led code/design reviews, and mentored early-career engineers to accelerate their growth.",
    },
  ],
  general: [
    {
      label: "Concise",
      tone: "concise",
      text: "Dedicated professional with {years}+ years of experience delivering high-quality results in {industry}. Strong analytical, communication, and organizational skills with a proven ability to thrive in fast-paced environments.",
    },
    {
      label: "Achievement-Focused",
      tone: "achievement",
      text: "{title} with {years}+ years of experience in {industry}, consistently exceeding targets and driving measurable improvements. Recognized for problem-solving, attention to detail, and a collaborative approach to achieving team and organizational goals.",
    },
    {
      label: "Leadership-Focused",
      tone: "leadership",
      text: "Results-driven leader with {years}+ years managing cross-functional initiatives in {industry}. Builds high-trust relationships with stakeholders, mentors team members, and aligns day-to-day execution with long-term strategic objectives.",
    },
  ],
};

export function fillSummaryTemplate(
  template: string,
  params: { years: string; title: string; industry: string },
): string {
  return template
    .replace(/\{years\}/g, params.years || "5")
    .replace(/\{title\}/g, params.title || "Professional")
    .replace(/\{industry\}/g, params.industry || "the industry");
}

// ─── Bullet Improvement ────────────────────────────────────────────────────

interface BulletPattern {
  match: RegExp;
  suggest: (text: string) => string;
}

const BULLET_PATTERNS: BulletPattern[] = [
  {
    // Starts with weak "Responsible for" or "Helped"
    match: /^(responsible for|helped|assisted with|worked on|participated in)/i,
    suggest: (text) => {
      const stripped = text.replace(
        /^(responsible for|helped|assisted with|worked on|participated in)\s*/i,
        "",
      );
      return `Spearheaded ${stripped}, resulting in [X]% improvement in efficiency`;
    },
  },
  {
    // Starts with "Managed" but lacks metrics
    match: /^managed\b(?!.*\d)/i,
    suggest: (text) =>
      `${text} — overseeing a team of [N] and achieving [X]% target attainment`,
  },
  {
    // Starts with "Developed" but lacks outcome
    match: /^developed\b(?!.*\d)/i,
    suggest: (text) =>
      `${text}, reducing [process] time by [X]% and improving [outcome] for [N] users`,
  },
  {
    // Starts with "Created" but lacks impact
    match: /^created\b(?!.*\d)/i,
    suggest: (text) =>
      `${text}, enabling [X]% gain in [metric] across [N] stakeholders`,
  },
  {
    // Starts with "Led" but lacks metrics
    match: /^led\b(?!.*\d)/i,
    suggest: (text) =>
      `${text}, delivering [X]% ahead of schedule and under budget by $[Y]K`,
  },
  {
    // Very short bullets (< 40 chars)
    match: /^.{0,39}$/,
    suggest: (text) =>
      `${text} — driving [X]% improvement in [key metric], measured via [tool/process]`,
  },
];

const ACTION_VERB_SUGGESTIONS = [
  "Accelerated",
  "Architected",
  "Championed",
  "Collaborated",
  "Delivered",
  "Engineered",
  "Executed",
  "Generated",
  "Implemented",
  "Launched",
  "Optimized",
  "Orchestrated",
  "Pioneered",
  "Redesigned",
  "Scaled",
  "Spearheaded",
  "Streamlined",
  "Transformed",
];

function getRandomVerb(): string {
  return ACTION_VERB_SUGGESTIONS[
    Math.floor(Math.random() * ACTION_VERB_SUGGESTIONS.length)
  ];
}

export function strengthenBullet(text: string): string[] {
  if (!text.trim()) return [];
  const results: string[] = [];

  // Version 1: apply first matching pattern
  for (const pattern of BULLET_PATTERNS) {
    if (pattern.match.test(text.trim())) {
      results.push(pattern.suggest(text.trim()));
      break;
    }
  }
  if (results.length === 0) {
    results.push(
      `${text.trim()}, resulting in [X]% improvement and saving [N] hours/week`,
    );
  }

  // Version 2: STAR format hint
  const starVersion = `${text.trim()} — [Situation: brief context] • [Task: your role] • [Action: specific steps taken] • [Result: quantified outcome, e.g., +[X]% revenue, -[Y]% churn]`;
  results.push(starVersion);

  // Version 3: Strong action verb rewrite
  const verb = getRandomVerb();
  const coreText = text.trim().replace(/^\w+\s+/i, ""); // strip first word
  results.push(
    `${verb} ${coreText}, achieving [X]% [metric] improvement for [N] [users/clients/teams]`,
  );

  return results;
}

// ─── Skills by Industry ────────────────────────────────────────────────────

export const SKILLS_BY_INDUSTRY: Record<Industry, string[]> = {
  software: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "GraphQL",
    "REST APIs",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "Agile",
    "Microservices",
    "System Design",
    "TDD",
    "Redis",
    "Terraform",
  ],
  marketing: [
    "SEO",
    "SEM",
    "Google Analytics",
    "HubSpot",
    "Content Marketing",
    "Copywriting",
    "Email Marketing",
    "Social Media Marketing",
    "A/B Testing",
    "Paid Ads",
    "Marketing Automation",
    "CRM",
    "Conversion Rate Optimization",
    "Salesforce",
    "Brand Strategy",
    "Influencer Marketing",
    "Market Research",
    "Tableau",
  ],
  finance: [
    "Financial Modeling",
    "Excel",
    "GAAP",
    "FP&A",
    "SAP",
    "QuickBooks",
    "Budgeting",
    "Forecasting",
    "Risk Management",
    "Valuation",
    "Bloomberg",
    "Tableau",
    "PowerBI",
    "SQL",
    "Audit",
    "Tax Compliance",
    "IFRS",
    "Python",
  ],
  sales: [
    "Salesforce",
    "HubSpot",
    "Pipeline Management",
    "Prospecting",
    "Cold Calling",
    "Account Management",
    "Negotiation",
    "B2B Sales",
    "SaaS Sales",
    "CRM",
    "Enterprise Sales",
    "Sales Forecasting",
    "Objection Handling",
    "Demo Skills",
    "Territory Management",
    "LinkedIn Sales Navigator",
    "Outreach.io",
  ],
  hr: [
    "Talent Acquisition",
    "HRIS",
    "Workday",
    "ADP",
    "Employee Relations",
    "Performance Management",
    "Onboarding",
    "Compensation & Benefits",
    "DEIB",
    "Workforce Planning",
    "Labor Law",
    "Succession Planning",
    "Learning & Development",
    "HR Analytics",
    "Applicant Tracking Systems",
    "Organizational Development",
  ],
  healthcare: [
    "Patient Care",
    "EMR/EHR",
    "HIPAA",
    "Clinical Documentation",
    "Care Coordination",
    "Epic Systems",
    "Cerner",
    "Medical Billing",
    "ICD-10",
    "CPT Codes",
    "Quality Improvement",
    "Infection Control",
    "BLS/ACLS",
    "Case Management",
    "Medication Administration",
    "JCAHO",
    "Telehealth",
  ],
  design: [
    "Figma",
    "Sketch",
    "Adobe XD",
    "User Research",
    "Wireframing",
    "Prototyping",
    "Design Systems",
    "Accessibility",
    "Motion Design",
    "After Effects",
    "Photoshop",
    "Illustrator",
    "UX Writing",
    "Usability Testing",
    "Information Architecture",
    "Brand Identity",
    "Typography",
    "Color Theory",
  ],
  management: [
    "Strategic Planning",
    "P&L Management",
    "OKRs",
    "Cross-functional Leadership",
    "Change Management",
    "Stakeholder Management",
    "Budget Management",
    "Agile",
    "Scrum",
    "Six Sigma",
    "Process Improvement",
    "Executive Communication",
    "Performance Reviews",
    "Vendor Management",
    "Project Management",
    "PMP",
  ],
  engineering: [
    "AutoCAD",
    "SolidWorks",
    "MATLAB",
    "Python",
    "Six Sigma",
    "Lean Manufacturing",
    "Project Management",
    "PLC Programming",
    "FEA/FEM",
    "Root Cause Analysis",
    "ISO Standards",
    "Technical Documentation",
    "3D Modeling",
    "Prototyping",
    "Circuit Design",
    "Data Analysis",
    "OSHA Compliance",
  ],
  general: [
    "Project Management",
    "Microsoft Office",
    "Communication",
    "Problem Solving",
    "Data Analysis",
    "Team Leadership",
    "Time Management",
    "Critical Thinking",
    "Customer Service",
    "Presentation Skills",
    "Adaptability",
    "Collaboration",
    "Research",
    "Reporting",
    "Process Improvement",
    "Attention to Detail",
  ],
};

// ─── Weak Words ────────────────────────────────────────────────────────────

export const WEAK_WORDS: Array<{ word: string; alternatives: string[] }> = [
  { word: "helped", alternatives: ["accelerated", "enabled", "supported"] },
  { word: "worked on", alternatives: ["delivered", "executed", "drove"] },
  { word: "responsible for", alternatives: ["owned", "led", "managed"] },
  { word: "assisted", alternatives: ["collaborated on", "contributed to"] },
  { word: "participated", alternatives: ["spearheaded", "championed"] },
  { word: "involved in", alternatives: ["directed", "oversaw", "led"] },
  { word: "tried to", alternatives: ["achieved", "delivered", "implemented"] },
  { word: "attempted", alternatives: ["executed", "drove", "engineered"] },
];
