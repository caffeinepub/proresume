import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Award,
  Briefcase,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Globe,
  GraduationCap,
  Layers,
  Lightbulb,
  Palette,
  PencilLine,
  Printer,
  Sparkles,
  Target,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import type { ResumeData } from "../backend";
import { SAMPLE_RESUME } from "../data/sampleResume";
import { calculateATSScore } from "../utils/atsScore";
import { AIAssistantPanel } from "./AIAssistantPanel";
import { ATSGauge } from "./ATSGauge";
import { CustomerCareWidget } from "./CustomerCareWidget";
import { EditorSidebar } from "./EditorSidebar";
import { PaywallScreen } from "./PaywallScreen";
import { ResumePreview } from "./ResumePreview";
import { CertificationsEditor } from "./editors/CertificationsEditor";
import { EducationEditor } from "./editors/EducationEditor";
import { LanguagesEditor } from "./editors/LanguagesEditor";
import { PersonalInfoEditor } from "./editors/PersonalInfoEditor";
import { ProjectsEditor } from "./editors/ProjectsEditor";
import { SkillsEditor } from "./editors/SkillsEditor";
import { SummaryEditor } from "./editors/SummaryEditor";
import { TargetJobEditor } from "./editors/TargetJobEditor";
import { WorkExperienceEditor } from "./editors/WorkExperienceEditor";

export type Section =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "projects"
  | "languages"
  | "target"
  | "templates";

export type Template =
  | "classic"
  | "modern"
  | "executive"
  | "minimal"
  | "tech"
  | "sidebar"
  | "elegant"
  | "bold"
  | "corporate"
  | "academic"
  | "photo-modern"
  | "photo-sidebar";

const SECTION_TITLES: Record<Section, string> = {
  personal: "Personal Information",
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  projects: "Projects",
  languages: "Languages",
  target: "Target Job Description",
  templates: "Choose Template",
};

const SECTIONS_LIST: {
  id: Section;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "personal",
    label: "Personal Information",
    shortLabel: "Personal",
    icon: User,
  },
  {
    id: "summary",
    label: "Professional Summary",
    shortLabel: "Summary",
    icon: FileText,
  },
  {
    id: "experience",
    label: "Work Experience",
    shortLabel: "Experience",
    icon: Briefcase,
  },
  {
    id: "education",
    label: "Education",
    shortLabel: "Education",
    icon: GraduationCap,
  },
  { id: "skills", label: "Skills", shortLabel: "Skills", icon: Lightbulb },
  {
    id: "certifications",
    label: "Certifications",
    shortLabel: "Certs",
    icon: Award,
  },
  {
    id: "projects",
    label: "Projects",
    shortLabel: "Projects",
    icon: FolderOpen,
  },
  { id: "languages", label: "Languages", shortLabel: "Languages", icon: Globe },
  { id: "target", label: "Target Job", shortLabel: "Target Job", icon: Target },
  {
    id: "templates",
    label: "Templates",
    shortLabel: "Templates",
    icon: Palette,
  },
];

const TEMPLATES: { id: Template; label: string; description: string }[] = [
  { id: "modern", label: "Modern", description: "Clean lines, sidebar accent" },
  { id: "classic", label: "Classic", description: "Traditional, ATS-safe" },
  {
    id: "executive",
    label: "Executive",
    description: "Polished, leadership focus",
  },
  { id: "minimal", label: "Minimal", description: "Pure white space, simple" },
  { id: "tech", label: "Tech", description: "Code-inspired, structured" },
  {
    id: "sidebar",
    label: "Sidebar",
    description: "Two-column with color sidebar",
  },
  { id: "elegant", label: "Elegant", description: "Serif headings, refined" },
  { id: "bold", label: "Bold", description: "Strong typography, impactful" },
  { id: "corporate", label: "Corporate", description: "Formal, conservative" },
  { id: "academic", label: "Academic", description: "CV-style, comprehensive" },
  {
    id: "photo-modern",
    label: "Photo Modern",
    description: "Modern layout with profile photo",
  },
  {
    id: "photo-sidebar",
    label: "Photo Sidebar",
    description: "Sidebar layout with profile photo",
  },
];

/**
 * Prints only the resume content using a hidden iframe (no pop-up required).
 */
