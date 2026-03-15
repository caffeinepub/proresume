import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Education } from "../../backend";

interface Props {
  value: Education[];
  onChange: (v: Education[]) => void;
}

function newEntry(): Education {
  return {
    id: BigInt(Date.now()),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    gpa: "",
  };
}

export function EducationEditor({ value, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(
    value.length > 0 ? String(value[0].id) : null,
  );

  const add = () => {
    const entry = newEntry();
    onChange([entry, ...value]);
    setExpanded(String(entry.id));
  };

  const remove = (id: bigint) => onChange(value.filter((e) => e.id !== id));

  const update = (id: bigint, patch: Partial<Education>) => {
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

  if (value.length === 0) {
    return (
      <div className="space-y-4">
        <div
          className="flex flex-col items-center rounded-lg border border-dashed border-border py-10 text-center"
          data-ocid="education.empty_state"
        >
          <p className="text-sm font-medium text-foreground">
            No education added yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add your highest degree first
          </p>
        </div>
        <Button
          onClick={add}
          className="w-full"
          data-ocid="education.primary_button"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Education
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
        data-ocid="education.primary_button"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Education
      </Button>

      {value.map((edu, idx) => {
        const key = String(edu.id);
        const isOpen = expanded === key;
        return (
          <div
            key={key}
            className="overflow-hidden rounded-lg border border-border bg-card"
            data-ocid={`education.item.${idx + 1}`}
          >
            <div className="flex items-center gap-2 p-3">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  data-ocid="education.drag_handle"
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
                  {edu.institution || "Institution"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {edu.degree}
                  {edu.field ? ` \u00b7 ${edu.field}` : ""}
                </p>
              </button>
              <button
                type="button"
                onClick={() => remove(edu.id)}
                className="rounded p-1 text-muted-foreground hover:text-destructive"
                data-ocid={`education.delete_button.${idx + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {isOpen && (
              <div className="space-y-3 border-t border-border px-3 pb-3 pt-3">
                <div className="space-y-1">
                  <Label className="text-xs">Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) =>
                      update(edu.id, { institution: e.target.value })
                    }
                    placeholder="MIT"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        update(edu.id, { degree: e.target.value })
                      }
                      placeholder="Bachelor of Science"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Field of Study</Label>
                    <Input
                      value={edu.field}
                      onChange={(e) =>
                        update(edu.id, { field: e.target.value })
                      }
                      placeholder="Computer Science"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Start Date</Label>
                    <Input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) =>
                        update(edu.id, { startDate: e.target.value })
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End Date</Label>
                    <Input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) =>
                        update(edu.id, { endDate: e.target.value })
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">GPA (optional)</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => update(edu.id, { gpa: e.target.value })}
                    placeholder="3.8"
                    className="h-8 w-24 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
