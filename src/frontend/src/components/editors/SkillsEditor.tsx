import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { SkillCategory } from "../../backend";

interface Props {
  value: SkillCategory[];
  onChange: (v: SkillCategory[]) => void;
}

function newCategory(): SkillCategory {
  return { id: BigInt(Date.now()), category: "", skills: [] };
}

export function SkillsEditor({ value, onChange }: Props) {
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>(
    {},
  );

  const addCategory = () => {
    onChange([...value, newCategory()]);
  };

  const removeCategory = (id: bigint) =>
    onChange(value.filter((c) => c.id !== id));

  const updateCategory = (id: bigint, patch: Partial<SkillCategory>) => {
    onChange(value.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const addSkill = (id: bigint) => {
    const catKey = String(id);
    const skill = (newSkillInputs[catKey] ?? "").trim();
    if (!skill) return;
    const cat = value.find((c) => c.id === id);
    if (!cat) return;
    updateCategory(id, { skills: [...cat.skills, skill] });
    setNewSkillInputs((prev) => ({ ...prev, [catKey]: "" }));
  };

  const removeSkill = (id: bigint, idx: number) => {
    const cat = value.find((c) => c.id === id);
    if (!cat) return;
    updateCategory(id, { skills: cat.skills.filter((_, i) => i !== idx) });
  };

  const handleSkillKeyDown = (id: bigint, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(id);
    }
  };

  if (value.length === 0) {
    return (
      <div className="space-y-4">
        <div
          className="flex flex-col items-center rounded-lg border border-dashed border-border py-10 text-center"
          data-ocid="skills.empty_state"
        >
          <p className="text-sm font-medium text-foreground">
            No skills added yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Group skills by category (e.g., Technical, Leadership)
          </p>
        </div>
        <Button
          onClick={addCategory}
          className="w-full"
          data-ocid="skills.primary_button"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Skill Category
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {value.map((cat, idx) => {
        const key = String(cat.id);
        return (
          <div
            key={key}
            className="rounded-lg border border-border bg-card p-3"
            data-ocid={`skills.item.${idx + 1}`}
          >
            <div className="mb-2 flex items-center gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Category Name</Label>
                <Input
                  value={cat.category}
                  onChange={(e) =>
                    updateCategory(cat.id, { category: e.target.value })
                  }
                  placeholder="Technical, Leadership, Tools..."
                  className="h-8 text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => removeCategory(cat.id)}
                className="mt-5 rounded p-1 text-muted-foreground hover:text-destructive"
                data-ocid={`skills.delete_button.${idx + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mb-2 flex flex-wrap gap-1.5">
              {cat.skills.map((skill, sIdx) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(cat.id, sIdx)}
                    className="ml-0.5 opacity-60 hover:opacity-100"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-1.5">
              <Input
                value={newSkillInputs[key] ?? ""}
                onChange={(e) =>
                  setNewSkillInputs((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
                onKeyDown={(e) => handleSkillKeyDown(cat.id, e)}
                placeholder="Type a skill and press Enter"
                className="h-7 flex-1 text-xs"
                data-ocid="skills.input"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => addSkill(cat.id)}
                className="h-7 text-xs"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        onClick={addCategory}
        variant="outline"
        size="sm"
        className="w-full"
        data-ocid="skills.secondary_button"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Category
      </Button>
    </div>
  );
}
