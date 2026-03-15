import type { ResumeData } from "../backend";
import type { Template } from "./BuilderPage";

interface Props {
  resume: ResumeData;
  template: Template;
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  if (!year) return dateStr;
  if (!month) return year;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const m = Number.parseInt(month, 10);
  return `${months[m - 1] ?? ""} ${year}`;
}

// Shared bullet list renderer — biome-ignore applied once here
function Bullets({
  items,
  color = "#333",
  indent = 14,
}: { items: string[]; color?: string; indent?: number }) {
  const li: React.CSSProperties = {
    marginLeft: `${indent}px`,
    marginBottom: "2px",
    fontSize: "9.5pt",
    color,
  };
  return (
    <ul style={{ margin: "0", padding: "0", listStyle: "disc" }}>
      {items.map((b, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: bullet points are primitive strings
        <li key={i} style={li}>
          {b}
        </li>
      ))}
    </ul>
  );
}

// Tech-style bullet list
function TechBullets({ items }: { items: string[] }) {
  const li: React.CSSProperties = {
    fontSize: "9.5pt",
    color: "#333",
    marginBottom: "2px",
    paddingLeft: "12px",
  };
  return (
    <ul style={{ margin: "0", padding: "0", listStyle: "none" }}>
      {items.map((b, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: bullet points are primitive strings
        <li key={i} style={li}>
          <span style={{ color: "#16a34a", marginRight: "4px" }}>▸</span>
          {b}
        </li>
      ))}
    </ul>
  );
}

