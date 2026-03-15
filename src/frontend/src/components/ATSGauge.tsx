import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import type { ATSResult } from "../utils/atsScore";
import { scoreColor, scoreLabel } from "../utils/atsScore";

interface Props {
  result: ATSResult;
}

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ATSGauge({ result }: Props) {
  const offset = CIRCUMFERENCE - (result.total / 100) * CIRCUMFERENCE;
  const color = scoreColor(result.total);
  const label = scoreLabel(result.total);

  return (
    <div className="flex gap-4 px-5 pb-4 pt-2">
      {/* Circular gauge */}
      <div className="flex flex-shrink-0 flex-col items-center justify-center">
        <svg
          width="112"
          height="112"
          viewBox="0 0 112 112"
          role="img"
          aria-label={`ATS Score: ${result.total} out of 100 — ${label}`}
        >
          <circle
            cx="56"
            cy="56"
            r={RADIUS}
            fill="none"
            stroke="oklch(var(--border))"
            strokeWidth="8"
          />
          <motion.circle
            cx="56"
            cy="56"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            transform="rotate(-90 56 56)"
          />
          <text
            x="56"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="22"
            fontWeight="700"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fill={color}
          >
            {result.total}
          </text>
          <text
            x="56"
            y="67"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fontWeight="500"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fill="oklch(0.52 0.02 255)"
          >
            ATS SCORE
          </text>
        </svg>
        <span className="-mt-1 text-xs font-semibold" style={{ color }}>
          {label}
        </span>
      </div>

      {/* Category breakdown */}
      <div className="flex-1 overflow-x-auto">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 xl:grid-cols-3">
          {result.categories.map((cat) => (
            <div
              key={cat.id}
              className="group flex items-start gap-1.5"
              title={cat.tip}
            >
              {cat.passed ? (
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
              ) : (
                <XCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-medium text-foreground">
                    {cat.label}
                  </span>
                  <span className="flex-shrink-0 text-[10px] text-muted-foreground">
                    {cat.earnedPoints}/{cat.maxPoints}
                  </span>
                </div>
                <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full ${
                      cat.passed
                        ? "bg-emerald-500"
                        : cat.earnedPoints > 0
                          ? "bg-amber-500"
                          : "bg-muted-foreground/30"
                    }`}
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        cat.maxPoints > 0
                          ? `${(cat.earnedPoints / cat.maxPoints) * 100}%`
                          : "0%",
                    }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
