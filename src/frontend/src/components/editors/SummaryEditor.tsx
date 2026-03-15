import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onAIAssist?: () => void;
}

const FIRST_PERSON_RE = /\b(I|my|me|I'm|I've|I'll|myself)\b/;

export function SummaryEditor({ value, onChange, onAIAssist }: Props) {
  const hasFirstPerson = FIRST_PERSON_RE.test(value);
  const charCount = value.trim().length;
  const isLongEnough = charCount >= 50;

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="summary">Professional Summary</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Write in third person. Avoid "I", "my", "me". Aim for 2–4 impactful
          sentences.
        </p>
      </div>

      <Textarea
        id="summary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Results-driven professional with X years of experience in... Proven track record of..."
        className="min-h-[140px] resize-none text-sm"
        data-ocid="summary.textarea"
      />

      {onAIAssist && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onAIAssist}
          className="h-7 gap-1.5 px-2 text-xs text-violet-600 hover:bg-violet-50 hover:text-violet-700"
          data-ocid="summary.ai_assist.button"
        >
          <Sparkles className="h-3.5 w-3.5" />✨ AI Assist — Generate Summary
        </Button>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {hasFirstPerson && (
            <p
              className="text-xs text-destructive"
              data-ocid="summary.error_state"
            >
              ⚠ Remove first-person pronouns (I, my, me) for +5 ATS points
            </p>
          )}
          {!isLongEnough && (
            <p className="text-xs text-muted-foreground">
              Add {50 - charCount} more characters to unlock +10 ATS points
            </p>
          )}
          {isLongEnough && !hasFirstPerson && (
            <p
              className="text-xs text-emerald-600"
              data-ocid="summary.success_state"
            >
              ✓ Summary meets all ATS requirements
            </p>
          )}
        </div>
        <span
          className={`text-xs tabular-nums ${
            charCount > 600 ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {charCount} chars
        </span>
      </div>
    </div>
  );
}
