import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Layers,
  Loader2,
  Printer,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ResumeData } from "../backend";
import { SAMPLE_RESUME } from "../data/sampleResume";
import { calculateATSScore } from "../utils/atsScore";
import { AIAssistantPanel } from "./AIAssistantPanel";
import { ATSGauge } from "./ATSGauge";
import { EditorSidebar } from "./EditorSidebar";
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

const RAZORPAY_KEY = "rzp_live_SREVhKAcH7xaGm";

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

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface DownloadPaywallDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPaymentSuccess: () => void;
}

function DownloadPaywallDialog({
  open,
  onOpenChange,
  onPaymentSuccess,
}: DownloadPaywallDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePay = async () => {
    setIsLoading(true);
    setPaymentError(null);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setPaymentError("Failed to load payment gateway. Please try again.");
      setIsLoading(false);
      return;
    }

    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      setPaymentError("Payment gateway unavailable. Please try again.");
      setIsLoading(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: 100,
      currency: "INR",
      name: "ProResume",
      description: "Download Resume — One-time payment",
      theme: { color: "#6366f1" },
      handler: (_response: { razorpay_payment_id: string }) => {
        toast.success("Payment successful! Downloading your resume…");
        onOpenChange(false);
        setIsLoading(false);
        setTimeout(() => onPaymentSuccess(), 300);
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
          setPaymentError("Payment was cancelled. Try again when ready.");
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", () => {
      setIsLoading(false);
      setPaymentError(
        "Payment failed. Please try again or use a different method.",
      );
    });
    rzp.open();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" data-ocid="download.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            Download Your Resume
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Price */}
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-sm text-muted-foreground">₹</span>
              <span className="font-display text-3xl font-bold text-foreground">
                1
              </span>
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <BadgeCheck className="h-3.5 w-3.5 text-green-500" />
              One-time payment per download
            </div>
          </div>

          {/* UPI Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">Pay via</span>
            {["Google Pay", "PhonePe", "Paytm", "UPI"].map((method) => (
              <span
                key={method}
                className="rounded border border-border bg-card px-2 py-0.5 text-xs font-medium text-foreground"
              >
                {method}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Button
            onClick={handlePay}
            disabled={isLoading}
            className="w-full"
            data-ocid="download.primary_button"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Opening payment…
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Pay ₹1 &amp; Download
              </>
            )}
          </Button>

          {paymentError && (
            <p
              className="text-center text-xs text-destructive"
              data-ocid="download.error_state"
            >
              {paymentError}
            </p>
          )}

          <p className="text-center text-xs text-muted-foreground">
            No sign-in required. Pay ₹1 per download.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
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
            Download PDF
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

export function BuilderPage() {
  const [resume, setResume] = useState<ResumeData>(SAMPLE_RESUME);
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [template, setTemplate] = useState<Template>("modern");
  const [showATS, setShowATS] = useState(true);
  const [showDownloadPaywall, setShowDownloadPaywall] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showAI, setShowAI] = useState(false);
  // Local flag to immediately unlock download after payment within the same session
  const [paidLocally, setPaidLocally] = useState(false);

  const isPaid = paidLocally;

  const updateResume = useCallback(
    (updater: (prev: ResumeData) => ResumeData) => {
      setResume((prev) => updater(prev));
    },
    [],
  );

  const atsResult = useMemo(() => calculateATSScore(resume), [resume]);

  // Opens the free print preview
  const handlePrint = () => {
    setShowPrintPreview(true);
  };

  // Called when user clicks "Download PDF" inside preview
  const handleDownloadFromPreview = () => {
    if (isPaid) {
      setShowPrintPreview(false);
      setTimeout(() => window.print(), 300);
    } else {
      setShowPrintPreview(false);
      setShowDownloadPaywall(true);
    }
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <EditorSidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        atsScore={atsResult.total}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className="no-print flex w-[400px] flex-shrink-0 flex-col overflow-hidden border-r border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="font-display text-base font-semibold text-foreground">
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

          <div className="flex-1 overflow-y-auto p-5">
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

        {/* Preview + ATS Area */}
        <div className="flex flex-1 flex-col overflow-hidden bg-muted/30">
          {/* Top bar */}
          <div className="no-print flex items-center justify-between border-b border-border bg-card px-5 py-2.5">
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
                <Printer className="mr-1.5 h-3.5 w-3.5" /> Print / Export PDF
              </Button>
            </div>
          </div>

          {/* ATS Score Panel */}
          <div className="no-print border-b border-border bg-card">
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-2.5 text-left"
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

          {/* Resume Preview */}
          <div
            id="resume-preview-wrapper"
            className="flex-1 overflow-y-auto px-6 py-8"
          >
            <ResumePreview resume={resume} template={template} />
          </div>
        </div>
      </div>

      {/* Print Preview Dialog (free) */}
      <PrintPreviewDialog
        open={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        resume={resume}
        template={template}
        onDownload={handleDownloadFromPreview}
      />

      {/* Download Paywall Dialog */}
      <DownloadPaywallDialog
        open={showDownloadPaywall}
        onOpenChange={setShowDownloadPaywall}
        onPaymentSuccess={() => {
          setPaidLocally(true);
          window.print();
        }}
      />

      {/* AI Assistant Panel */}
      <AIAssistantPanel
        open={showAI}
        onClose={() => setShowAI(false)}
        resumeData={resume}
        onInsertSummary={handleInsertSummary}
      />
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
