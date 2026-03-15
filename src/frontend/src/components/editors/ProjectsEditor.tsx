import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import type { Project } from "../../backend";

interface Props {
  value: Project[];
  onChange: (v: Project[]) => void;
}

function newEntry(): Project {
  return {
    id: BigInt(Date.now()),
    name: "",
    description: "",
    url: "",
    bullets: [],
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

export function ProjectsEditor({ value, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(
    value.length > 0 ? String(value[0].id) : null,
  );
  const getBulletIds = useBulletIds();

  const add = () => {
    const entry = newEntry();
    onChange([entry, ...value]);
    setExpanded(String(entry.id));
  };

  const remove = (id: bigint) => onChange(value.filter((e) => e.id !== id));

  const update = (id: bigint, patch: Partial<Project>) => {
    onChange(value.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const addBullet = (id: bigint) => {
    const proj = value.find((e) => e.id === id);
    if (!proj) return;
    update(id, { bullets: [...proj.bullets, ""] });
  };

  const updateBullet = (id: bigint, bIdx: number, text: string) => {
    const proj = value.find((e) => e.id === id);
    if (!proj) return;
    const bullets = [...proj.bullets];
    bullets[bIdx] = text;
    update(id, { bullets });
  };

  const removeBullet = (id: bigint, bIdx: number) => {
    const proj = value.find((e) => e.id === id);
    if (!proj) return;
    update(id, { bullets: proj.bullets.filter((_, i) => i !== bIdx) });
  };

  if (value.length === 0) {
    return (
      <div className="space-y-4">
        <div
          className="flex flex-col items-center rounded-lg border border-dashed border-border py-10 text-center"
          data-ocid="projects.empty_state"
        >
          <p className="text-sm font-medium text-foreground">
            No projects added yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Showcase key projects that demonstrate your impact
          </p>
        </div>
        <Button
          onClick={add}
          className="w-full"
          data-ocid="projects.primary_button"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Project
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
        data-ocid="projects.primary_button"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Project
      </Button>

      {value.map((proj, idx) => {
        const key = String(proj.id);
        const isOpen = expanded === key;
        const bulletIds = getBulletIds(key, proj.bullets.length);
        return (
          <div
            key={key}
            className="overflow-hidden rounded-lg border border-border bg-card"
            data-ocid={`projects.item.${idx + 1}`}
          >
            <div className="flex items-center gap-2 p-3">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : key)}
                className="flex-1 text-left"
              >
                <p className="text-sm font-semibold text-foreground">
                  {proj.name || "New Project"}
                </p>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {proj.description || "Add a description"}
                </p>
              </button>
              <button
                type="button"
                onClick={() => remove(proj.id)}
                className="rounded p-1 text-muted-foreground hover:text-destructive"
                data-ocid={`projects.delete_button.${idx + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {isOpen && (
              <div className="space-y-3 border-t border-border px-3 pb-3 pt-3">
                <div className="space-y-1">
                  <Label className="text-xs">Project Name</Label>
                  <Input
                    value={proj.name}
                    onChange={(e) => update(proj.id, { name: e.target.value })}
                    placeholder="AI-Powered Dashboard"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={proj.description}
                    onChange={(e) =>
                      update(proj.id, { description: e.target.value })
                    }
                    placeholder="Brief overview of the project and its purpose"
                    className="min-h-[60px] resize-none text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">URL (optional)</Label>
                  <Input
                    value={proj.url}
                    onChange={(e) => update(proj.id, { url: e.target.value })}
                    placeholder="https://github.com/yourproject"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Key Achievements</Label>
                  {proj.bullets.map((bullet, bIdx) => (
                    <div
                      key={bulletIds[bIdx]}
                      className="flex items-center gap-1.5"
                    >
                      <span className="text-xs text-muted-foreground">•</span>
                      <Input
                        value={bullet}
                        onChange={(e) =>
                          updateBullet(proj.id, bIdx, e.target.value)
                        }
                        placeholder="Reduced load time by 40%"
                        className="h-7 flex-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeBullet(proj.id, bIdx)}
                        className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addBullet(proj.id)}
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
