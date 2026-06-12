import { Link } from "react-router";
import type { SessionSummary } from "./use-sessions";
import { StatusBadge } from "./feedback-badge";

interface SessionCardProps {
  session: SessionSummary;
  onDelete?: (id: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function OverallScore({ score }: { score: number }) {
  const color = score >= 80 ? "#00D4C8" : score >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{ backgroundColor: color }}
      >
        {score}
      </div>
      <span className="text-[10px] text-slate-400 mt-1">Overall</span>
    </div>
  );
}

export function SessionCard({ session, onDelete }: SessionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <Link to={`/sessions/${session.sessionId}`} className="block p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={session.status} />
              {session.status === "ANALYZING" && (
                <svg className="w-3 h-3 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </div>
            <h3 className="font-semibold text-slate-800 truncate text-sm mt-2">{session.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {session.candidateName} · {session.jobRole}
            </p>
            <p className="text-xs text-slate-400 mt-2">{formatDate(session.createdAt)}</p>
          </div>
          {session.scores && (
            <OverallScore score={Math.round(session.scores.overall)} />
          )}
          {!session.scores && session.status === "DONE" && (
            <div className="text-xs text-slate-400 italic">No scores</div>
          )}
        </div>
      </Link>
      {onDelete && (
        <div className="border-t border-slate-50 px-5 py-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDelete(session.sessionId)}
            className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
