import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { uploadSession } from "./use-sessions";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (sessionId: string) => void;
}

export function UploadModal({ open, onClose, onSuccess }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  function handleFile(f: File) {
    if (!f.type.startsWith("video/")) {
      setError("Please select a video file (MP4, WebM, MOV)");
      return;
    }
    setFile(f);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || !title || !candidateName || !jobRole) {
      setError("All fields and a video file are required");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("candidateName", candidateName);
      fd.append("jobRole", jobRole);
      fd.append("video", file);
      const { sessionId } = await uploadSession(fd);
      onSuccess(sessionId);
      // reset
      setTitle(""); setCandidateName(""); setJobRole(""); setFile(null);
    } catch (err: any) {
      setError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">New Interview Session</h2>
            <p className="text-sm text-slate-500 mt-0.5">Upload a video for AI analysis</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Session Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Engineer - Round 2"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Job Role
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Product Manager"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Drop zone */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragOver
                ? "border-teal-400 bg-teal-50"
                : file
                ? "border-teal-300 bg-teal-50/50"
                : "border-slate-200 hover:border-slate-300 bg-slate-50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {file ? (
              <div className="space-y-1">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mx-auto">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(1)} MB — click to change</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center mx-auto">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-600">Drop video here or click to browse</p>
                <p className="text-xs text-slate-400">MP4, WebM, MOV — up to 500 MB</p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file || !title || !candidateName || !jobRole}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-50"
              style={{ backgroundColor: "#1E3A5F" }}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload & Analyze"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
