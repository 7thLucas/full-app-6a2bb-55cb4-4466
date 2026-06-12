import { useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";

export default function UploadPage() {
  const { config } = useConfigurables();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const primary = config?.brandColor?.primary ?? "#1E3A5F";
  const accent = config?.brandColor?.accent ?? "#00BCD4";

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("video/")) {
      setFile(dropped);
      setError("");
    } else {
      setError("Please upload a video file (MP4, WebM, MOV)");
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError("");
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError("Please select a video file"); return; }
    if (!title.trim()) { setError("Session title is required"); return; }
    if (!candidateName.trim()) { setError("Candidate name is required"); return; }
    if (!jobRole.trim()) { setError("Job role is required"); return; }

    setUploading(true);
    setError("");
    setProgress(10);

    try {
      const form = new FormData();
      form.append("video", file);
      form.append("title", title.trim());
      form.append("candidateName", candidateName.trim());
      form.append("jobRole", jobRole.trim());

      setProgress(30);

      const res = await fetch("/api/interview/sessions", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      setProgress(90);

      const data = await res.json();

      if (data.success) {
        setProgress(100);
        navigate(`/sessions/${data.data.sessionId}`);
      } else {
        setError(data.message ?? "Upload failed. Please try again.");
        setProgress(0);
      }
    } catch (err: any) {
      setError("Upload failed. Please check your connection and try again.");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/sessions" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-4 transition-colors w-fit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Sessions
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Interview Analysis</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upload a recording and get AI-powered performance feedback</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Session details */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-sm">Session Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              placeholder="e.g. Google SWE Interview — Round 1"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Role <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Software Engineer"
                required
              />
            </div>
          </div>
        </div>

        {/* Video upload */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Interview Recording <span className="text-red-400">*</span></h2>

          {file ? (
            <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: accent }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                dragging ? "bg-blue-50" : "bg-gray-50 hover:bg-gray-100"
              }`}
              style={{ borderColor: dragging ? accent : "#E5E7EB" }}
            >
              <div
                className="h-14 w-14 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${accent}15` }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: accent }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700">Drop your video here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse — MP4, WebM, MOV up to 500 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={onFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
            {error}
          </div>
        )}

        {uploading && progress > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {progress < 90 ? "Uploading video..." : "Starting analysis..."}
              </span>
              <span className="text-xs text-gray-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: accent }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              AI analysis will continue in the background. You can track progress on the sessions page.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ backgroundColor: primary }}
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Analyze Interview
            </>
          )}
        </button>
      </form>
    </div>
  );
}
