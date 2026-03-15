import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { WorkExperience } from "../../backend";
import { strengthenBullet } from "../../data/aiTemplates";

interface Props {
  value: WorkExperience[];
  onChange: (v: WorkExperience[]) => void;
}

function newEntry(): WorkExperience {
  return {
    id: BigInt(Date.now()),
    company: "",
    title: "",
    location: "",
    startDate: "",
    endDate: undefined,
    isCurrent: false,
    bullets: [""],
  };
}

/** Returns stable per-bullet IDs, growing the list as needed. */
function useBulletIds() {
  const ref = useRef<Map<string, string[]>>(new Map());
  return (parentKey: string, count: number): string[] => {
    const existing = ref.current.get(parentKey) ?? [];
    while (existing.length < count) existing.push(crypto.randomUUID());
    const trimmed = existing.slice(0, count);
    ref.current.set(parentKey, trimmed);
    return trimmed;
  };
}

interface BulletImprovePopoverProps {
  bullet: string;
  expIdx: number;
  bulletIdx: number;
}

function BulletImprovePopover({
  bullet,
  expIdx,
  bulletIdx,
}: BulletImprovePopoverProps) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && results.length === 0) {
      setLoading(true);
      setTimeout(() => {
        setResults(strengthenBullet(bullet || "Worked on tasks"));
        setLoading(false);
      }, 600);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="AI: Improve this bullet"
          className="flex-shrink-0 rounded p-0.5 text-muted-foreground/60 hover:bg-violet-50 hover:text-violet-600 transition-colors"
          data-ocid={`ai.bullet.improve_button.${expIdx * 10 + bulletIdx + 1}`}
        >
          <Sparkles className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        align="start"
        className="w-80 p-3"
        data-ocid="ai.bullet.popover"
      >
        <div className="mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-violet-500" />
          <span className="text-xs font-semibold text-foreground">
            AI Bullet Suggestions
          </span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
            <span className="ml-2 text-xs text-muted-foreground">
              Improving…
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {results.slice(0, 2).map((r, idx) => (
              <div
                key={r.slice(0, 30)}
                className="rounded border border-border bg-muted/40 p-2"
              >
                <p className="mb-1.5 text-[11px] leading-relaxed text-foreground">
                  {r}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(r, idx)}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy
                    </>
                  )}
                </button>
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground">
              Replace placeholder values like [X%] with your real numbers.
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function WorkExperienceEditor({ value, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(
    value.length > 0 ? String(value[0].id) : null,
  );
  const getBulletIds = useBulletIds();

  const add = () => {
    const entry = newEntry();
    onChange([entry, ...value]);
    setExpanded(String(entry.id));
  };

  const remove = (id: bigint) => {
    onChange(value.filter((e) => e.id !== id));
  };

  const update = (id: bigint, patch: Partial<WorkExperience>) => {
    onChange(value.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...value];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };

  const moveDown = (idx: number) => {
    if (idx === value.length - 1) return;
    const next = [...value];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  const addBullet = (id: bigint) => {
    const entry = value.find((e) => e.id === id);
    if (!entry) return;
    update(id, { bullets: [...entry.bullets, ""] });
  };

  const updateBullet = (id: bigint, bIdx: number, text: string) => {
    const entry = value.find((e) => e.id === id);
    if (!entry) return;
    const bullets = [...entry.bullets];
    bullets[bIdx] = text;
    update(id, { bullets });
  };

  const removeBullet = (id: bigint, bIdx: number) => {
    const entry = value.find((e) => e.id === id);
    if (!entry) return;
    update(id, { bullets: entry.bullets.filter((_, i) => i !== bIdx) });
  };

  if (value.length === 0) {
    return (
      <div className="space-y-4">
        <div
          className="flex flex-col items-center rounded-lg border border-dashed border-border py-10 text-center"
          data-ocid="experience.empty_state"
        >
          <p className="text-sm font-medium text-foreground">
            No work experience yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add your most recent role first
          </p>
        </div>
        <Button
          onClick={add}
          className="w-full"
          data-ocid="experience.primary_button"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Work Experience
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={add}
        variant="outline"
        size="sm"
        className="w-full"
        data-ocid="experience.primary_button"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Position
      </Button>

      {value.map((exp, idx) => {
        const key = String(exp.id);
        const isOpen = expanded === key;
        const bulletIds = getBulletIds(key, exp.bullets.length);
        return (
          <div
            key={key}
            className="overflow-hidden rounded-lg border border-border bg-card"
            data-ocid={`experience.item.${idx + 1}`}
          >
            <div className="flex items-center gap-2 p-3">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  data-ocid="experience.drag_handle"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(idx)}
                  disabled={idx === value.length - 1}
                  className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : key)}
                className="flex-1 text-left"
              >
                <p className="text-sm font-semibold text-foreground">
                  {exp.title || "New Position"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {exp.company || "Company"}
                  {exp.isCurrent ? " \u00b7 Present" : ""}
                </p>
              </button>
              <button
                type="button"
                onClick={() => remove(exp.id)}
                className="rounded p-1 text-muted-foreground hover:text-destructive"
                data-ocid={`experience.delete_button.${idx + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {isOpen && (
              <div className="space-y-3 border-t border-border px-3 pb-3 pt-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Job Title</Label>
                    <Input
                      value={exp.title}
                      onChange={(e) =>
                        update(exp.id, { title: e.target.value })
                      }
                      placeholder="Senior Engineer"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) =>
                        update(exp.id, { company: e.target.value })
                      }
                      placeholder="Acme Corp"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) =>
                      update(exp.id, { location: e.target.value })
                    }
                    placeholder="San Francisco, CA"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Start Date</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        update(exp.id, { startDate: e.target.value })
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate ?? ""}
                      onChange={(e) =>
                        update(exp.id, { endDate: e.target.value || undefined })
                      }
                      disabled={exp.isCurrent}
                      className="h-8 text-xs disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`current-${key}`}
                    checked={exp.isCurrent}
                    onCheckedChange={(checked) =>
                      update(exp.id, {
                        isCurrent: !!checked,
                        endDate: checked ? undefined : exp.endDate,
                      })
                    }
                    data-ocid={`experience.checkbox.${idx + 1}`}
                  />
                  <Label htmlFor={`current-${key}`} className="text-xs">
                    I currently work here
                  </Label>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Achievement Bullets</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Use numbers and metrics for better ATS scores (e.g.,
                    "Increased revenue by 30%")
                  </p>
                  {exp.bullets.map((bullet, bIdx) => (
                    <div
                      key={bulletIds[bIdx]}
                      className="flex items-center gap-1.5"
                    >
                      <span className="mt-0.5 text-xs text-muted-foreground">
                        •
                      </span>
                      <Input
                        value={bullet}
                        onChange={(e) =>
                          updateBullet(exp.id, bIdx, e.target.value)
                        }
                        placeholder="Increased sales by 25% through..."
                        className="h-7 flex-1 text-xs"
                      />
                      <BulletImprovePopover
                        bullet={bullet}
                        expIdx={idx}
                        bulletIdx={bIdx}
                      />
                      <button
                        type="button"
                        onClick={() => removeBullet(exp.id, bIdx)}
                        className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addBullet(exp.id)}
                    className="h-7 w-full text-xs"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Add Bullet
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
