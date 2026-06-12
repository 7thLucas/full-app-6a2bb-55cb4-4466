import { useState, useEffect, useCallback } from "react";
import { apiGet, apiRequest } from "~/lib/api.client";

export interface ScoreBreakdown {
  answerQuality: number;
  communicationClarity: number;
  deliveryConfidence: number;
  overall: number;
}

export interface FeedbackItem {
  category: "strength" | "improvement" | "tip";
  text: string;
}

export interface SessionSummary {
  sessionId: string;
  title: string;
  candidateName: string;
  jobRole: string;
  videoUrl: string;
  status: "PENDING" | "ANALYZING" | "DONE" | "ERROR";
  scores: ScoreBreakdown | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionDetail extends SessionSummary {
  videoFilename: string;
  feedback: FeedbackItem[];
  summary: string | null;
  error: string | null;
  durationSeconds: number | null;
}

export function useSessions() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiGet<SessionSummary[]>("/api/interview/sessions");
    if (res.success && res.data) {
      setSessions(res.data);
    } else {
      setError(res.message ?? "Failed to load sessions");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const deleteSession = useCallback(async (sessionId: string) => {
    const res = await apiRequest(`/api/interview/sessions/${sessionId}`, { method: "DELETE" });
    if (res.success) {
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    }
    return res;
  }, []);

  return { sessions, loading, error, refetch: fetch, deleteSession };
}

export function useSession(sessionId: string | null) {
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    const res = await apiGet<SessionDetail>(`/api/interview/sessions/${sessionId}`);
    if (res.success && res.data) {
      setSession(res.data);
    } else {
      setError(res.message ?? "Failed to load session");
    }
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Poll while analyzing
  useEffect(() => {
    if (!session || session.status !== "ANALYZING") return;
    const timer = setInterval(fetch, 5000);
    return () => clearInterval(timer);
  }, [session, fetch]);

  return { session, loading, error, refetch: fetch };
}

export async function uploadSession(formData: FormData): Promise<{ sessionId: string }> {
  const response = await window.fetch("/api/interview/sessions", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!data.success || !data.data?.sessionId) {
    throw new Error(data.message ?? "Upload failed");
  }
  return { sessionId: data.data.sessionId };
}
