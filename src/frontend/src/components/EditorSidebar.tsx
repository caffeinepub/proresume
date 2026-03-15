import {
  Award,
  Briefcase,
  FileText,
  FolderOpen,
  Globe,
  GraduationCap,
  Lightbulb,
  Palette,
  Target,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import type { Section } from "./BuilderPage";

interface SidebarProps {
  activeSection: Section;
  onSelect: (s: Section) => void;
  atsScore: number;
}

const SECTIONS: {
  id: Section;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Lightbulb },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "languages", label: "Languages", icon: Globe },
  { id: "target", label: "Target Job", icon: Target },
  { id: "templates", label: "Templates", icon: Palette },
];

export function EditorSidebar({
  activeSection,
  onSelect,
  atsScore,
}: SidebarProps) {
  const scoreColorClass =
    atsScore >= 80
      ? "text-emerald-400"
      : atsScore >= 60
        ? "text-amber-400"
        : "text-red-400";
  const scoreBgClass =
    atsScore >= 80
      ? "bg-emerald-400/10"
      : atsScore >= 60
        ? "bg-amber-400/10"
        : "bg-red-400/10";
  const barColorClass =
    atsScore >= 80
      ? "bg-emerald-400"
      : atsScore >= 60
        ? "bg-amber-400"
        : "bg-red-400";

  return (
    // hidden on mobile, visible on md+ as flex column
    <aside className="no-print hidden h-full w-56 flex-shrink-0 flex-col bg-sidebar md:flex">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <span className="text-sm font-bold text-sidebar-primary-foreground">
            P
          </span>
        </div>
        <span className="font-display text-lg font-bold text-sidebar-foreground">
          ProResume
        </span>
      </div>

      {/* Score pill */}
      <div className={`mx-4 mb-4 rounded-lg px-3 py-2.5 ${scoreBgClass}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-sidebar-foreground/60">
            ATS Score
          </span>
          <span className={`text-sm font-bold tabular-nums ${scoreColorClass}`}>
            {atsScore}/100
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sidebar-border">
          <motion.div
            className={`h-full rounded-full ${barColorClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${atsScore}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              type="button"
              key={section.id}
              onClick={() => onSelect(section.id)}
              className={`relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
              data-ocid={`nav.${section.id}.link`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 h-full w-0.5 rounded-r-full bg-sidebar-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <p className="text-center text-[10px] text-sidebar-foreground/40">
          &copy; {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-sidebar-foreground/60"
          >
            Built with caffeine.ai
          </a>
        </p>
      </div>
    </aside>
  );
}
