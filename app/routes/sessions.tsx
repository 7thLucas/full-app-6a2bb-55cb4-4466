import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SidebarLayout } from "~/components/interview/sidebar-layout";
import { SessionCard } from "~/components/interview/session-card";
import { UploadModal } from "~/components/interview/upload-modal";
import { useSessions } from "~/components/interview/use-sessions";
import { useConfigurables } from "~/modules/configurables";

export default function SessionsPage() {
  const { config } = useConfigurables();
  const { sessions, loading, error, refetch, deleteSession } = useSessions();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pollingActive, setPollingActive] = useState(false);
  const navigate = useNavigate();

  // Poll while any session is analyzing
  const hasAnalyzing = sessions.some((s) => s.status === "ANALYZING");
  useEffect(() => {
    if (!hasAnalyzing) { setPollingActive(false); return; }
    setPollingActive(true);
    const t = setInterval(refetch, 5000);
    return () => clearInterval(t);
  }, [hasAnalyzing, refetch]);

  function handleDeleteSession(id: string) {
    if (!window.confirm("Delete this session? This cannot be undone.")) return;
    deleteSession(id);
  }

  function handleUploadSuccess(sessionId: string) {
    setUploadOpen(false);
    refetch();
    navigate(`/sessions/${sessionId}`);
  }

  return (
    <SidebarLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Interview Sessions</h1>
            <p className="text-sm text-slate-500 mt-1">
              AI-scored feedback on answer quality, communication, and delivery
            </p>
          </div>
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            style={{ backgroundColor: "#1E3A5F" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Session
          </button>
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 animate-spin text-slate-300" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-slate-400">Loading sessions...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "#E8F7F6" }}
            >
              <svg className="w-8 h-8" style={{ color: "#00D4C8" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">No sessions yet</h2>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              Upload an interview recording and get AI-powered scores and feedback in minutes.
            </p>
            <button
              onClick={() => setUploadOpen(true)}
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200"
              style={{ backgroundColor: "#00D4C8" }}
            >
              Upload First Session
            </button>
          </div>
        )}

        {!loading && !error && sessions.length > 0 && (
          <>
            {hasAnalyzing && (
              <div className="mb-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
                <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                AI is analyzing a session — results will appear automatically.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <SessionCard
                  key={session.sessionId}
                  session={session}
                  onDelete={handleDeleteSession}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </SidebarLayout>
  );
}