function printResumeOnly() {
  const resumeEl = document.getElementById("resume-print-target");
  if (!resumeEl) {
    console.error("Resume preview not found.");
    return;
  }

  const styleNodes = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style'),
  )
    .map((node) => node.outerHTML)
    .join("\n");

  const iframe = document.createElement("iframe");
  iframe.setAttribute(
    "style",
    "position:absolute;width:0;height:0;border:0;left:-9999px;top:-9999px;",
  );
  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      console.error("Could not access iframe document.");
      document.body.removeChild(iframe);
      return;
    }

    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Resume</title>
  ${styleNodes}
  <style>
    body { margin: 0; padding: 0; background: white; }
    @page { margin: 0; size: A4; }
  </style>
</head>
<body>
  ${resumeEl.outerHTML}
</body>
</html>`);
    iframeDoc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.print();
      } catch (e) {
        console.error("Print failed:", e);
      }
      const cleanup = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      iframe.contentWindow?.addEventListener("afterprint", cleanup);
      setTimeout(cleanup, 2000);
    }, 600);
  } catch (e) {
    console.error("iframe print error:", e);
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
}

interface PrintPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  template: Template;
  onDownload: () => void;
}

function PrintPreviewDialog({
  open,
  onClose,
  resume,
  template,
  onDownload,
}: PrintPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="flex max-h-[90vh] w-[95vw] max-w-5xl flex-col gap-0 p-0"
        data-ocid="preview.dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <DialogTitle className="font-display text-base font-semibold">
            Print Preview
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
            data-ocid="preview.close_button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable preview body */}
        <div className="flex-1 overflow-y-auto bg-muted/30 px-6 py-6">
          <div
            style={{
              transformOrigin: "top center",
              transform: "scale(0.78)",
              width: "128.2%",
              marginLeft: "-14.1%",
            }}
          >
            <ResumePreview resume={resume} template={template} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-card px-5 py-3">
          <p className="text-xs text-muted-foreground">
            This is how your resume will look when printed
          </p>
          <Button
            size="sm"
            onClick={onDownload}
            className="h-8 text-xs"
            data-ocid="preview.download_button"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download PDF — ₹49
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TemplatePickerProps {
  template: Template;
  onSelect: (id: Template) => void;
}

function TemplatePicker({ template, onSelect }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3" data-ocid="template.picker.panel">
      {TEMPLATES.map(({ id, label, description }) => {
        const isSelected = template === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`relative flex flex-col gap-1 rounded-lg border-2 p-3 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-1"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
            }`}
            data-ocid={`template.${id}.toggle`}
          >
            {isSelected && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </span>
            )}
            <span className="pr-6 text-sm font-semibold text-foreground">
              {label}
            </span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Mobile horizontal scrollable section selector */
function MobileSectionNav({
  activeSection,
  onSelect,
}: {
  activeSection: Section;
  onSelect: (s: Section) => void;
}) {
  return (
    <div className="no-print overflow-x-auto border-b border-border bg-card">
      <div className="flex gap-1 px-3 py-2" style={{ minWidth: "max-content" }}>
        {SECTIONS_LIST.map(({ id, shortLabel, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              data-ocid={`mobile.nav.${id}.tab`}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              {shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Mobile bottom tab bar */
function MobileBottomBar({
  mobileView,
  onChangeView,
  onDownload,
  atsScore,
}: {
  mobileView: "edit" | "preview";
  onChangeView: (v: "edit" | "preview") => void;
  onDownload: () => void;
  atsScore: number;
}) {
  const scoreColor =
    atsScore >= 80
      ? "bg-emerald-500"
      : atsScore >= 60
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <nav
      className="no-print fixed bottom-0 left-0 right-0 z-30 flex h-16 items-stretch border-t border-border bg-card shadow-lg md:hidden"
      data-ocid="mobile.bottom.panel"
    >
      {/* Edit tab */}
      <button
        type="button"
        className={`flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
          mobileView === "edit"
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => onChangeView("edit")}
        data-ocid="mobile.edit.tab"
      >
        <PencilLine className="h-5 w-5" />
        Edit
      </button>

      {/* Preview tab */}
      <button
        type="button"
        className={`relative flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
          mobileView === "preview"
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => onChangeView("preview")}
        data-ocid="mobile.preview.tab"
      >
        <div className="relative">
          <Eye className="h-5 w-5" />
          <span
            className={`absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white ${scoreColor}`}
          >
            {atsScore >= 80 ? "✓" : "!"}
          </span>
        </div>
        Preview
      </button>

      {/* Download tab */}
      <button
        type="button"
        className="flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        onClick={onDownload}
        data-ocid="mobile.download.button"
      >
        <Download className="h-5 w-5" />
        Download
      </button>
    </nav>
  );
}

export function BuilderPage() {
  const [resume, setResume] = useState<ResumeData>(SAMPLE_RESUME);
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [template, setTemplate] = useState<Template>("modern");
  const [showATS, setShowATS] = useState(true);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  const updateResume = useCallback(
    (updater: (prev: ResumeData) => ResumeData) => {
      setResume((prev) => updater(prev));
    },
    [],
  );

  const atsResult = useMemo(() => calculateATSScore(resume), [resume]);

  const handlePrint = () => {
    setShowPrintPreview(true);
  };

  // Clicking "Download PDF" from the preview dialog shows the paywall
  const handleDownloadFromPreview = () => {
    setShowPrintPreview(false);
    setShowPaywall(true);
  };

  // After successful payment, proceed with the actual PDF download
  const handlePaymentSuccess = () => {
    setShowPaywall(false);
    setTimeout(() => printResumeOnly(), 300);
  };

  const handleInsertSummary = useCallback(
    (text: string) => {
      updateResume((r) => ({ ...r, summary: text }));
      setActiveSection("summary");
    },
    [updateResume],
  );

  const renderEditor = () => {
    switch (activeSection) {
      case "personal":
        return (
          <PersonalInfoEditor
            value={resume.personalInfo}
            onChange={(v) => updateResume((r) => ({ ...r, personalInfo: v }))}
          />
        );
      case "summary":
        return (
          <SummaryEditor
            value={resume.summary}
            onChange={(v) => updateResume((r) => ({ ...r, summary: v }))}
            onAIAssist={() => setShowAI(true)}
          />
        );
      case "experience":
        return (
          <WorkExperienceEditor
            value={resume.workExperience}
            onChange={(v) => updateResume((r) => ({ ...r, workExperience: v }))}
          />
        );
      case "education":
        return (
          <EducationEditor
            value={resume.education}
            onChange={(v) => updateResume((r) => ({ ...r, education: v }))}
          />
        );
      case "skills":
        return (
          <SkillsEditor
            value={resume.skills}
            onChange={(v) => updateResume((r) => ({ ...r, skills: v }))}
          />
        );
      case "certifications":
        return (
          <CertificationsEditor
            value={resume.certifications}
            onChange={(v) => updateResume((r) => ({ ...r, certifications: v }))}
          />
        );
      case "projects":
        return (
          <ProjectsEditor
            value={resume.projects}
            onChange={(v) => updateResume((r) => ({ ...r, projects: v }))}
          />
        );
      case "languages":
        return (
          <LanguagesEditor
            value={resume.languages}
            onChange={(v) => updateResume((r) => ({ ...r, languages: v }))}
          />
        );
      case "target":
        return (
          <TargetJobEditor
            value={resume.targetJobDescription}
            onChange={(v) =>
              updateResume((r) => ({ ...r, targetJobDescription: v }))
            }
          />
        );
      case "templates":
        return <TemplatePicker template={template} onSelect={setTemplate} />;
      default:
        return null;
    }
  };

  // Show paywall full-screen if user clicked Download
  if (showPaywall) {
    return (
      <PaywallScreen
        onPaymentSuccess={handlePaymentSuccess}
        onCancel={() => setShowPaywall(false)}
      />
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background md:flex-row">
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <EditorSidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        atsScore={atsResult.total}
      />

      {/* ── Main content area ── */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* ── EDITOR PANEL ── visible on desktop always; on mobile only when mobileView=edit ── */}
        <div
          className={`no-print flex flex-col overflow-hidden border-border bg-card ${
            mobileView === "edit"
              ? "flex flex-1 border-r md:w-[400px] md:flex-none"
              : "hidden md:flex md:w-[400px] md:flex-shrink-0 md:border-r"
          }`}
        >
          {/* Editor header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-display text-sm font-semibold text-foreground md:text-base">
              {SECTION_TITLES[activeSection]}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAI(true)}
                className="h-7 gap-1.5 border-violet-200 bg-violet-50 px-2.5 text-xs font-medium text-violet-700 hover:bg-violet-100 hover:text-violet-800"
                data-ocid="ai.assistant.open_modal_button"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Assist
              </Button>
            </div>
          </div>

          {/* Mobile section pill nav (hidden on desktop) */}
          <div className="md:hidden">
            <MobileSectionNav
              activeSection={activeSection}
              onSelect={setActiveSection}
            />
          </div>

          {/* Editor content */}
          <div className="flex-1 overflow-y-auto p-4 pb-20 md:p-5 md:pb-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {renderEditor()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── PREVIEW + ATS AREA ── visible on desktop always; on mobile only when mobileView=preview ── */}
        <div
          className={`flex flex-col overflow-hidden bg-muted/30 ${
            mobileView === "preview"
              ? "flex flex-1"
              : "hidden md:flex md:flex-1"
          }`}
        >
          {/* Preview top bar */}
          <div className="no-print flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Live Preview
              </span>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-8 text-xs"
                data-ocid="preview.primary_button"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Print / Export PDF</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>

          {/* ATS Score Panel */}
          <div className="no-print border-b border-border bg-card">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-2.5 text-left"
              onClick={() => setShowATS((v) => !v)}
              data-ocid="ats.panel.toggle"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  ATS Score
                </span>
                <ATSScoreBadge score={atsResult.total} />
              </div>
              {showATS ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            <AnimatePresence>
              {showATS && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <ATSGauge result={atsResult} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resume Preview — scaled on mobile to fit width */}
          <div
            id="resume-preview-wrapper"
            className="flex-1 overflow-y-auto px-4 pt-4 pb-20 md:px-6 md:py-8"
          >
            {/* Mobile scaled wrapper */}
            <div className="md:hidden">
              <MobileResumeScale>
                <ResumePreview resume={resume} template={template} />
              </MobileResumeScale>
            </div>
            {/* Desktop normal */}
            <div className="hidden md:block">
              <ResumePreview resume={resume} template={template} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile bottom navigation bar ── */}
      <MobileBottomBar
        mobileView={mobileView}
        onChangeView={setMobileView}
        onDownload={handlePrint}
        atsScore={atsResult.total}
      />

      {/* Print Preview Dialog (free to view) */}
      <PrintPreviewDialog
        open={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        resume={resume}
        template={template}
        onDownload={handleDownloadFromPreview}
      />

      {/* AI Assistant Panel */}
      <AIAssistantPanel
        open={showAI}
        onClose={() => setShowAI(false)}
        resumeData={resume}
        onInsertSummary={handleInsertSummary}
      />

      {/* Customer Care Widget */}
      <CustomerCareWidget />
    </div>
  );
}

/**
 * Scales the A4 resume preview to fit the current mobile viewport width.
 * Uses a CSS transform so the resume renders at full resolution but appears smaller.
 */
function MobileResumeScale({ children }: { children: React.ReactNode }) {
  // A4 width in px at 96dpi ≈ 794px. We leave ~32px total horizontal padding.
  const A4_WIDTH = 794;
  const PADDING = 32;

  // Calculate scale using window.innerWidth at render time.
  // This is fine as a static calculation — a resize listener would be overkill here.
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 390;
  const availableWidth = viewportWidth - PADDING;
  const scale = Math.min(1, availableWidth / A4_WIDTH);

  return (
    <div
      style={{
        width: "100%",
        // Shrink the container height proportionally to avoid extra whitespace
        height: `calc(${A4_WIDTH * Math.SQRT2}px * ${scale})`,
        overflow: "visible",
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          width: `${A4_WIDTH}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ATSScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-green-100 text-green-700"
      : score >= 60
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";
  return (
    <Badge variant="outline" className={`border-0 text-xs font-bold ${color}`}>
      {score}/100
    </Badge>
  );
}
