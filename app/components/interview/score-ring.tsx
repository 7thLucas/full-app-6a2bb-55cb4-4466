interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
  accent?: string;
}

export function ScoreRing({ score, label, size = 80, accent = "#00D4C8" }: ScoreRingProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * (score / 100);

  const color =
    score >= 80 ? "#00D4C8" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div className="text-center -mt-[72px]" style={{ height: size }}>
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-xl font-bold text-slate-800">{score}</span>
          <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-medium text-slate-500 text-center leading-tight mt-12">
        {label}
      </span>
    </div>
  );
}
