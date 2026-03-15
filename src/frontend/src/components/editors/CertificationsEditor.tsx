import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Certification } from "../../backend";

interface Props {
  value: Certification[];
  onChange: (v: Certification[]) => void;
}

function newEntry(): Certification {
  return { id: BigInt(Date.now()), name: "", issuer: "", date: "", url: "" };
}

export function CertificationsEditor({ value, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(
    value.length > 0 ? String(value[0].id) : null,
  );

  const add = () => {
    const entry = newEntry();
    onChange([entry, ...value]);
    setExpanded(String(entry.id));
  };

  const remove = (id: bigint) => onChange(value.filter((e) => e.id !== id));

  const update = (id: bigint, patch: Partial<Certification>) => {
    onChange(value.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  if (value.length === 0) {
    return (
      <div className="space-y-4">
        <div
          className="flex flex-col items-center rounded-lg border border-dashed border-border py-10 text-center"
          data-ocid="certifications.empty_state"
        >
          <p className="text-sm font-medium text-foreground">
            No certifications yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add professional certifications and licenses
          </p>
        </div>
        <Button
          onClick={add}
          className="w-full"
          data-ocid="certifications.primary_button"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Certification
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
        data-ocid="certifications.primary_button"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Certification
      </Button>

      {value.map((cert, idx) => {
        const key = String(cert.id);
        const isOpen = expanded === key;
        return (
          <div
            key={key}
            className="overflow-hidden rounded-lg border border-border bg-card"
            data-ocid={`certifications.item.${idx + 1}`}
          >
            <div className="flex items-center gap-2 p-3">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : key)}
                className="flex-1 text-left"
              >
                <p className="text-sm font-semibold text-foreground">
                  {cert.name || "New Certification"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {cert.issuer || "Issuer"}
                </p>
              </button>
              <button
                type="button"
                onClick={() => remove(cert.id)}
                className="rounded p-1 text-muted-foreground hover:text-destructive"
                data-ocid={`certifications.delete_button.${idx + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {isOpen && (
              <div className="space-y-3 border-t border-border px-3 pb-3 pt-3">
                <div className="space-y-1">
                  <Label className="text-xs">Certification Name</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => update(cert.id, { name: e.target.value })}
                    placeholder="AWS Solutions Architect"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Issuing Organization</Label>
                    <Input
                      value={cert.issuer}
                      onChange={(e) =>
                        update(cert.id, { issuer: e.target.value })
                      }
                      placeholder="Amazon Web Services"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Date</Label>
                    <Input
                      type="month"
                      value={cert.date}
                      onChange={(e) =>
                        update(cert.id, { date: e.target.value })
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">URL (optional)</Label>
                  <Input
                    value={cert.url}
                    onChange={(e) => update(cert.id, { url: e.target.value })}
                    placeholder="https://credential-url.com"
                    className="h-8 text-xs"
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
