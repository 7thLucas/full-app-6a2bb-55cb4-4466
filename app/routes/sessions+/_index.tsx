import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { apiGet } from "~/lib/api.client";

interface Session {
  sessionId: string;
  title: string;
  candidateName: string;
  jobRole: string;
  status: "PENDING" | "ANALYZING" | "DONE" | "ERROR";
  scores: {
    answerQuality: number;
    communicationClarity: number;
    deliveryConfidence: number;
    overall: number;
  } | null;
  createdAt: string;
  updatedAt: string;
}

function ScoreBadge({ score, labels }: { score: number; labels: any }) {
  const high = score >= 75;
  const medium = score >= 50 && score < 75;

  const label = high
    ? (labels?.high ?? "Strong")
    : medium
    ? (labels?.medium ?? "Needs Work")
    : (labels?.low ?? "Critical");

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        high ? "bg-green-100 text-green-700" : medium ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${high ? "bg-green-500" : medium ? "bg-amber-500" : "bg-red-500"}`} />
      {Math.round(score)} — {label}
    </span>
  );
}

function StatusBadge({ status }: { status: Session["status"] }) {
  const map = {
    PENDING: { label: "Pending", cls: "bg-gray-100 text-gray-600" },
    ANALYZING: { label: "Analyzing...", cls: "bg-blue-100 text-blue-700" },
    DONE: { label: "Completed", cls: "bg-green-100 text-green-700" },
    ERROR: { label: "Failed", cls: "bg-red-100 text-red-600" },
  };
  const { label, cls } = map[status] ?? map.PENDING;
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {status === "ANALYZING" && (
        <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {label}
    </span>
  );
}

export default function SessionsIndex() {
  const { config } = useConfigurables();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const primary = config?.brandColor?.primary ?? "#1E3A5F";
  const accent = config?.brandColor?.accent ?? "#00BCD4";
  const scoreLabels = (config as any)?.scoreLabels;

  async function fetchSessions() {
    try {
      const res = await apiGet<Session[]>("/api/interview/sessions");
      if (res.success && res.data) {
        setSessions(res.data);
      } else {
        setError(res.message ?? "Failed to load sessions");
      }
    } catch {
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessions();
    // Poll if any sessions are analyzing
    const interval = setInterval(() => {
      if (sessions.some((s) => s.status === "ANALYZING" || s.status === "PENDING")) {
        fetchSessions();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [sessions.length]);

  const stats = {
    total: sessions.length,
    completed: sessions.filter((s) => s.status === "DONE").length,
    analyzing: sessions.filter((s) => s.status === "ANALYZING").length,
    avgScore: sessions.filter((s) => s.scores?.overall != null).length > 0
      ? Math.round(
          sessions.filter((s) => s.scores?.overall != null).reduce((acc, s) => acc + (s.scores?.overall ?? 0), 0) /
            sessions.filter((s) => s.scores?.overall != null).length
        )
      : null,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review your interview performance history</p>
        </div>
        <Link
          to="/sessions/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          New Analysis
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Sessions", value: stats.total },
          { label: "Completed", value: stats.completed },
          { label: "In Progress", value: stats.analyzing },
          { label: "Avg Score", value: stats.avgScore != null ? `${stats.avgScore}/100` : "—" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: primary }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Sessions list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8" style={{ color: accent }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 text-sm">{error}</div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No sessions yet</h3>
          <p className="text-sm text-gray-500 mb-6">Upload your first interview recording to get AI-powered feedback</p>
          <Link
            to="/sessions/upload"
            className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold"
            style={{ backgroundColor: accent }}
          >
            Upload Interview
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.sessionId} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{session.title}</h3>
                    <StatusBadge status={session.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{session.candidateName}</span>
                    {session.jobRole && <> &mdash; {session.jobRole}</>}
                  </p>
                  {session.scores?.overall != null && (
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <ScoreBadge score={session.scores.overall} labels={scoreLabels} />
                      <span className="text-xs text-gray-400">
                        AQ {Math.round(session.scores.answerQuality)} &middot; CC {Math.round(session.scores.communicationClarity)} &middot; DC {Math.round(session.scores.deliveryConfidence)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(session.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  {session.status === "DONE" && (
                    <Link
                      to={`/sessions/${session.sessionId}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: primary }}
                    >
                      View Report
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
