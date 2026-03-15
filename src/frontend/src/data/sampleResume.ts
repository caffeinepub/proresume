import type { ResumeData } from "../backend";

export const SAMPLE_RESUME: ResumeData = {
  personalInfo: {
    name: "Alexandra Chen",
    jobTitle: "Senior Product Manager",
    email: "alexandra.chen@email.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexandrachen",
    website: "alexandrachen.io",
  },
  summary:
    "Results-driven Product Manager with 7+ years of experience leading cross-functional teams to deliver high-impact digital products. Proven track record of growing user engagement by 40% through data-driven decisions and customer-centric design. Skilled in translating complex technical requirements into clear product vision.",
  workExperience: [
    {
      id: BigInt(1),
      company: "TechFlow Inc.",
      title: "Senior Product Manager",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: undefined,
      isCurrent: true,
      bullets: [
        "Led product roadmap for B2B SaaS platform serving 500+ enterprise clients, achieving 35% revenue growth year-over-year",
        "Managed cross-functional team of 12 engineers, 4 designers, and 2 data scientists across 3 product lines",
        "Launched 3 major features that increased user retention by 28% and improved NPS from 42 to 67",
        "Reduced customer churn by 18% through data-driven feature prioritization and quarterly roadmap reviews",
      ],
    },
    {
      id: BigInt(2),
      company: "StartupHub",
      title: "Product Manager",
      location: "San Francisco, CA",
      startDate: "2018-06",
      endDate: "2021-02",
      isCurrent: false,
      bullets: [
        "Defined product vision for mobile-first marketplace app with 200K+ monthly active users",
        "Reduced customer acquisition cost by 22% through A/B testing and conversion funnel optimization",
        "Shipped 15+ features on time collaborating with 8 engineering teams across 2 time zones",
      ],
    },
    {
      id: BigInt(3),
      company: "DataCore Analytics",
      title: "Associate Product Manager",
      location: "New York, NY",
      startDate: "2016-08",
      endDate: "2018-05",
      isCurrent: false,
      bullets: [
        "Supported launch of analytics dashboard used by 50+ Fortune 500 clients",
        "Gathered and synthesized feedback from 100+ user interviews to inform product direction",
      ],
    },
  ],
  education: [
    {
      id: BigInt(1),
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2012-09",
      endDate: "2016-05",
      gpa: "3.8",
    },
  ],
  skills: [
    {
      id: BigInt(1),
      category: "Product Management",
      skills: [
        "Product Strategy",
        "Roadmapping",
        "Agile / Scrum",
        "OKRs & KPIs",
        "User Research",
        "A/B Testing",
      ],
    },
    {
      id: BigInt(2),
      category: "Technical",
      skills: ["SQL", "Python", "Figma", "JIRA", "Mixpanel", "Amplitude"],
    },
    {
      id: BigInt(3),
      category: "Leadership",
      skills: [
        "Cross-functional Collaboration",
        "Stakeholder Management",
        "Executive Presentations",
      ],
    },
  ],
  certifications: [
    {
      id: BigInt(1),
      name: "Certified Scrum Product Owner (CSPO)",
      issuer: "Scrum Alliance",
      date: "2020-04",
      url: "",
    },
    {
      id: BigInt(2),
      name: "Google Analytics Certification",
      issuer: "Google",
      date: "2022-01",
      url: "",
    },
  ],
  projects: [
    {
      id: BigInt(1),
      name: "AI-Powered User Onboarding",
      description:
        "Redesigned enterprise onboarding using ML personalization to reduce time-to-value",
      url: "",
      bullets: [
        "Reduced onboarding time-to-value by 45% for new enterprise customers",
        "Increased trial-to-paid conversion rate by 18% within 6 months of launch",
      ],
    },
  ],
  languages: [
    { id: BigInt(1), language: "English", proficiency: "Native" },
    {
      id: BigInt(2),
      language: "Mandarin Chinese",
      proficiency: "Professional Working",
    },
  ],
  targetJobDescription: "",
};

export const EMPTY_RESUME: ResumeData = {
  personalInfo: {
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  },
  summary: "",
  workExperience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
  targetJobDescription: "",
};
