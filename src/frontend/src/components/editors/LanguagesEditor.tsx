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
import { Plus, Trash2 } from "lucide-react";
import type { Language } from "../../backend";

interface Props {
  value: Language[];
  onChange: (v: Language[]) => void;
}

const PROFICIENCY_LEVELS = [
  "Native",
  "Full Professional",
  "Professional Working",
  "Limited Working",
  "Elementary",
];

export function LanguagesEditor({ value, onChange }: Props) {
  const add = () => {
    onChange([
      ...value,
      {
        id: BigInt(Date.now()),
        language: "",
        proficiency: "Professional Working",
      },
    ]);
  };

  const remove = (id: bigint) => onChange(value.filter((l) => l.id !== id));

  const update = (id: bigint, patch: Partial<Language>) => {
    onChange(value.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <div
          className="flex flex-col items-center rounded-lg border border-dashed border-border py-10 text-center"
          data-ocid="languages.empty_state"
        >
          <p className="text-sm font-medium text-foreground">
            No languages listed
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Multilingual skills stand out to recruiters
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {value.map((lang, idx) => (
            <div
              key={String(lang.id)}
              className="flex items-end gap-2 rounded-lg border border-border bg-card p-3"
              data-ocid={`languages.item.${idx + 1}`}
            >
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Language</Label>
                <Input
                  value={lang.language}
                  onChange={(e) =>
                    update(lang.id, { language: e.target.value })
                  }
                  placeholder="English"
                  className="h-8 text-xs"
                  data-ocid="languages.input"
                />
              </div>
              <div className="w-36 space-y-1">
                <Label className="text-xs">Proficiency</Label>
                <Select
                  value={lang.proficiency}
                  onValueChange={(v) => update(lang.id, { proficiency: v })}
                >
                  <SelectTrigger
                    className="h-8 text-xs"
                    data-ocid="languages.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level} className="text-xs">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                type="button"
                onClick={() => remove(lang.id)}
                className="rounded p-1 text-muted-foreground hover:text-destructive"
                data-ocid={`languages.delete_button.${idx + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={add}
        variant="outline"
        size="sm"
        className="w-full"
        data-ocid="languages.primary_button"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Language
      </Button>
    </div>
  );
}
