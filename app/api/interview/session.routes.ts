import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import multer from "multer";
import axios, { type AxiosError } from "axios";
import FormData from "form-data";
import https from "https";
import { createLogger } from "~/lib/logger";
import { InterviewSessionModel } from "./session.model";

const logger = createLogger("InterviewRoutes");
const router = Router();

const UPLOADER_BASE_URL = "https://api-micro-uploader.quantumbyte.ai";
const AGENTIC_SERVICE_URL = "https://api-micro-agentic.quantumbyte.ai";
const httpsAgent = new https.Agent({ rejectUnauthorized: false, keepAlive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
});

function keyspace() {
  return process.env._KEYSPACE ?? "";
}

function authHeaders(): Record<string, string> {
  const auth = process.env.QB_SCAFFOLDER_KEY;
  return auth ? { Authentication: auth } : {};
}

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    scores: {
      type: "object",
      properties: {
        answerQuality: { type: "number" },
        communicationClarity: { type: "number" },
        deliveryConfidence: { type: "number" },
        overall: { type: "number" },
      },
      required: ["answerQuality", "communicationClarity", "deliveryConfidence", "overall"],
    },
    feedback: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string", enum: ["strength", "improvement", "tip"] },
          text: { type: "string" },
        },
        required: ["category", "text"],
      },
    },
    summary: { type: "string" },
  },
  required: ["scores", "feedback", "summary"],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You are an expert interview coach and talent assessment specialist.
Analyze the interview video and provide structured, actionable feedback.
Score each dimension from 0 to 100 where 100 is excellent.
- answerQuality: depth, relevance, and structure of answers (STAR method, specifics)
- communicationClarity: vocabulary, sentence structure, coherence, conciseness
- deliveryConfidence: tone, pacing, presence, non-verbal cues if visible, energy
- overall: holistic weighted average
Provide 3-6 specific feedback items across strengths, areas for improvement, and tips.
Keep summary to 2-3 sentences. Be warm yet precise — this is coaching, not judgment.`;

// POST /api/interview/sessions — upload video + kick off analysis
router.post(
  "/sessions",
  upload.single("video"),
  async (req: Request, res: Response) => {
    const { title, candidateName, jobRole } = req.body ?? {};

    if (!title || !candidateName || !jobRole) {
      return res.status(400).json({
        success: false,
        message: "title, candidateName, and jobRole are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "video file is required" });
    }

    const sessionId = randomUUID();
    const ks = keyspace();

    // 1. Upload video to file service
    let videoUrl = "";
    let videoFilename = req.file.originalname || "interview.mp4";

    try {
      const form = new FormData();
      form.append("keyspace", ks);
      form.append("file", req.file.buffer, {
        filename: videoFilename,
        contentType: req.file.mimetype || "video/mp4",
      });

      const uploadRes = await axios({
        method: "POST",
        url: `${UPLOADER_BASE_URL}/files`,
        timeout: 120_000,
        headers: {
          "x-api-key": process.env.QB_SCAFFOLDER_KEY || "",
          ...form.getHeaders(),
          "Content-Length": form.getLengthSync(),
        },
        data: form,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        httpsAgent,
      });

      videoUrl = uploadRes.data?.result?.url ?? "";
      if (!videoUrl) throw new Error("Upload returned no URL");
    } catch (err: any) {
      logger.error("Video upload failed", err);
      return res.status(502).json({ success: false, message: `Video upload failed: ${err.message}` });
    }

    // 2. Create session record
    const session = await InterviewSessionModel.create({
      sessionId,
      title,
      candidateName,
      jobRole,
      videoUrl,
      videoFilename,
      status: "ANALYZING",
    });

    // 3. Fire off LLM analysis in background
    void (async () => {
      try {
        const message = `Analyze this interview recording for candidate "${candidateName}" applying for "${jobRole}" role. Title: "${title}". Provide comprehensive scoring and feedback.`;

        const form = new FormData();
        form.append("message", message);
        form.append("schema", JSON.stringify(ANALYSIS_SCHEMA));
        form.append("system_prompt", SYSTEM_PROMPT);

        // Pass video as blob
        form.append("files", req.file!.buffer, {
          filename: videoFilename,
          contentType: req.file!.mimetype || "video/mp4",
        });

        const agentRes = await axios.post(
          `${AGENTIC_SERVICE_URL}/api/llm`,
          form,
          {
            headers: {
              "x-id-keyspace": ks,
              ...authHeaders(),
              ...form.getHeaders(),
            },
            timeout: 300_000, // 5 min for video analysis
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
          },
        );

        const result = agentRes.data?.response ?? agentRes.data;
        const scores = result?.scores ?? null;
        const feedback = result?.feedback ?? [];
        const summary = result?.summary ?? null;

        await InterviewSessionModel.updateOne(
          { sessionId },
          { $set: { status: "DONE", scores, feedback, summary } },
        );
      } catch (err: any) {
        logger.error(`Analysis failed for session ${sessionId}`, err);
        const ax = err as AxiosError<{ detail?: string; message?: string }>;
        const msg =
          ax.response?.data?.detail ??
          ax.response?.data?.message ??
          err.message ??
          "Analysis failed";
        await InterviewSessionModel.updateOne(
          { sessionId },
          { $set: { status: "ERROR", error: String(msg) } },
        );
      }
    })();

    return res.status(201).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        status: session.status,
        title: session.title,
        candidateName: session.candidateName,
        jobRole: session.jobRole,
        videoUrl: session.videoUrl,
        createdAt: session.createdAt,
      },
    });
  },
);

// GET /api/interview/sessions — list all sessions
router.get("/sessions", async (_req: Request, res: Response) => {
  const sessions = await InterviewSessionModel.find()
    .sort({ createdAt: -1 })
    .lean();

  return res.json({
    success: true,
    data: sessions.map((s) => ({
      sessionId: s.sessionId,
      title: s.title,
      candidateName: s.candidateName,
      jobRole: s.jobRole,
      videoUrl: s.videoUrl,
      status: s.status,
      scores: s.scores,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    })),
  });
});

// GET /api/interview/sessions/:id — single session detail
router.get("/sessions/:id", async (req: Request, res: Response) => {
  const session = await InterviewSessionModel.findOne({ sessionId: req.params.id }).lean();

  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  return res.json({
    success: true,
    data: {
      sessionId: session.sessionId,
      title: session.title,
      candidateName: session.candidateName,
      jobRole: session.jobRole,
      videoUrl: session.videoUrl,
      videoFilename: session.videoFilename,
      status: session.status,
      scores: session.scores,
      feedback: session.feedback,
      summary: session.summary,
      error: session.error,
      durationSeconds: session.durationSeconds,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    },
  });
});

// DELETE /api/interview/sessions/:id
router.delete("/sessions/:id", async (req: Request, res: Response) => {
  const result = await InterviewSessionModel.deleteOne({ sessionId: req.params.id });
  if (result.deletedCount === 0) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }
  return res.json({ success: true, message: "Session deleted" });
});

export default router;
