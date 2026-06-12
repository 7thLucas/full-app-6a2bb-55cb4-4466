import type { Request, Response } from "express";
import { InterviewSessionService } from "../services/interview-session.service";
import { SessionStatus } from "../models/interview-session.model";

export async function createSession(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { session_title, job_role } = req.body;
    if (!session_title) {
      res.status(400).json({ success: false, message: "session_title is required" });
      return;
    }
    const session = await InterviewSessionService.createSession(userId, session_title, job_role);
    res.status(201).json({ success: true, data: session });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function listMySessions(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const page = parseInt(String(req.query.page ?? "1"), 10);
    const limit = parseInt(String(req.query.limit ?? "10"), 10);
    const result = await InterviewSessionService.listByUser(userId, page, limit);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getSession(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const session = await InterviewSessionService.getByIdForUser(req.params.id, userId);
    if (!session) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }
    res.json({ success: true, data: session });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateSessionTicket(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { ticket_id } = req.body;
    const session = await InterviewSessionService.getByIdForUser(req.params.id, userId);
    if (!session) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }
    if (!ticket_id) {
      res.status(400).json({ success: false, message: "ticket_id is required" });
      return;
    }
    const updated = await InterviewSessionService.setAnalyzing(String(session._id), ticket_id);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function completeSession(req: Request, res: Response): Promise<void> {
  try {
    const { overall_score, category_scores, summary, duration_seconds, analysis_result } = req.body;
    const updated = await InterviewSessionService.completeSession(req.params.id, {
      overall_score,
      category_scores: category_scores ?? {},
      summary,
      duration_seconds,
      analysis_result,
    });
    if (!updated) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteSession(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const session = await InterviewSessionService.getByIdForUser(req.params.id, userId);
    if (!session) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }
    await InterviewSessionService.deleteSession(req.params.id);
    res.json({ success: true, message: "Session deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Admin endpoints
export async function adminListSessions(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(String(req.query.page ?? "1"), 10);
    const limit = parseInt(String(req.query.limit ?? "20"), 10);
    const result = await InterviewSessionService.listAll(page, limit);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function adminGetStats(req: Request, res: Response): Promise<void> {
  try {
    const stats = await InterviewSessionService.getStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function adminGetSession(req: Request, res: Response): Promise<void> {
  try {
    const session = await InterviewSessionService.getById(req.params.id);
    if (!session) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }
    res.json({ success: true, data: session });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function adminDeleteSession(req: Request, res: Response): Promise<void> {
  try {
    await InterviewSessionService.deleteSession(req.params.id);
    res.json({ success: true, message: "Session deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
