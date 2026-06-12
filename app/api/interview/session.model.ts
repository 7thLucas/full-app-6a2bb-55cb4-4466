import mongoose, { type Document, type Model, Schema } from "mongoose";

export type SessionStatus = "PENDING" | "ANALYZING" | "DONE" | "ERROR";

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

export interface InterviewSession extends Document {
  sessionId: string;
  title: string;
  candidateName: string;
  jobRole: string;
  videoUrl: string;
  videoFilename: string;
  status: SessionStatus;
  scores: ScoreBreakdown | null;
  feedback: FeedbackItem[];
  summary: string | null;
  error: string | null;
  durationSeconds: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackItemSchema = new Schema<FeedbackItem>(
  {
    category: { type: String, enum: ["strength", "improvement", "tip"], required: true },
    text: { type: String, required: true },
  },
  { _id: false },
);

const InterviewSessionSchema = new Schema<InterviewSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    candidateName: { type: String, required: true },
    jobRole: { type: String, required: true },
    videoUrl: { type: String, required: true },
    videoFilename: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "ANALYZING", "DONE", "ERROR"],
      default: "PENDING",
      required: true,
    },
    scores: {
      type: new Schema(
        {
          answerQuality: Number,
          communicationClarity: Number,
          deliveryConfidence: Number,
          overall: Number,
        },
        { _id: false },
      ),
      default: null,
    },
    feedback: { type: [FeedbackItemSchema], default: [] },
    summary: { type: String, default: null },
    error: { type: String, default: null },
    durationSeconds: { type: Number, default: null },
  },
  { timestamps: true },
);

export const InterviewSessionModel: Model<InterviewSession> =
  (mongoose.models.InterviewSession as Model<InterviewSession>) ||
  mongoose.model<InterviewSession>("InterviewSession", InterviewSessionSchema);
