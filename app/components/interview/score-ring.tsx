interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
}

export function ScoreRing({ score, label, size = 80 }: ScoreRingProps) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * (Math.min(score, 100) / 100);

  const color =
    score >= 80 ? "#00D4C8" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: size, height: size }} className="relative">
        <svg
          width={size}
          height={size}
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-slate-800 leading-none">{score}</span>
          <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">/ 100</span>
        </div>
      </div>
      <span className="text-[11px] font-medium text-slate-500 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}
