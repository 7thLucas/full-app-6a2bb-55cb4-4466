import type { FeedbackItem } from "./use-sessions";

const categoryConfig = {
  strength: {
    label: "Strength",
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    dot: "bg-teal-400",
  },
  improvement: {
    label: "Improve",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  tip: {
    label: "Tip",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
};

interface FeedbackCardProps {
  item: FeedbackItem;
}

export function FeedbackCard({ item }: FeedbackCardProps) {
  const cfg = categoryConfig[item.category];
  return (
    <div className={`flex gap-3 p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
      <div className="mt-1.5">
        <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.text}`}>
          {cfg.label}
        </span>
        <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">{item.text}</p>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: "PENDING" | "ANALYZING" | "DONE" | "ERROR";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const map = {
    PENDING: "bg-slate-100 text-slate-600",
    ANALYZING: "bg-blue-100 text-blue-700",
    DONE: "bg-teal-100 text-teal-700",
    ERROR: "bg-red-100 text-red-700",
  };
  const labels = {
    PENDING: "Pending",
    ANALYZING: "Analyzing...",
    DONE: "Complete",
    ERROR: "Error",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status]}`}>
      {labels[status]}
    </span>
  );
}