// Contact info helper
function contactStr(pi: ResumeData["personalInfo"]): string[] {
  return [
    pi.email,
    pi.phone,
    pi.location,
    pi.linkedin ? pi.linkedin.replace(/.*\/in\//i, "linkedin.com/in/") : "",
    pi.website,
  ].filter(Boolean);
}

const paperBase: React.CSSProperties = {
  maxWidth: "794px",
  margin: "0 auto",
  background: "white",
  boxShadow: "0 4px 32px 0 rgba(0,0,0,0.10)",
  borderRadius: "4px",
};

export function ResumePreview({ resume, template }: Props) {
  switch (template) {
    case "classic":
      return <ClassicTemplate resume={resume} />;
    case "modern":
      return <ModernTemplate resume={resume} />;
    case "executive":
      return <ExecutiveTemplate resume={resume} />;
    case "minimal":
      return <MinimalTemplate resume={resume} />;
    case "tech":
      return <TechTemplate resume={resume} />;
    case "sidebar":
      return <SidebarTemplate resume={resume} />;
    case "elegant":
      return <ElegantTemplate resume={resume} />;
    case "bold":
      return <BoldTemplate resume={resume} />;
    case "corporate":
      return <CorporateTemplate resume={resume} />;
    case "academic":
      return <AcademicTemplate resume={resume} />;
    case "photo-modern":
      return <PhotoModernTemplate resume={resume} />;
    case "photo-sidebar":
      return <PhotoSidebarTemplate resume={resume} />;
    default:
      return <ModernTemplate resume={resume} />;
  }
}

interface TplProps {
  resume: ResumeData;
}

// ============================================================================
// 1. MODERN
// ============================================================================
function ModernTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const accent = "#2e6da0";
  const heading: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "9.5pt",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: accent,
    marginBottom: "8px",
  };
  const divider: React.CSSProperties = {
    borderTop: "1px solid #e0e4ef",
    margin: "16px 0 12px",
  };
  const jobRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1px",
  };
  const jobTitle: React.CSSProperties = {
    fontWeight: "700",
    fontSize: "10.5pt",
    color: "#0d1117",
  };
  const dateStyle: React.CSSProperties = {
    fontSize: "8.5pt",
    color: "#666",
    flexShrink: 0,
  };
  const company: React.CSSProperties = {
    fontSize: "9.5pt",
    color: "#444",
    marginBottom: "4px",
  };
  const chip: React.CSSProperties = {
    display: "inline-block",
    background: "#f0f4ff",
    borderRadius: "3px",
    padding: "1px 7px",
    marginRight: "4px",
    marginBottom: "4px",
    fontSize: "8.5pt",
    color: "#2a2a3e",
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
        fontSize: "10.5pt",
        lineHeight: "1.5",
        color: "#1a1a2e",
        padding: "48px 52px",
      }}
    >
      <header>
        {pi.name && (
          <h1
            style={{
              fontSize: "24pt",
              fontWeight: "800",
              letterSpacing: "-0.3px",
              color: "#0d1117",
              marginBottom: "2px",
              lineHeight: "1.15",
            }}
          >
            {pi.name}
          </h1>
        )}
        {pi.jobTitle && (
          <p
            style={{
              fontSize: "12.5pt",
              fontWeight: "500",
              color: accent,
              marginBottom: "8px",
            }}
          >
            {pi.jobTitle}
          </p>
        )}
        {contacts.length > 0 && (
          <p style={{ fontSize: "8.5pt", color: "#555" }}>
            {contacts.join(" · ")}
          </p>
        )}
      </header>
      {summary && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Professional Summary</h2>
          <p
            style={{ fontSize: "9.5pt", color: "#2a2a3e", lineHeight: "1.55" }}
          >
            {summary}
          </p>
        </section>
      )}
      {workExperience.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Work Experience</h2>
          {workExperience.map((exp) => (
            <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
              <div style={jobRow}>
                <span style={jobTitle}>{exp.title}</span>
                <span style={dateStyle}>
                  {formatDate(exp.startDate)} –{" "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <p style={company}>
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
              {exp.bullets.length > 0 && (
                <Bullets items={exp.bullets} color="#2a2a3e" />
              )}
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Education</h2>
          {education.map((edu) => (
            <div key={String(edu.id)} style={{ marginBottom: "8px" }}>
              <div style={jobRow}>
                <span style={jobTitle}>{edu.institution}</span>
                <span style={dateStyle}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </span>
              </div>
              <p style={company}>
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Skills</h2>
          {skills.map((cat) => (
            <div key={String(cat.id)} style={{ marginBottom: "6px" }}>
              {cat.category && (
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "9pt",
                    marginRight: "8px",
                    color: "#0d1117",
                  }}
                >
                  {cat.category}:
                </span>
              )}
              {cat.skills.map((sk, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skill strings are primitive values
                <span key={i} style={chip}>
                  {sk}
                </span>
              ))}
            </div>
          ))}
        </section>
      )}
      {certifications.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Certifications</h2>
          {certifications.map((cert) => (
            <div
              key={String(cert.id)}
              style={{ marginBottom: "4px", fontSize: "9.5pt" }}
            >
              <span style={{ fontWeight: "600", color: "#0d1117" }}>
                {cert.name}
              </span>
              {cert.issuer && (
                <span style={{ color: "#555" }}> · {cert.issuer}</span>
              )}
              {cert.date && (
                <span style={{ color: "#777" }}>
                  {" "}
                  · {formatDate(cert.date)}
                </span>
              )}
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Projects</h2>
          {projects.map((proj) => (
            <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "10pt",
                  color: "#0d1117",
                  marginBottom: "2px",
                }}
              >
                {proj.name}
                {proj.url && (
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "8.5pt",
                      color: accent,
                      marginLeft: "8px",
                    }}
                  >
                    {proj.url}
                  </span>
                )}
              </p>
              {proj.description && (
                <p
                  style={{
                    fontSize: "9.5pt",
                    color: "#444",
                    marginBottom: "3px",
                  }}
                >
                  {proj.description}
                </p>
              )}
              {proj.bullets.length > 0 && (
                <Bullets items={proj.bullets} color="#2a2a3e" />
              )}
            </div>
          ))}
        </section>
      )}
      {languages.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Languages</h2>
          <p style={{ fontSize: "9.5pt", color: "#2a2a3e" }}>
            {languages
              .map(
                (l) =>
                  `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
              )
              .join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// 2. CLASSIC
// ============================================================================
function ClassicTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const divider: React.CSSProperties = {
    borderTop: "2px solid #1a1a2e",
    margin: "16px 0 12px",
  };
  const heading: React.CSSProperties = {
    fontFamily: "'Playfair Display', serif",
    fontSize: "11.5pt",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "8px",
    borderBottom: "1px solid #ccc",
    paddingBottom: "4px",
  };
  const jobRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1px",
  };
  const jobTitle: React.CSSProperties = {
    fontWeight: "700",
    fontSize: "10.5pt",
    color: "#0d1117",
  };
  const dateStyle: React.CSSProperties = {
    fontSize: "8.5pt",
    color: "#666",
    flexShrink: 0,
  };
  const company: React.CSSProperties = {
    fontSize: "9.5pt",
    color: "#444",
    marginBottom: "4px",
  };
  const chip: React.CSSProperties = {
    display: "inline-block",
    border: "1px solid #ccc",
    borderRadius: "3px",
    padding: "1px 7px",
    marginRight: "4px",
    marginBottom: "4px",
    fontSize: "8.5pt",
    color: "#2a2a3e",
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "10.5pt",
        lineHeight: "1.5",
        color: "#1a1a2e",
        padding: "48px 52px",
      }}
    >
      <header>
        {pi.name && (
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "26pt",
              fontWeight: "800",
              letterSpacing: "-0.5px",
              color: "#0d1117",
              marginBottom: "2px",
              lineHeight: "1.15",
            }}
          >
            {pi.name}
          </h1>
        )}
        {pi.jobTitle && (
          <p
            style={{
              fontSize: "12.5pt",
              fontWeight: "400",
              fontStyle: "italic",
              color: "#2e6da0",
              marginBottom: "8px",
            }}
          >
            {pi.jobTitle}
          </p>
        )}
        {contacts.length > 0 && (
          <p style={{ fontSize: "8.5pt", color: "#555" }}>
            {contacts.join(" · ")}
          </p>
        )}
      </header>
      {summary && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Professional Summary</h2>
          <p
            style={{ fontSize: "9.5pt", color: "#2a2a3e", lineHeight: "1.55" }}
          >
            {summary}
          </p>
        </section>
      )}
      {workExperience.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Work Experience</h2>
          {workExperience.map((exp) => (
            <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
              <div style={jobRow}>
                <span style={jobTitle}>{exp.title}</span>
                <span style={dateStyle}>
                  {formatDate(exp.startDate)} –{" "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <p style={company}>
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
              {exp.bullets.length > 0 && (
                <Bullets items={exp.bullets} color="#2a2a3e" />
              )}
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Education</h2>
          {education.map((edu) => (
            <div key={String(edu.id)} style={{ marginBottom: "8px" }}>
              <div style={jobRow}>
                <span style={jobTitle}>{edu.institution}</span>
                <span style={dateStyle}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </span>
              </div>
              <p style={company}>
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Skills</h2>
          {skills.map((cat) => (
            <div key={String(cat.id)} style={{ marginBottom: "6px" }}>
              {cat.category && (
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "9pt",
                    marginRight: "8px",
                    color: "#0d1117",
                  }}
                >
                  {cat.category}:
                </span>
              )}
              {cat.skills.map((sk, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skill strings are primitive values
                <span key={i} style={chip}>
                  {sk}
                </span>
              ))}
            </div>
          ))}
        </section>
      )}
      {certifications.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Certifications</h2>
          {certifications.map((cert) => (
            <div
              key={String(cert.id)}
              style={{ marginBottom: "4px", fontSize: "9.5pt" }}
            >
              <span style={{ fontWeight: "600", color: "#0d1117" }}>
                {cert.name}
              </span>
              {cert.issuer && (
                <span style={{ color: "#555" }}> · {cert.issuer}</span>
              )}
              {cert.date && (
                <span style={{ color: "#777" }}>
                  {" "}
                  · {formatDate(cert.date)}
                </span>
              )}
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Projects</h2>
          {projects.map((proj) => (
            <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "10pt",
                  color: "#0d1117",
                  marginBottom: "2px",
                }}
              >
                {proj.name}
                {proj.url && (
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "8.5pt",
                      color: "#2e6da0",
                      marginLeft: "8px",
                    }}
                  >
                    {proj.url}
                  </span>
                )}
              </p>
              {proj.description && (
                <p
                  style={{
                    fontSize: "9.5pt",
                    color: "#444",
                    marginBottom: "3px",
                  }}
                >
                  {proj.description}
                </p>
              )}
              {proj.bullets.length > 0 && (
                <Bullets items={proj.bullets} color="#2a2a3e" />
              )}
            </div>
          ))}
        </section>
      )}
      {languages.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Languages</h2>
          <p style={{ fontSize: "9.5pt", color: "#2a2a3e" }}>
            {languages
              .map(
                (l) =>
                  `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
              )
              .join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// 3. EXECUTIVE
// ============================================================================
function ExecutiveTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const navy = "#1a2744";
  const secH = (label: string) => (
    <h2
      style={{
        fontSize: "10pt",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: navy,
        borderLeft: `3px solid ${navy}`,
        paddingLeft: "10px",
        marginBottom: "8px",
        marginTop: "0",
      }}
    >
      {label}
    </h2>
  );
  const chip: React.CSSProperties = {
    display: "inline-block",
    background: "#eef2ff",
    borderRadius: "3px",
    padding: "1px 7px",
    marginRight: "4px",
    marginBottom: "4px",
    fontSize: "8.5pt",
    color: navy,
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.55",
        color: "#111",
      }}
    >
      <header
        style={{ background: navy, color: "white", padding: "32px 48px 24px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div>
            {pi.name && (
              <h1
                style={{
                  fontSize: "26pt",
                  fontWeight: "800",
                  color: "white",
                  marginBottom: "4px",
                  letterSpacing: "-0.5px",
                }}
              >
                {pi.name}
              </h1>
            )}
            {pi.jobTitle && (
              <p style={{ fontSize: "12pt", color: "#a8c4e8", margin: 0 }}>
                {pi.jobTitle}
              </p>
            )}
          </div>
          {contacts.length > 0 && (
            <div
              style={{
                textAlign: "right",
                fontSize: "8pt",
                color: "#c8dcf0",
                lineHeight: "1.7",
              }}
            >
              {contacts.map((c) => (
                <div key={c}>{c}</div>
              ))}
            </div>
          )}
        </div>
      </header>
      <div style={{ padding: "28px 48px" }}>
        {summary && (
          <section style={{ marginBottom: "20px" }}>
            {secH("Professional Summary")}
            <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: "1.6" }}>
              {summary}
            </p>
          </section>
        )}
        {workExperience.length > 0 && (
          <section style={{ marginBottom: "20px" }}>
            {secH("Work Experience")}
            {workExperience.map((exp) => (
              <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "10.5pt",
                      color: "#0d1117",
                    }}
                  >
                    {exp.title}
                  </span>
                  <span
                    style={{ fontSize: "8.5pt", color: "#666", flexShrink: 0 }}
                  >
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "9.5pt",
                    color: navy,
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.bullets.length > 0 && <Bullets items={exp.bullets} />}
              </div>
            ))}
          </section>
        )}
        {education.length > 0 && (
          <section style={{ marginBottom: "20px" }}>
            {secH("Education")}
            {education.map((edu) => (
              <div key={String(edu.id)} style={{ marginBottom: "8px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "10pt",
                      color: "#0d1117",
                    }}
                  >
                    {edu.institution}
                  </span>
                  <span style={{ fontSize: "8.5pt", color: "#666" }}>
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: "9.5pt", color: "#444", margin: 0 }}>
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ""}
                  {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                </p>
              </div>
            ))}
          </section>
        )}
        {skills.length > 0 && (
          <section style={{ marginBottom: "20px" }}>
            {secH("Skills")}
            {skills.map((cat) => (
              <div key={String(cat.id)} style={{ marginBottom: "6px" }}>
                {cat.category && (
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "9pt",
                      marginRight: "8px",
                      color: "#0d1117",
                    }}
                  >
                    {cat.category}:
                  </span>
                )}
                {cat.skills.map((sk, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skill strings are primitive values
                  <span key={i} style={chip}>
                    {sk}
                  </span>
                ))}
              </div>
            ))}
          </section>
        )}
        {certifications.length > 0 && (
          <section style={{ marginBottom: "20px" }}>
            {secH("Certifications")}
            {certifications.map((cert) => (
              <div
                key={String(cert.id)}
                style={{ marginBottom: "4px", fontSize: "9.5pt" }}
              >
                <span style={{ fontWeight: "600" }}>{cert.name}</span>
                {cert.issuer && (
                  <span style={{ color: "#555" }}> · {cert.issuer}</span>
                )}
                {cert.date && (
                  <span style={{ color: "#777" }}>
                    {" "}
                    · {formatDate(cert.date)}
                  </span>
                )}
              </div>
            ))}
          </section>
        )}
        {projects.length > 0 && (
          <section style={{ marginBottom: "20px" }}>
            {secH("Projects")}
            {projects.map((proj) => (
              <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "10pt",
                    color: "#0d1117",
                    marginBottom: "2px",
                  }}
                >
                  {proj.name}
                  {proj.url && (
                    <span
                      style={{
                        fontWeight: "400",
                        fontSize: "8.5pt",
                        color: "#2e6da0",
                        marginLeft: "8px",
                      }}
                    >
                      {proj.url}
                    </span>
                  )}
                </p>
                {proj.description && (
                  <p
                    style={{
                      fontSize: "9.5pt",
                      color: "#444",
                      marginBottom: "3px",
                    }}
                  >
                    {proj.description}
                  </p>
                )}
                {proj.bullets.length > 0 && <Bullets items={proj.bullets} />}
              </div>
            ))}
          </section>
        )}
        {languages.length > 0 && (
          <section>
            {secH("Languages")}
            <p style={{ fontSize: "9.5pt", color: "#333" }}>
              {languages
                .map(
                  (l) =>
                    `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
                )
                .join(" · ")}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 4. MINIMAL
// ============================================================================
function MinimalTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const h2: React.CSSProperties = {
    fontFamily: "Georgia, serif",
    fontSize: "8.5pt",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#000",
    borderBottom: "1px solid #ddd",
    paddingBottom: "3px",
    marginBottom: "10px",
    marginTop: "20px",
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "Georgia, serif",
        fontSize: "10.5pt",
        lineHeight: "1.6",
        color: "#000",
        padding: "56px 60px",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "28px" }}>
        {pi.name && (
          <h1
            style={{
              fontSize: "28pt",
              fontWeight: "700",
              color: "#000",
              marginBottom: "6px",
            }}
          >
            {pi.name}
          </h1>
        )}
        {pi.jobTitle && (
          <p style={{ fontSize: "11pt", color: "#555", marginBottom: "6px" }}>
            {pi.jobTitle}
          </p>
        )}
        {contacts.length > 0 && (
          <p style={{ fontSize: "8.5pt", color: "#555" }}>
            {contacts.join("  ·  ")}
          </p>
        )}
      </header>
      {summary && (
        <section>
          <h2 style={h2}>Summary</h2>
          <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: "1.65" }}>
            {summary}
          </p>
        </section>
      )}
      {workExperience.length > 0 && (
        <section>
          <h2 style={h2}>Experience</h2>
          {workExperience.map((exp) => (
            <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", fontSize: "10pt" }}>
                  {exp.title}
                </span>
                <span style={{ fontSize: "8.5pt", color: "#555" }}>
                  {formatDate(exp.startDate)} –{" "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <p
                style={{ fontSize: "9pt", color: "#555", marginBottom: "4px" }}
              >
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
              {exp.bullets.length > 0 && <Bullets items={exp.bullets} />}
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section>
          <h2 style={h2}>Education</h2>
          {education.map((edu) => (
            <div key={String(edu.id)} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", fontSize: "10pt" }}>
                  {edu.institution}
                </span>
                <span style={{ fontSize: "8.5pt", color: "#555" }}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </span>
              </div>
              <p style={{ fontSize: "9pt", color: "#555", margin: 0 }}>
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={h2}>Skills</h2>
          {skills.map((cat) => (
            <div
              key={String(cat.id)}
              style={{ marginBottom: "5px", fontSize: "9.5pt" }}
            >
              {cat.category && (
                <span style={{ fontWeight: "700", marginRight: "6px" }}>
                  {cat.category}:
                </span>
              )}
              <span style={{ color: "#333" }}>{cat.skills.join(", ")}</span>
            </div>
          ))}
        </section>
      )}
      {certifications.length > 0 && (
        <section>
          <h2 style={h2}>Certifications</h2>
          {certifications.map((cert) => (
            <div
              key={String(cert.id)}
              style={{ fontSize: "9.5pt", marginBottom: "4px" }}
            >
              <span style={{ fontWeight: "700" }}>{cert.name}</span>
              {cert.issuer && (
                <span style={{ color: "#555" }}> · {cert.issuer}</span>
              )}
              {cert.date && (
                <span style={{ color: "#777" }}>
                  {" "}
                  · {formatDate(cert.date)}
                </span>
              )}
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section>
          <h2 style={h2}>Projects</h2>
          {projects.map((proj) => (
            <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "10pt",
                  marginBottom: "2px",
                }}
              >
                {proj.name}
                {proj.url && (
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "8.5pt",
                      color: "#555",
                      marginLeft: "8px",
                    }}
                  >
                    {proj.url}
                  </span>
                )}
              </p>
              {proj.description && (
                <p
                  style={{
                    fontSize: "9.5pt",
                    color: "#444",
                    marginBottom: "3px",
                  }}
                >
                  {proj.description}
                </p>
              )}
              {proj.bullets.length > 0 && <Bullets items={proj.bullets} />}
            </div>
          ))}
        </section>
      )}
      {languages.length > 0 && (
        <section>
          <h2 style={h2}>Languages</h2>
          <p style={{ fontSize: "9.5pt", color: "#333" }}>
            {languages
              .map(
                (l) =>
                  `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
              )
              .join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// 5. TECH
// ============================================================================
function TechTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const green = "#16a34a";
  const mono = "'Courier New', Courier, monospace";
  const h2: React.CSSProperties = {
    fontFamily: mono,
    fontSize: "9pt",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: green,
    borderLeft: `2px solid ${green}`,
    paddingLeft: "8px",
    marginBottom: "10px",
    marginTop: "18px",
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.55",
        color: "#111",
        padding: "44px 52px",
        background: "#fafff9",
      }}
    >
      <header
        style={{
          borderBottom: `2px solid ${green}`,
          paddingBottom: "16px",
          marginBottom: "4px",
        }}
      >
        {pi.name && (
          <h1
            style={{
              fontFamily: mono,
              fontSize: "22pt",
              fontWeight: "700",
              color: "#111",
              marginBottom: "4px",
            }}
          >
            <span style={{ color: green }}>{">"}</span> {pi.name}
          </h1>
        )}
        {pi.jobTitle && (
          <p
            style={{
              fontFamily: mono,
              fontSize: "10pt",
              color: green,
              marginBottom: "6px",
            }}
          >
            {pi.jobTitle}
          </p>
        )}
        {contacts.length > 0 && (
          <p style={{ fontFamily: mono, fontSize: "8pt", color: "#444" }}>
            {contacts.join(" | ")}
          </p>
        )}
      </header>
      {summary && (
        <section>
          <h2 style={h2}>{"//"} Summary</h2>
          <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: "1.6" }}>
            {summary}
          </p>
        </section>
      )}
      {workExperience.length > 0 && (
        <section>
          <h2 style={h2}>{"//"} Experience</h2>
          {workExperience.map((exp) => (
            <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", fontSize: "10.5pt" }}>
                  {exp.title}
                </span>
                <span
                  style={{ fontFamily: mono, fontSize: "8pt", color: "#555" }}
                >
                  {formatDate(exp.startDate)} —{" "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <p
                style={{
                  fontSize: "9pt",
                  color: green,
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                {exp.company}
                {exp.location ? ` @ ${exp.location}` : ""}
              </p>
              {exp.bullets.length > 0 && <TechBullets items={exp.bullets} />}
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section>
          <h2 style={h2}>{"//"} Education</h2>
          {education.map((edu) => (
            <div key={String(edu.id)} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700" }}>{edu.institution}</span>
                <span
                  style={{ fontFamily: mono, fontSize: "8pt", color: "#555" }}
                >
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </span>
              </div>
              <p style={{ fontSize: "9pt", color: "#444", margin: 0 }}>
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={h2}>{"//"} Skills</h2>
          {skills.map((cat) => (
            <div
              key={String(cat.id)}
              style={{ marginBottom: "5px", fontSize: "9.5pt" }}
            >
              {cat.category && (
                <span
                  style={{
                    fontFamily: mono,
                    fontWeight: "700",
                    color: green,
                    marginRight: "8px",
                  }}
                >
                  {cat.category}:
                </span>
              )}
              <span style={{ color: "#222" }}>{cat.skills.join(" · ")}</span>
            </div>
          ))}
        </section>
      )}
      {certifications.length > 0 && (
        <section>
          <h2 style={h2}>{"//"} Certifications</h2>
          {certifications.map((cert) => (
            <div
              key={String(cert.id)}
              style={{ fontSize: "9.5pt", marginBottom: "4px" }}
            >
              <span style={{ fontWeight: "700" }}>{cert.name}</span>
              {cert.issuer && (
                <span style={{ color: "#555" }}> · {cert.issuer}</span>
              )}
              {cert.date && (
                <span style={{ color: "#777" }}>
                  {" "}
                  · {formatDate(cert.date)}
                </span>
              )}
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section>
          <h2 style={h2}>{"//"} Projects</h2>
          {projects.map((proj) => (
            <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "10pt",
                  marginBottom: "2px",
                }}
              >
                {proj.name}
                {proj.url && (
                  <span
                    style={{
                      fontFamily: mono,
                      fontWeight: "400",
                      fontSize: "8pt",
                      color: green,
                      marginLeft: "8px",
                    }}
                  >
                    {proj.url}
                  </span>
                )}
              </p>
              {proj.description && (
                <p
                  style={{
                    fontSize: "9.5pt",
                    color: "#444",
                    marginBottom: "3px",
                  }}
                >
                  {proj.description}
                </p>
              )}
              {proj.bullets.length > 0 && <TechBullets items={proj.bullets} />}
            </div>
          ))}
        </section>
      )}
      {languages.length > 0 && (
        <section>
          <h2 style={h2}>{"//"} Languages</h2>
          <p style={{ fontSize: "9.5pt", color: "#333" }}>
            {languages
              .map(
                (l) =>
                  `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
              )
              .join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// 6. SIDEBAR
// ============================================================================
function SidebarTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const dark = "#1e293b";
  const mainH2: React.CSSProperties = {
    fontSize: "10pt",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: dark,
    borderBottom: `2px solid ${dark}`,
    paddingBottom: "3px",
    marginBottom: "10px",
    marginTop: "0",
  };
  const sideH: React.CSSProperties = {
    fontSize: "7.5pt",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#94a3b8",
    marginBottom: "6px",
    marginTop: "18px",
  };
  const chip: React.CSSProperties = {
    display: "inline-block",
    background: "#334155",
    borderRadius: "3px",
    padding: "1px 6px",
    marginRight: "3px",
    marginBottom: "3px",
    fontSize: "7.5pt",
    color: "#e2e8f0",
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.55",
        color: "#1a1a2e",
        display: "flex",
        flexDirection: "row",
        padding: "0",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "30%",
          background: dark,
          color: "white",
          padding: "36px 24px",
          flexShrink: 0,
        }}
      >
        {pi.name && (
          <h1
            style={{
              fontSize: "16pt",
              fontWeight: "800",
              color: "white",
              marginBottom: "4px",
              lineHeight: "1.2",
            }}
          >
            {pi.name}
          </h1>
        )}
        {pi.jobTitle && (
          <p
            style={{ fontSize: "9pt", color: "#94a3b8", marginBottom: "16px" }}
          >
            {pi.jobTitle}
          </p>
        )}
        {contacts.length > 0 && (
          <div>
            <p style={sideH}>Contact</p>
            {contacts.map((c) => (
              <p
                key={c}
                style={{
                  fontSize: "8pt",
                  color: "#cbd5e1",
                  marginBottom: "3px",
                  wordBreak: "break-all",
                }}
              >
                {c}
              </p>
            ))}
          </div>
        )}
        {skills.length > 0 && (
          <div>
            <p style={sideH}>Skills</p>
            {skills.map((cat) => (
              <div key={String(cat.id)} style={{ marginBottom: "8px" }}>
                {cat.category && (
                  <p
                    style={{
                      fontSize: "8pt",
                      fontWeight: "600",
                      color: "#94a3b8",
                      marginBottom: "3px",
                    }}
                  >
                    {cat.category}
                  </p>
                )}
                {cat.skills.map((sk, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skill strings are primitive values
                  <span key={i} style={chip}>
                    {sk}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
        {languages.length > 0 && (
          <div style={{ marginTop: "8px" }}>
            <p style={sideH}>Languages</p>
            {languages.map((l) => (
              <p
                key={l.language}
                style={{
                  fontSize: "8pt",
                  color: "#cbd5e1",
                  marginBottom: "3px",
                }}
              >
                {l.language}
                {l.proficiency ? ` · ${l.proficiency}` : ""}
              </p>
            ))}
          </div>
        )}
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: "36px 36px 36px 32px" }}>
        {summary && (
          <section style={{ marginBottom: "18px" }}>
            <h2 style={mainH2}>Summary</h2>
            <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: "1.6" }}>
              {summary}
            </p>
          </section>
        )}
        {workExperience.length > 0 && (
          <section style={{ marginBottom: "18px" }}>
            <h2 style={mainH2}>Experience</h2>
            {workExperience.map((exp) => (
              <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "10.5pt",
                      color: "#0d1117",
                    }}
                  >
                    {exp.title}
                  </span>
                  <span
                    style={{ fontSize: "8pt", color: "#666", flexShrink: 0 }}
                  >
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "9pt",
                    color: "#475569",
                    marginBottom: "4px",
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.bullets.length > 0 && <Bullets items={exp.bullets} />}
              </div>
            ))}
          </section>
        )}
        {education.length > 0 && (
          <section style={{ marginBottom: "18px" }}>
            <h2 style={mainH2}>Education</h2>
            {education.map((edu) => (
              <div key={String(edu.id)} style={{ marginBottom: "8px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontWeight: "700" }}>{edu.institution}</span>
                  <span style={{ fontSize: "8pt", color: "#666" }}>
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: "9pt", color: "#475569", margin: 0 }}>
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ""}
                  {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                </p>
              </div>
            ))}
          </section>
        )}
        {certifications.length > 0 && (
          <section style={{ marginBottom: "18px" }}>
            <h2 style={mainH2}>Certifications</h2>
            {certifications.map((cert) => (
              <div
                key={String(cert.id)}
                style={{ fontSize: "9.5pt", marginBottom: "4px" }}
              >
                <span style={{ fontWeight: "600" }}>{cert.name}</span>
                {cert.issuer && (
                  <span style={{ color: "#555" }}> · {cert.issuer}</span>
                )}
                {cert.date && (
                  <span style={{ color: "#777" }}>
                    {" "}
                    · {formatDate(cert.date)}
                  </span>
                )}
              </div>
            ))}
          </section>
        )}
        {projects.length > 0 && (
          <section>
            <h2 style={mainH2}>Projects</h2>
            {projects.map((proj) => (
              <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "10pt",
                    marginBottom: "2px",
                  }}
                >
                  {proj.name}
                  {proj.url && (
                    <span
                      style={{
                        fontWeight: "400",
                        fontSize: "8pt",
                        color: "#2e6da0",
                        marginLeft: "8px",
                      }}
                    >
                      {proj.url}
                    </span>
                  )}
                </p>
                {proj.description && (
                  <p
                    style={{
                      fontSize: "9.5pt",
                      color: "#444",
                      marginBottom: "3px",
                    }}
                  >
                    {proj.description}
                  </p>
                )}
                {proj.bullets.length > 0 && <Bullets items={proj.bullets} />}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 7. ELEGANT
// ============================================================================
function ElegantTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const gold = "#b45309";
  const h2: React.CSSProperties = {
    fontFamily: "Georgia, serif",
    fontSize: "11pt",
    fontWeight: "400",
    fontStyle: "italic",
    color: gold,
    marginBottom: "8px",
    marginTop: "20px",
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "Georgia, serif",
        fontSize: "10.5pt",
        lineHeight: "1.6",
        color: "#1a1a1a",
        padding: "52px 56px",
      }}
    >
      <header
        style={{
          textAlign: "center",
          borderBottom: `1.5px solid ${gold}`,
          paddingBottom: "20px",
          marginBottom: "4px",
        }}
      >
        {pi.name && (
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "28pt",
              fontWeight: "700",
              color: "#111",
              marginBottom: "6px",
              letterSpacing: "0.02em",
            }}
          >
            {pi.name}
          </h1>
        )}
        {pi.jobTitle && (
          <p
            style={{
              fontSize: "12pt",
              color: gold,
              marginBottom: "8px",
              fontStyle: "italic",
            }}
          >
            {pi.jobTitle}
          </p>
        )}
        {contacts.length > 0 && (
          <p style={{ fontSize: "8.5pt", color: "#666" }}>
            {contacts.join("  ·  ")}
          </p>
        )}
      </header>
      {summary && (
        <section>
          <h2 style={h2}>Professional Summary</h2>
          <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: "1.65" }}>
            {summary}
          </p>
        </section>
      )}
      {workExperience.length > 0 && (
        <section>
          <h2 style={h2}>Work Experience</h2>
          {workExperience.map((exp) => (
            <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontWeight: "700",
                    fontSize: "10.5pt",
                    color: "#111",
                  }}
                >
                  {exp.title}
                </span>
                <span
                  style={{
                    fontSize: "8.5pt",
                    color: "#777",
                    fontStyle: "italic",
                  }}
                >
                  {formatDate(exp.startDate)} –{" "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <p
                style={{ fontSize: "9.5pt", color: gold, marginBottom: "4px" }}
              >
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
              {exp.bullets.length > 0 && <Bullets items={exp.bullets} />}
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section>
          <h2 style={h2}>Education</h2>
          {education.map((edu) => (
            <div key={String(edu.id)} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700" }}>{edu.institution}</span>
                <span
                  style={{
                    fontSize: "8.5pt",
                    color: "#777",
                    fontStyle: "italic",
                  }}
                >
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </span>
              </div>
              <p style={{ fontSize: "9.5pt", color: "#555", margin: 0 }}>
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={h2}>Skills</h2>
          {skills.map((cat) => (
            <div
              key={String(cat.id)}
              style={{ marginBottom: "6px", fontSize: "9.5pt" }}
            >
              {cat.category && (
                <span
                  style={{
                    fontWeight: "700",
                    color: "#111",
                    marginRight: "8px",
                  }}
                >
                  {cat.category}:
                </span>
              )}
              <span style={{ color: "#444" }}>{cat.skills.join(", ")}</span>
            </div>
          ))}
        </section>
      )}
      {certifications.length > 0 && (
        <section>
          <h2 style={h2}>Certifications</h2>
          {certifications.map((cert) => (
            <div
              key={String(cert.id)}
              style={{ fontSize: "9.5pt", marginBottom: "4px" }}
            >
              <span style={{ fontWeight: "700" }}>{cert.name}</span>
              {cert.issuer && (
                <span style={{ color: "#666" }}> · {cert.issuer}</span>
              )}
              {cert.date && (
                <span style={{ color: "#888" }}>
                  {" "}
                  · {formatDate(cert.date)}
                </span>
              )}
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section>
          <h2 style={h2}>Projects</h2>
          {projects.map((proj) => (
            <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "10pt",
                  marginBottom: "2px",
                }}
              >
                {proj.name}
                {proj.url && (
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "8.5pt",
                      color: gold,
                      marginLeft: "8px",
                    }}
                  >
                    {proj.url}
                  </span>
                )}
              </p>
              {proj.description && (
                <p
                  style={{
                    fontSize: "9.5pt",
                    color: "#444",
                    marginBottom: "3px",
                  }}
                >
                  {proj.description}
                </p>
              )}
              {proj.bullets.length > 0 && <Bullets items={proj.bullets} />}
            </div>
          ))}
        </section>
      )}
      {languages.length > 0 && (
        <section>
          <h2 style={h2}>Languages</h2>
          <p style={{ fontSize: "9.5pt", color: "#444" }}>
            {languages
              .map(
                (l) =>
                  `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
              )
              .join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// 8. BOLD
// ============================================================================
function BoldTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const teal = "#0d9488";
  const tealDark = "#0f766e";
  const h2: React.CSSProperties = {
    fontSize: "11.5pt",
    fontWeight: "800",
    color: teal,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: `2px solid ${teal}`,
    paddingBottom: "3px",
    marginBottom: "10px",
    marginTop: "20px",
  };
  const chip: React.CSSProperties = {
    display: "inline-block",
    background: "#f0fdfa",
    border: `1px solid ${teal}`,
    borderRadius: "3px",
    padding: "1px 8px",
    marginRight: "4px",
    marginBottom: "4px",
    fontSize: "8.5pt",
    color: teal,
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: "10.5pt",
        lineHeight: "1.55",
        color: "#111",
        padding: "0",
      }}
    >
      <header
        style={{ background: teal, color: "white", padding: "28px 48px 20px" }}
      >
        {pi.name && (
          <h1
            style={{
              fontSize: "32pt",
              fontWeight: "900",
              color: "white",
              marginBottom: "4px",
              letterSpacing: "-0.5px",
              lineHeight: "1.1",
            }}
          >
            {pi.name}
          </h1>
        )}
        {pi.jobTitle && (
          <p style={{ fontSize: "12pt", color: "#ccfbf1", fontWeight: "500" }}>
            {pi.jobTitle}
          </p>
        )}
      </header>
      {contacts.length > 0 && (
        <div
          style={{
            background: tealDark,
            color: "#e0fdf4",
            padding: "8px 48px",
            fontSize: "8.5pt",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {contacts.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      )}
      <div style={{ padding: "24px 48px" }}>
        {summary && (
          <section>
            <h2 style={h2}>Summary</h2>
            <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: "1.65" }}>
              {summary}
            </p>
          </section>
        )}
        {workExperience.length > 0 && (
          <section>
            <h2 style={h2}>Experience</h2>
            {workExperience.map((exp) => (
              <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontWeight: "800",
                      fontSize: "11pt",
                      color: "#111",
                    }}
                  >
                    {exp.title}
                  </span>
                  <span style={{ fontSize: "8.5pt", color: "#666" }}>
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "9.5pt",
                    color: teal,
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.bullets.length > 0 && <Bullets items={exp.bullets} />}
              </div>
            ))}
          </section>
        )}
        {education.length > 0 && (
          <section>
            <h2 style={h2}>Education</h2>
            {education.map((edu) => (
              <div key={String(edu.id)} style={{ marginBottom: "8px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontWeight: "700" }}>{edu.institution}</span>
                  <span style={{ fontSize: "8.5pt", color: "#666" }}>
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: "9.5pt", color: "#444", margin: 0 }}>
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ""}
                  {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                </p>
              </div>
            ))}
          </section>
        )}
        {skills.length > 0 && (
          <section>
            <h2 style={h2}>Skills</h2>
            {skills.map((cat) => (
              <div key={String(cat.id)} style={{ marginBottom: "6px" }}>
                {cat.category && (
                  <span
                    style={{
                      fontWeight: "700",
                      marginRight: "8px",
                      color: "#111",
                    }}
                  >
                    {cat.category}:
                  </span>
                )}
                {cat.skills.map((sk, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skill strings are primitive values
                  <span key={i} style={chip}>
                    {sk}
                  </span>
                ))}
              </div>
            ))}
          </section>
        )}
        {certifications.length > 0 && (
          <section>
            <h2 style={h2}>Certifications</h2>
            {certifications.map((cert) => (
              <div
                key={String(cert.id)}
                style={{ fontSize: "9.5pt", marginBottom: "4px" }}
              >
                <span style={{ fontWeight: "700" }}>{cert.name}</span>
                {cert.issuer && (
                  <span style={{ color: "#555" }}> · {cert.issuer}</span>
                )}
                {cert.date && (
                  <span style={{ color: "#777" }}>
                    {" "}
                    · {formatDate(cert.date)}
                  </span>
                )}
              </div>
            ))}
          </section>
        )}
        {projects.length > 0 && (
          <section>
            <h2 style={h2}>Projects</h2>
            {projects.map((proj) => (
              <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "10pt",
                    marginBottom: "2px",
                  }}
                >
                  {proj.name}
                  {proj.url && (
                    <span
                      style={{
                        fontWeight: "400",
                        fontSize: "8.5pt",
                        color: teal,
                        marginLeft: "8px",
                      }}
                    >
                      {proj.url}
                    </span>
                  )}
                </p>
                {proj.description && (
                  <p
                    style={{
                      fontSize: "9.5pt",
                      color: "#444",
                      marginBottom: "3px",
                    }}
                  >
                    {proj.description}
                  </p>
                )}
                {proj.bullets.length > 0 && <Bullets items={proj.bullets} />}
              </div>
            ))}
          </section>
        )}
        {languages.length > 0 && (
          <section>
            <h2 style={h2}>Languages</h2>
            <p style={{ fontSize: "9.5pt", color: "#333" }}>
              {languages
                .map(
                  (l) =>
                    `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
                )
                .join(" · ")}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 9. CORPORATE
// ============================================================================
function CorporateTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const h2: React.CSSProperties = {
    fontSize: "9.5pt",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#111",
    textAlign: "center",
    borderTop: "1.5px solid #222",
    borderBottom: "1.5px solid #222",
    padding: "4px 0",
    marginBottom: "10px",
    marginTop: "20px",
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: "10.5pt",
        lineHeight: "1.55",
        color: "#111",
        padding: "52px 56px",
      }}
    >
      <header
        style={{
          textAlign: "center",
          borderBottom: "2px solid #111",
          paddingBottom: "16px",
          marginBottom: "4px",
        }}
      >
        {pi.name && (
          <h1
            style={{
              fontSize: "26pt",
              fontWeight: "800",
              color: "#111",
              marginBottom: "4px",
              letterSpacing: "0.02em",
            }}
          >
            {pi.name}
          </h1>
        )}
        {pi.jobTitle && (
          <p style={{ fontSize: "11pt", color: "#444", marginBottom: "6px" }}>
            {pi.jobTitle}
          </p>
        )}
        {contacts.length > 0 && (
          <p style={{ fontSize: "8.5pt", color: "#444" }}>
            {contacts.join("  ·  ")}
          </p>
        )}
      </header>
      {summary && (
        <section>
          <h2 style={h2}>Professional Summary</h2>
          <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: "1.65" }}>
            {summary}
          </p>
        </section>
      )}
      {workExperience.length > 0 && (
        <section>
          <h2 style={h2}>Professional Experience</h2>
          {workExperience.map((exp) => (
            <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", fontSize: "10.5pt" }}>
                  {exp.title}
                </span>
                <span style={{ fontSize: "8.5pt", color: "#555" }}>
                  {formatDate(exp.startDate)} –{" "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <p
                style={{
                  fontSize: "9.5pt",
                  color: "#333",
                  fontStyle: "italic",
                  marginBottom: "4px",
                }}
              >
                {exp.company}
                {exp.location ? `, ${exp.location}` : ""}
              </p>
              {exp.bullets.length > 0 && <Bullets items={exp.bullets} />}
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section>
          <h2 style={h2}>Education</h2>
          {education.map((edu) => (
            <div key={String(edu.id)} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700" }}>{edu.institution}</span>
                <span style={{ fontSize: "8.5pt", color: "#555" }}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </span>
              </div>
              <p
                style={{
                  fontSize: "9.5pt",
                  fontStyle: "italic",
                  color: "#444",
                  margin: 0,
                }}
              >
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={h2}>Core Competencies</h2>
          {skills.map((cat) => (
            <div
              key={String(cat.id)}
              style={{ marginBottom: "5px", fontSize: "9.5pt" }}
            >
              {cat.category && (
                <span style={{ fontWeight: "700", marginRight: "8px" }}>
                  {cat.category}:
                </span>
              )}
              <span style={{ color: "#333" }}>{cat.skills.join(", ")}</span>
            </div>
          ))}
        </section>
      )}
      {certifications.length > 0 && (
        <section>
          <h2 style={h2}>Certifications</h2>
          {certifications.map((cert) => (
            <div
              key={String(cert.id)}
              style={{ fontSize: "9.5pt", marginBottom: "4px" }}
            >
              <span style={{ fontWeight: "700" }}>{cert.name}</span>
              {cert.issuer && (
                <span style={{ color: "#555" }}> · {cert.issuer}</span>
              )}
              {cert.date && (
                <span style={{ color: "#777" }}>
                  {" "}
                  · {formatDate(cert.date)}
                </span>
              )}
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section>
          <h2 style={h2}>Key Projects</h2>
          {projects.map((proj) => (
            <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "10pt",
                  marginBottom: "2px",
                }}
              >
                {proj.name}
                {proj.url && (
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "8.5pt",
                      color: "#555",
                      marginLeft: "8px",
                    }}
                  >
                    {proj.url}
                  </span>
                )}
              </p>
              {proj.description && (
                <p
                  style={{
                    fontSize: "9.5pt",
                    color: "#444",
                    marginBottom: "3px",
                  }}
                >
                  {proj.description}
                </p>
              )}
              {proj.bullets.length > 0 && <Bullets items={proj.bullets} />}
            </div>
          ))}
        </section>
      )}
      {languages.length > 0 && (
        <section>
          <h2 style={h2}>Languages</h2>
          <p style={{ fontSize: "9.5pt", color: "#333" }}>
            {languages
              .map(
                (l) =>
                  `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
              )
              .join("  ·  ")}
          </p>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// 10. ACADEMIC
// ============================================================================
function AcademicTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const h2: React.CSSProperties = {
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "11pt",
    fontWeight: "700",
    color: "#111",
    textDecoration: "underline",
    marginBottom: "8px",
    marginTop: "18px",
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: "10.5pt",
        lineHeight: "1.6",
        color: "#000",
        padding: "52px 56px",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        {pi.name && (
          <h1
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: "24pt",
              fontWeight: "700",
              color: "#000",
              marginBottom: "4px",
            }}
          >
            {pi.name}
          </h1>
        )}
        {pi.jobTitle && (
          <p style={{ fontSize: "11pt", color: "#333", marginBottom: "4px" }}>
            {pi.jobTitle}
          </p>
        )}
        {contacts.length > 0 && (
          <p style={{ fontSize: "8.5pt", color: "#444" }}>
            {contacts.join(" · ")}
          </p>
        )}
      </header>
      {summary && (
        <section>
          <h2 style={h2}>Research Interests / Summary</h2>
          <p style={{ fontSize: "9.5pt", color: "#222", lineHeight: "1.65" }}>
            {summary}
          </p>
        </section>
      )}
      {education.length > 0 && (
        <section>
          <h2 style={h2}>Education</h2>
          {education.map((edu) => (
            <div key={String(edu.id)} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", fontSize: "10.5pt" }}>
                  {edu.institution}
                </span>
                <span style={{ fontSize: "8.5pt", color: "#555" }}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </span>
              </div>
              <p style={{ fontSize: "9.5pt", color: "#333", margin: 0 }}>
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` — GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </section>
      )}
      {workExperience.length > 0 && (
        <section>
          <h2 style={h2}>Academic &amp; Professional Experience</h2>
          {workExperience.map((exp) => (
            <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", fontSize: "10.5pt" }}>
                  {exp.company}
                </span>
                <span style={{ fontSize: "8.5pt", color: "#555" }}>
                  {formatDate(exp.startDate)} –{" "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <p
                style={{
                  fontSize: "10pt",
                  color: "#222",
                  fontStyle: "italic",
                  marginBottom: "4px",
                }}
              >
                {exp.title}
                {exp.location ? `, ${exp.location}` : ""}
              </p>
              {exp.bullets.length > 0 && (
                <Bullets items={exp.bullets} color="#222" indent={16} />
              )}
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section>
          <h2 style={h2}>Research &amp; Projects</h2>
          {projects.map((proj) => (
            <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "10pt",
                  marginBottom: "2px",
                }}
              >
                {proj.name}
                {proj.url && (
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "8.5pt",
                      color: "#555",
                      marginLeft: "8px",
                    }}
                  >
                    {proj.url}
                  </span>
                )}
              </p>
              {proj.description && (
                <p
                  style={{
                    fontSize: "9.5pt",
                    color: "#333",
                    marginBottom: "3px",
                  }}
                >
                  {proj.description}
                </p>
              )}
              {proj.bullets.length > 0 && (
                <Bullets items={proj.bullets} color="#222" indent={16} />
              )}
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={h2}>Technical Skills</h2>
          {skills.map((cat) => (
            <div
              key={String(cat.id)}
              style={{ marginBottom: "5px", fontSize: "9.5pt" }}
            >
              {cat.category && (
                <span style={{ fontWeight: "700", marginRight: "8px" }}>
                  {cat.category}:
                </span>
              )}
              <span style={{ color: "#222" }}>{cat.skills.join(", ")}</span>
            </div>
          ))}
        </section>
      )}
      {certifications.length > 0 && (
        <section>
          <h2 style={h2}>Certifications &amp; Awards</h2>
          {certifications.map((cert) => (
            <div
              key={String(cert.id)}
              style={{ fontSize: "9.5pt", marginBottom: "4px" }}
            >
              <span style={{ fontWeight: "700" }}>{cert.name}</span>
              {cert.issuer && (
                <span style={{ color: "#555" }}> · {cert.issuer}</span>
              )}
              {cert.date && (
                <span style={{ color: "#777" }}>
                  {" "}
                  · {formatDate(cert.date)}
                </span>
              )}
            </div>
          ))}
        </section>
      )}
      {languages.length > 0 && (
        <section>
          <h2 style={h2}>Languages</h2>
          <p style={{ fontSize: "9.5pt", color: "#222" }}>
            {languages
              .map(
                (l) =>
                  `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
              )
              .join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
}

function PhotoModernTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const accent = "#1a56a8";
  const heading: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "9.5pt",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: accent,
    marginBottom: "8px",
  };
  const divider: React.CSSProperties = {
    borderTop: "1px solid #e0e4ef",
    margin: "16px 0 12px",
  };
  const jobRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1px",
  };
  const jobTitle: React.CSSProperties = {
    fontWeight: "700",
    fontSize: "10.5pt",
    color: "#0d1117",
  };
  const dateStyle: React.CSSProperties = {
    fontSize: "8.5pt",
    color: "#666",
    flexShrink: 0,
  };
  const chip: React.CSSProperties = {
    display: "inline-block",
    background: "#e8f0fe",
    borderRadius: "3px",
    padding: "1px 7px",
    marginRight: "4px",
    marginBottom: "4px",
    fontSize: "8.5pt",
    color: "#1a56a8",
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
        fontSize: "10.5pt",
        lineHeight: "1.5",
        color: "#1a1a2e",
        padding: "48px 52px",
      }}
    >
      <header
        style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}
      >
        {/* Profile Photo */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            background: "#e8f0fe",
            border: `3px solid ${accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {pi.photoUrl ? (
            <img
              src={pi.photoUrl}
              alt={pi.name || "Profile"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: "28pt", color: accent, lineHeight: 1 }}>
              &#9786;
            </span>
          )}
        </div>
        {/* Name & Title */}
        <div style={{ flex: 1 }}>
          {pi.name && (
            <h1
              style={{
                fontSize: "22pt",
                fontWeight: "800",
                letterSpacing: "-0.3px",
                color: "#0d1117",
                marginBottom: "2px",
                lineHeight: "1.15",
              }}
            >
              {pi.name}
            </h1>
          )}
          {pi.jobTitle && (
            <p
              style={{
                fontSize: "12pt",
                fontWeight: "500",
                color: accent,
                marginBottom: "6px",
              }}
            >
              {pi.jobTitle}
            </p>
          )}
          {contacts.length > 0 && (
            <p style={{ fontSize: "8.5pt", color: "#555" }}>
              {contacts.join(" · ")}
            </p>
          )}
        </div>
      </header>
      {summary && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Professional Summary</h2>
          <p
            style={{ fontSize: "9.5pt", color: "#2a2a3e", lineHeight: "1.55" }}
          >
            {summary}
          </p>
        </section>
      )}
      {workExperience.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Work Experience</h2>
          {workExperience.map((exp) => (
            <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
              <div style={jobRow}>
                <span style={jobTitle}>{exp.title}</span>
                <span style={dateStyle}>
                  {formatDate(exp.startDate)} –{" "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <p
                style={{
                  fontSize: "9.5pt",
                  color: "#444",
                  marginBottom: "4px",
                }}
              >
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
              {exp.bullets.length > 0 && (
                <Bullets items={exp.bullets} color="#2a2a3e" />
              )}
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Education</h2>
          {education.map((edu) => (
            <div key={String(edu.id)} style={{ marginBottom: "8px" }}>
              <div style={jobRow}>
                <span style={jobTitle}>{edu.institution}</span>
                <span style={dateStyle}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </span>
              </div>
              <p style={{ fontSize: "9pt", color: "#444", margin: 0 }}>
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Skills</h2>
          {skills.map((cat) => (
            <div key={String(cat.id)} style={{ marginBottom: "6px" }}>
              {cat.category && (
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "9pt",
                    marginRight: "8px",
                  }}
                >
                  {cat.category}:
                </span>
              )}
              {cat.skills.map((sk, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skill strings are primitive values
                <span key={i} style={chip}>
                  {sk}
                </span>
              ))}
            </div>
          ))}
        </section>
      )}
      {certifications.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Certifications</h2>
          {certifications.map((cert) => (
            <div
              key={String(cert.id)}
              style={{ fontSize: "9.5pt", marginBottom: "4px" }}
            >
              <span style={{ fontWeight: "600" }}>{cert.name}</span>
              {cert.issuer && (
                <span style={{ color: "#555" }}> · {cert.issuer}</span>
              )}
              {cert.date && (
                <span style={{ color: "#777" }}>
                  {" "}
                  · {formatDate(cert.date)}
                </span>
              )}
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Projects</h2>
          {projects.map((proj) => (
            <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "10pt",
                  marginBottom: "2px",
                }}
              >
                {proj.name}
                {proj.url && (
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "8pt",
                      color: accent,
                      marginLeft: "8px",
                    }}
                  >
                    {proj.url}
                  </span>
                )}
              </p>
              {proj.description && (
                <p
                  style={{
                    fontSize: "9pt",
                    color: "#444",
                    marginBottom: "2px",
                  }}
                >
                  {proj.description}
                </p>
              )}
              {proj.bullets.length > 0 && (
                <Bullets items={proj.bullets} color="#2a2a3e" />
              )}
            </div>
          ))}
        </section>
      )}
      {languages.length > 0 && (
        <section>
          <div style={divider} />
          <h2 style={heading}>Languages</h2>
          <p style={{ fontSize: "9.5pt", color: "#2a2a3e" }}>
            {languages
              .map(
                (l) =>
                  `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
              )
              .join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
}

function PhotoSidebarTemplate({ resume }: TplProps) {
  const {
    personalInfo: pi,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = resume;
  const contacts = contactStr(pi);
  const dark = "#0f2044";
  const mainH2: React.CSSProperties = {
    fontSize: "10pt",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: dark,
    borderBottom: `2px solid ${dark}`,
    paddingBottom: "3px",
    marginBottom: "10px",
    marginTop: "0",
  };
  const sideH: React.CSSProperties = {
    fontSize: "7.5pt",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    letterSpacing: "0.14em",
    color: "#7fa8d4",
    marginBottom: "6px",
    marginTop: "18px",
  };
  const chip: React.CSSProperties = {
    display: "inline-block",
    background: "#1a3a6e",
    borderRadius: "3px",
    padding: "1px 6px",
    marginRight: "3px",
    marginBottom: "3px",
    fontSize: "7.5pt",
    color: "#cfe2ff",
  };

  return (
    <div
      id="resume-print-target"
      style={{
        ...paperBase,
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.55",
        color: "#1a1a2e",
        display: "flex",
        flexDirection: "row",
        padding: "0",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "30%",
          background: dark,
          color: "white",
          padding: "36px 20px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Profile Photo */}
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #7fa8d4",
            background: "#1a3a6e",
            marginBottom: "16px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {pi.photoUrl ? (
            <img
              src={pi.photoUrl}
              alt={pi.name || "Profile"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: "38pt", color: "#7fa8d4", lineHeight: 1 }}>
              &#9786;
            </span>
          )}
        </div>
        {/* Name & Title */}
        <div style={{ textAlign: "center", width: "100%" }}>
          {pi.name && (
            <h1
              style={{
                fontSize: "14pt",
                fontWeight: "800",
                color: "white",
                marginBottom: "4px",
                lineHeight: "1.2",
              }}
            >
              {pi.name}
            </h1>
          )}
          {pi.jobTitle && (
            <p
              style={{
                fontSize: "8.5pt",
                color: "#7fa8d4",
                marginBottom: "16px",
              }}
            >
              {pi.jobTitle}
            </p>
          )}
        </div>
        {contacts.length > 0 && (
          <div style={{ width: "100%" }}>
            <p style={sideH}>Contact</p>
            {contacts.map((c) => (
              <p
                key={c}
                style={{
                  fontSize: "7.5pt",
                  color: "#b8d4f0",
                  marginBottom: "3px",
                  wordBreak: "break-all",
                }}
              >
                {c}
              </p>
            ))}
          </div>
        )}
        {skills.length > 0 && (
          <div style={{ width: "100%" }}>
            <p style={sideH}>Skills</p>
            {skills.map((cat) => (
              <div key={String(cat.id)} style={{ marginBottom: "8px" }}>
                {cat.category && (
                  <p
                    style={{
                      fontSize: "8pt",
                      fontWeight: "600",
                      color: "#7fa8d4",
                      marginBottom: "3px",
                    }}
                  >
                    {cat.category}
                  </p>
                )}
                {cat.skills.map((sk, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skill strings are primitive values
                  <span key={i} style={chip}>
                    {sk}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
        {languages.length > 0 && (
          <div style={{ width: "100%", marginTop: "8px" }}>
            <p style={sideH}>Languages</p>
            {languages.map((l) => (
              <p
                key={l.language}
                style={{
                  fontSize: "8pt",
                  color: "#b8d4f0",
                  marginBottom: "3px",
                }}
              >
                {l.language}
                {l.proficiency ? ` · ${l.proficiency}` : ""}
              </p>
            ))}
          </div>
        )}
      </div>
      {/* Main content */}
      <div style={{ flex: 1, padding: "36px 36px 36px 32px" }}>
        {summary && (
          <section style={{ marginBottom: "18px" }}>
            <h2 style={mainH2}>Summary</h2>
            <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: "1.6" }}>
              {summary}
            </p>
          </section>
        )}
        {workExperience.length > 0 && (
          <section style={{ marginBottom: "18px" }}>
            <h2 style={mainH2}>Experience</h2>
            {workExperience.map((exp) => (
              <div key={String(exp.id)} style={{ marginBottom: "14px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "10.5pt",
                      color: "#0d1117",
                    }}
                  >
                    {exp.title}
                  </span>
                  <span
                    style={{ fontSize: "8pt", color: "#666", flexShrink: 0 }}
                  >
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "9pt",
                    color: "#475569",
                    marginBottom: "4px",
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.bullets.length > 0 && <Bullets items={exp.bullets} />}
              </div>
            ))}
          </section>
        )}
        {education.length > 0 && (
          <section style={{ marginBottom: "18px" }}>
            <h2 style={mainH2}>Education</h2>
            {education.map((edu) => (
              <div key={String(edu.id)} style={{ marginBottom: "8px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontWeight: "700" }}>{edu.institution}</span>
                  <span style={{ fontSize: "8pt", color: "#666" }}>
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: "9pt", color: "#475569", margin: 0 }}>
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ""}
                  {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                </p>
              </div>
            ))}
          </section>
        )}
        {certifications.length > 0 && (
          <section style={{ marginBottom: "18px" }}>
            <h2 style={mainH2}>Certifications</h2>
            {certifications.map((cert) => (
              <div
                key={String(cert.id)}
                style={{ fontSize: "9.5pt", marginBottom: "4px" }}
              >
                <span style={{ fontWeight: "600" }}>{cert.name}</span>
                {cert.issuer && (
                  <span style={{ color: "#555" }}> · {cert.issuer}</span>
                )}
                {cert.date && (
                  <span style={{ color: "#777" }}>
                    {" "}
                    · {formatDate(cert.date)}
                  </span>
                )}
              </div>
            ))}
          </section>
        )}
        {projects.length > 0 && (
          <section>
            <h2 style={mainH2}>Projects</h2>
            {projects.map((proj) => (
              <div key={String(proj.id)} style={{ marginBottom: "10px" }}>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "10pt",
                    marginBottom: "2px",
                  }}
                >
                  {proj.name}
                  {proj.url && (
                    <span
                      style={{
                        fontWeight: "400",
                        fontSize: "8pt",
                        color: "#1a56a8",
                        marginLeft: "8px",
                      }}
                    >
                      {proj.url}
                    </span>
                  )}
                </p>
                {proj.description && (
                  <p
                    style={{
                      fontSize: "9pt",
                      color: "#444",
                      marginBottom: "2px",
                    }}
                  >
                    {proj.description}
                  </p>
                )}
                {proj.bullets.length > 0 && <Bullets items={proj.bullets} />}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
