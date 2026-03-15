import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

function extractKeywords(text: string): string[] {
  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 4)
        .slice(0, 30),
    ),
  ];
}

export function TargetJobEditor({ value, onChange }: Props) {
  const keywords = value.trim() ? extractKeywords(value) : [];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="targetJob">Target Job Description</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Paste the full job description here. ProResume will analyze keyword
          overlap and award up to +15 ATS points for strong alignment.
        </p>
      </div>

      <Textarea
        id="targetJob"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Paste the job description here...\n\nExample:\n'We are looking for a Senior Product Manager with 5+ years of experience in SaaS...'`}
        className="min-h-[200px] resize-none text-xs"
        data-ocid="target.textarea"
      />

      {keywords.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-foreground">
            Detected Keywords ({keywords.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <Badge key={kw} variant="secondary" className="text-[10px]">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-primary/5 p-3">
        <p className="text-xs font-semibold text-primary">💡 Pro Tip</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Copy the entire job posting including requirements, responsibilities,
          and qualifications. The more text you provide, the more accurate the
          keyword analysis.
        </p>
      </div>
    </div>
  );
}
