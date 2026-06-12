import { InterviewSessionModel, SessionStatus } from "../models/interview-session.model";

export const InterviewSessionService = {
  async createSession(userId: string, sessionTitle: string, jobRole?: string) {
    return InterviewSessionModel.create({
      user_id: userId,
      session_title: sessionTitle,
      job_role: jobRole,
      status: SessionStatus.Pending,
      category_scores: {},
    });
  },

  async setAnalyzing(sessionId: string, ticketId: string) {
    return InterviewSessionModel.findByIdAndUpdate(
      sessionId,
      { status: SessionStatus.Analyzing, ticket_id: ticketId },
      { new: true },
    );
  },

  async completeSession(
    sessionId: string,
    data: {
      overall_score: number;
      category_scores: Record<string, number>;
      summary?: string;
      duration_seconds?: number;
      analysis_result?: Record<string, any>;
    },
  ) {
    return InterviewSessionModel.findByIdAndUpdate(
      sessionId,
      { status: SessionStatus.Completed, ...data },
      { new: true },
    );
  },

  async failSession(sessionId: string) {
    return InterviewSessionModel.findByIdAndUpdate(
      sessionId,
      { status: SessionStatus.Failed },
      { new: true },
    );
  },

  async listByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      InterviewSessionModel.find({ user_id: userId, deletedAt: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      InterviewSessionModel.countDocuments({ user_id: userId, deletedAt: null }),
    ]);
    return { sessions, total, page, limit };
  },

  async listAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      InterviewSessionModel.find({ deletedAt: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user_id", "username email")
        .lean(),
      InterviewSessionModel.countDocuments({ deletedAt: null }),
    ]);
    return { sessions, total, page, limit };
  },

  async getById(sessionId: string) {
    return InterviewSessionModel.findById(sessionId).lean();
  },

  async getByIdForUser(sessionId: string, userId: string) {
    return InterviewSessionModel.findOne({ _id: sessionId, user_id: userId, deletedAt: null }).lean();
  },

  async deleteSession(sessionId: string) {
    return InterviewSessionModel.findByIdAndUpdate(sessionId, { deletedAt: new Date() });
  },

  async getStats() {
    const [total, completed, analyzing, failed] = await Promise.all([
      InterviewSessionModel.countDocuments({ deletedAt: null }),
      InterviewSessionModel.countDocuments({ status: SessionStatus.Completed, deletedAt: null }),
      InterviewSessionModel.countDocuments({ status: SessionStatus.Analyzing, deletedAt: null }),
      InterviewSessionModel.countDocuments({ status: SessionStatus.Failed, deletedAt: null }),
    ]);
    const avgResult = await InterviewSessionModel.aggregate([
      { $match: { status: SessionStatus.Completed, deletedAt: null, overall_score: { $exists: true } } },
      { $group: { _id: null, avg: { $avg: "$overall_score" } } },
    ]);
    return {
      total,
      completed,
      analyzing,
      failed,
      avgScore: avgResult[0]?.avg ?? 0,
    };
  },
};
