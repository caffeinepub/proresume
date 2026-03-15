import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ResumeData } from "../backend";
import {
  INDUSTRY_LABELS,
  type Industry,
  SKILLS_BY_INDUSTRY,
  SUMMARY_TEMPLATES,
  fillSummaryTemplate,
  strengthenBullet,
} from "../data/aiTemplates";

interface Props {
  open: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  onInsertSummary: (text: string) => void;
  onInsertBullet?: (text: string) => void;
}

export function AIAssistantPanel({
  open,
  onClose,
  resumeData,
  onInsertSummary,
}: Props) {
  // Summary tab state
  const [jobTitle, setJobTitle] = useState(
    resumeData.personalInfo?.jobTitle || "",
  );
  const [years, setYears] = useState("5");
  const [industry, setIndustry] = useState<Industry>("software");
  const [summaryResults, setSummaryResults] = useState<
    { label: string; tone: string; text: string }[]
  >([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [usedSummaryIdx, setUsedSummaryIdx] = useState<number | null>(null);

  // Bullets tab state
  const [bulletInput, setBulletInput] = useState("");
  const [bulletResults, setBulletResults] = useState<string[]>([]);
  const [bulletLoading, setBulletLoading] = useState(false);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);

  // Skills tab state
  const [skillsIndustry, setSkillsIndustry] = useState<Industry>("software");
  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);

  const handleGenerateSummary = () => {
    setSummaryLoading(true);
    setSummaryResults([]);
    setUsedSummaryIdx(null);
    setTimeout(() => {
      const templates = SUMMARY_TEMPLATES[industry];
      const results = templates.map((t) => ({
        label: t.label,
        tone: t.tone,
        text: fillSummaryTemplate(t.text, {
          years,
          title: jobTitle || "Professional",
          industry: INDUSTRY_LABELS[industry],
        }),
      }));
      setSummaryResults(results);
      setSummaryLoading(false);
    }, 600);
  };

  const handleUseSummary = (text: string, idx: number) => {
    onInsertSummary(text);
    setUsedSummaryIdx(idx);
    toast.success("Summary inserted into your resume!");
  };

  const handleImproveBullet = () => {
    if (!bulletInput.trim()) {
      toast.error("Please enter a bullet point to improve.");
      return;
    }
    setBulletLoading(true);
    setBulletResults([]);
    setTimeout(() => {
      const results = strengthenBullet(bulletInput);
      setBulletResults(results);
      setBulletLoading(false);
    }, 600);
  };

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedBulletIdx(idx);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedBulletIdx(null), 2000);
    });
  };

  const handleCopySkill = (skill: string) => {
    navigator.clipboard.writeText(skill).then(() => {
      setCopiedSkill(skill);
      toast.success(`"${skill}" copied!`);
      setTimeout(() => setCopiedSkill(null), 2000);
    });
  };

  // Compute missing skills
  const existingSkills = resumeData.skills
    .flatMap((cat) => cat.skills)
    .map((s) => s.toLowerCase());
  const suggestedSkills = SKILLS_BY_INDUSTRY[skillsIndustry];
  const missingSkills = suggestedSkills.filter(
    (s) => !existingSkills.includes(s.toLowerCase()),
  );
  const presentSkills = suggestedSkills.filter((s) =>
    existingSkills.includes(s.toLowerCase()),
  );

  const toneColors: Record<string, string> = {
    concise: "bg-blue-50 border-blue-200 text-blue-700",
    achievement: "bg-emerald-50 border-emerald-200 text-emerald-700",
    leadership: "bg-violet-50 border-violet-200 text-violet-700",
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="flex w-[420px] flex-col gap-0 p-0 sm:max-w-[420px]"
        data-ocid="ai.panel.sheet"
      >
        {/* Premium header */}
        <SheetHeader className="relative border-b border-border px-0 py-0">
          <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-5 py-5">
            {/* Decorative orbs */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-6 left-4 h-20 w-20 rounded-full bg-indigo-400/20 blur-xl" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-md p-1 text-white/70 hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-white">
                  AI Writing Assistant
                </h2>
                <p className="mt-0.5 text-xs text-white/70">
                  ✨ Powered by smart resume templates
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <Tabs
          defaultValue="summary"
          className="flex flex-1 flex-col overflow-hidden"
        >
          <TabsList className="mx-4 mt-4 grid grid-cols-3 rounded-lg">
            <TabsTrigger
              value="summary"
              className="text-xs"
              data-ocid="ai.summary.tab"
            >
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="bullets"
              className="text-xs"
              data-ocid="ai.bullets.tab"
            >
              Bullets
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="text-xs"
              data-ocid="ai.skills.tab"
            >
              Skills
            </TabsTrigger>
          </TabsList>

          {/* ── Summary Tab ── */}
          <TabsContent
            value="summary"
            className="flex flex-1 flex-col gap-0 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Job Title</Label>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">
                      Years of Experience
                    </Label>
                    <Input
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      placeholder="5"
                      type="number"
                      min="0"
                      max="40"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Industry</Label>
                    <Select
                      value={industry}
                      onValueChange={(v) => setIndustry(v as Industry)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(INDUSTRY_LABELS) as Industry[]).map(
                          (k) => (
                            <SelectItem key={k} value={k} className="text-xs">
                              {INDUSTRY_LABELS[k]}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                  className="w-full"
                  size="sm"
                  data-ocid="ai.summary.generate_button"
                >
                  {summaryLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-3.5 w-3.5" />
                      Generate 3 Summaries
                    </>
                  )}
                </Button>

                {summaryResults.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Choose the style that fits you best:
                    </p>
                    {summaryResults.map((result, idx) => {
                      const ocidMap = [
                        "ai.summary.option.1",
                        "ai.summary.option.2",
                        "ai.summary.option.3",
                      ];
                      const btnOcidMap = [
                        "ai.summary.use_button.1",
                        "ai.summary.use_button.2",
                        "ai.summary.use_button.3",
                      ];
                      const isUsed = usedSummaryIdx === idx;
                      return (
                        <div
                          key={result.tone}
                          className={`rounded-lg border p-3 transition-all ${
                            isUsed
                              ? "border-emerald-300 bg-emerald-50"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                          data-ocid={ocidMap[idx]}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                                toneColors[result.tone] ||
                                "bg-muted text-muted-foreground"
                              }`}
                            >
                              {result.label}
                            </span>
                            {isUsed && (
                              <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                                <Check className="h-3 w-3" /> Used
                              </span>
                            )}
                          </div>
                          <p className="mb-3 text-xs leading-relaxed text-foreground">
                            {result.text}
                          </p>
                          <Button
                            size="sm"
                            variant={isUsed ? "outline" : "default"}
                            className="h-7 w-full text-xs"
                            onClick={() => handleUseSummary(result.text, idx)}
                            data-ocid={btnOcidMap[idx]}
                          >
                            {isUsed ? (
                              <>
                                <Check className="mr-1 h-3 w-3" /> Applied
                              </>
                            ) : (
                              "Use This"
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {summaryResults.length === 0 && !summaryLoading && (
                  <div className="rounded-lg border border-dashed border-border py-8 text-center">
                    <Sparkles className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">
                      Fill in your details above and click
                      <br />
                      <strong>Generate</strong> to see 3 summary options
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── Bullets Tab ── */}
          <TabsContent
            value="bullets"
            className="flex flex-1 flex-col gap-0 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3">
              <div className="space-y-3">
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                  <p className="text-xs font-semibold text-amber-800">
                    💡 STAR Format Tip
                  </p>
                  <p className="mt-0.5 text-xs text-amber-700">
                    Great bullets follow:{" "}
                    <strong>Situation → Task → Action → Result</strong>. Always
                    include a metric like percentages or dollar amounts.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Paste your bullet point
                  </Label>
                  <Textarea
                    value={bulletInput}
                    onChange={(e) => setBulletInput(e.target.value)}
                    placeholder="e.g. Helped with customer reports..."
                    className="min-h-[80px] resize-none text-xs"
                  />
                </div>

                <Button
                  onClick={handleImproveBullet}
                  disabled={bulletLoading}
                  className="w-full"
                  size="sm"
                  data-ocid="ai.bullets.improve_button"
                >
                  {bulletLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Improving…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-3.5 w-3.5" />
                      Improve Bullet
                    </>
                  )}
                </Button>

                {bulletResults.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      3 improved versions:
                    </p>
                    {bulletResults.map((result, idx) => {
                      const labels = [
                        "Direct & Metric-Driven",
                        "STAR Format",
                        "Strong Action Verb",
                      ];
                      const isCopied = copiedBulletIdx === idx;
                      return (
                        <div
                          key={labels[idx] || idx}
                          className="rounded-lg border border-border bg-card p-3"
                        >
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-muted-foreground">
                              {labels[idx] || `Version ${idx + 1}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyBullet(result, idx)}
                              className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-500" />{" "}
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" /> Copy
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs leading-relaxed text-foreground">
                            {result}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {bulletResults.length === 0 && !bulletLoading && (
                  <div className="rounded-lg border border-dashed border-border py-8 text-center">
                    <p className="text-xs text-muted-foreground">
                      Paste a weak bullet and click <strong>Improve</strong>
                      <br />
                      to get stronger, metric-driven versions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── Skills Tab ── */}
          <TabsContent
            value="skills"
            className="flex flex-1 flex-col gap-0 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Select your industry
                  </Label>
                  <Select
                    value={skillsIndustry}
                    onValueChange={(v) => setSkillsIndustry(v as Industry)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(INDUSTRY_LABELS) as Industry[]).map((k) => (
                        <SelectItem key={k} value={k} className="text-xs">
                          {INDUSTRY_LABELS[k]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Top skills grid */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Top ATS Keywords — click + to copy
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedSkills.map((skill) => {
                      const isPresent = existingSkills.includes(
                        skill.toLowerCase(),
                      );
                      const isCopied = copiedSkill === skill;
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => !isPresent && handleCopySkill(skill)}
                          disabled={isPresent}
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                            isPresent
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 opacity-75 cursor-default"
                              : isCopied
                                ? "border-violet-300 bg-violet-50 text-violet-700"
                                : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-primary/5 cursor-pointer"
                          }`}
                        >
                          {isPresent ? (
                            <Check className="h-2.5 w-2.5" />
                          ) : isCopied ? (
                            <Check className="h-2.5 w-2.5 text-violet-500" />
                          ) : (
                            <span className="text-muted-foreground">+</span>
                          )}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Missing keywords */}
                {missingSkills.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="mb-2 text-xs font-semibold text-amber-800">
                      ⚠ Missing Keywords ({missingSkills.length})
                    </p>
                    <p className="mb-2 text-[10px] text-amber-700">
                      These skills aren't in your resume yet. Adding them
                      improves your ATS score:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {missingSkills.slice(0, 10).map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleCopySkill(skill)}
                          className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-white px-2 py-0.5 text-[10px] font-medium text-amber-800 hover:bg-amber-100"
                        >
                          <span>+</span> {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Present skills */}
                {presentSkills.length > 0 && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <p className="mb-1.5 text-xs font-semibold text-emerald-800">
                      ✓ Already in your resume ({presentSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {presentSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[10px] text-emerald-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
