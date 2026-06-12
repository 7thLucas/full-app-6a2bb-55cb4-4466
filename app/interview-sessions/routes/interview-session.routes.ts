import { Router } from "express";
import { requireAuth, requireAdmin } from "~/modules/authentication/authentication.middleware";
import {
  createSession,
  listMySessions,
  getSession,
  updateSessionTicket,
  deleteSession,
  adminListSessions,
  adminGetStats,
  adminGetSession,
  adminDeleteSession,
} from "../controllers/interview-session.controller";

const router = Router();

// Candidate routes (authenticated)
router.post("/interview-sessions", requireAuth, createSession);
router.get("/interview-sessions", requireAuth, listMySessions);
router.get("/interview-sessions/:id", requireAuth, getSession);
router.patch("/interview-sessions/:id/ticket", requireAuth, updateSessionTicket);
router.delete("/interview-sessions/:id", requireAuth, deleteSession);

// Admin routes
router.get("/admin/interview-sessions", requireAdmin, adminListSessions);
router.get("/admin/interview-sessions/stats", requireAdmin, adminGetStats);
router.get("/admin/interview-sessions/:id", requireAdmin, adminGetSession);
router.delete("/admin/interview-sessions/:id", requireAdmin, adminDeleteSession);

export default router;
