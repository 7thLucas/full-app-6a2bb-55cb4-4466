import { useParams, Link, useNavigate } from "react-router";
import { SidebarLayout } from "~/components/interview/sidebar-layout";
import { ScoreRing } from "~/components/interview/score-ring";
import { ScoreBar } from "~/components/interview/score-bar";
import { FeedbackCard, StatusBadge } from "~/components/interview/feedback-badge";
import { useSession } from "~/components/interview/use-sessions";
import { apiRequest } from "~/lib/api.client";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session, loading, error, refetch } = useSession(sessionId ?? null);

  async function handleDelete() {
    if (!session) return;
    if (!window.confirm("Delete this session? This cannot be undone.")) return;
    const res = await apiRequest(`/api/interview/sessions/${session.sessionId}`, {
      method: "DELETE",
    });
    if (res.success) navigate("/sessions");
  }

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-full py-32">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 animate-spin text-slate-300" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-slate-400">Loading session...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (error || !session) {
    return (
      <SidebarLayout>
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-red-600 text-sm">{error ?? "Session not found"}</p>
          <Link to="/sessions" className="text-sm text-blue-600 underline mt-3 inline-block">
            Back to sessions
          </Link>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Breadcrumb + actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/sessions" className="text-slate-400 hover:text-slate-600 transition-colors">
              Sessions
            </Link>
            <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-700 font-medium truncate max-w-xs">{session.title}</span>
          </div>
          <button
            onClick={handleDelete}
            className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
          >
            Delete Session
          </button>
        </div>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={session.status} />
              </div>
              <h1 className="text-xl font-bold text-slate-800 mt-2">{session.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {session.candidateName}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {session.jobRole}
                </span>
                <span className="text-slate-400">{formatDate(session.createdAt)}</span>
              </div>
            </div>
            {session.scores && (
              <div
                className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white flex-shrink-0 shadow-sm"
                style={{
                  backgroundColor:
                    session.scores.overall >= 80
                      ? "#00D4C8"
                      : session.scores.overall >= 60
                      ? "#F59E0B"
                      : "#EF4444",
                }}
              >
                <span className="text-2xl font-bold leading-none">
                  {Math.round(session.scores.overall)}
                </span>
                <span className="text-[9px] font-medium opacity-80 mt-0.5">OVERALL</span>
              </div>
            )}
          </div>
        </div>

        {/* Analyzing state */}
        {session.status === "ANALYZING" && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-blue-800">AI is analyzing the interview</h3>
            <p className="text-sm text-blue-600 mt-1 max-w-sm">
              This typically takes 1-3 minutes. The page will update automatically when ready.
            </p>
          </div>
        )}

        {/* Error state */}
        {session.status === "ERROR" && session.error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-red-700 mb-1">Analysis Failed</h3>
            <p className="text-sm text-red-600">{session.error}</p>
            <button
              onClick={refetch}
              className="mt-3 text-xs font-medium text-red-500 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content grid when done */}
        {session.status === "DONE" && session.scores && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: video + summary */}
            <div className="lg:col-span-2 space-y-5">
              {/* Video player */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="border-b border-slate-50 px-5 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Recording</span>
                  <span className="text-xs text-slate-400">{session.videoFilename}</span>
                </div>
                <div className="bg-slate-900 aspect-video">
                  <video
                    src={session.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                  />
                </div>
              </div>

              {/* Summary */}
              {session.summary && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: "#00D4C8" }} />
                    AI Summary
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{session.summary}</p>
                </div>
              )}

              {/* Feedback */}
              {session.feedback && session.feedback.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: "#1E3A5F" }} />
                    Feedback
                  </h3>
                  <div className="space-y-2.5">
                    {session.feedback.map((item, i) => (
                      <FeedbackCard key={i} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: score rings + bars */}
            <div className="space-y-5">
              {/* Rings */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-5">Score Breakdown</h3>
                <div className="grid grid-cols-3 gap-3 justify-items-center">
                  <ScoreRing
                    score={Math.round(session.scores.answerQuality)}
                    label="Answer Quality"
                    size={76}
                  />
                  <ScoreRing
                    score={Math.round(session.scores.communicationClarity)}
                    label="Communication"
                    size={76}
                  />
                  <ScoreRing
                    score={Math.round(session.scores.deliveryConfidence)}
                    label="Confidence"
                    size={76}
                  />
                </div>
              </div>

              {/* Bars */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Detailed Scores</h3>
                <div className="space-y-4">
                  <ScoreBar
                    label="Answer Quality"
                    score={Math.round(session.scores.answerQuality)}
                  />
                  <ScoreBar
                    label="Communication"
                    score={Math.round(session.scores.communicationClarity)}
                  />
                  <ScoreBar
                    label="Delivery Confidence"
                    score={Math.round(session.scores.deliveryConfidence)}
                  />
                  <div className="pt-2 border-t border-slate-100">
                    <ScoreBar
                      label="Overall Score"
                      score={Math.round(session.scores.overall)}
                    />
                  </div>
                </div>
              </div>

              {/* Grade legend */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-xs space-y-1.5">
                <p className="font-semibold text-slate-500 uppercase tracking-wide mb-2">Grade Guide</p>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00D4C8]" />
                  <span className="text-slate-600">80–100 Excellent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-slate-600">60–79 Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-slate-600">0–59 Needs Work</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
