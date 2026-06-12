import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
  Ref,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";
import { User } from "~/modules/authentication/authentication.model";

export enum SessionStatus {
  Pending = "pending",
  Analyzing = "analyzing",
  Completed = "completed",
  Failed = "failed",
}

@modelOptions({
  schemaOptions: {
    collection: "tbl_interview_sessions",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class InterviewSession extends CommonTypegooseEntity {
  @prop({ ref: () => User, required: true })
  user_id!: Ref<User>;

  @prop({ type: String, required: true, trim: true })
  session_title!: string;

  @prop({ type: String, required: false, trim: true })
  job_role?: string;

  @prop({ type: String, enum: SessionStatus, default: SessionStatus.Pending })
  status!: SessionStatus;

  /** ticket_id returned by audio-analyzer microservice */
  @prop({ type: String, required: false })
  ticket_id?: string;

  /** Overall score 0-100 (computed from category scores) */
  @prop({ type: Number, required: false })
  overall_score?: number;

  /** Snapshot of category scores map from analysis result */
  @prop({ type: Object, default: {} })
  category_scores!: Record<string, number>;

  /** AI-generated summary */
  @prop({ type: String, required: false })
  summary?: string;

  /** Duration in seconds */
  @prop({ type: Number, required: false })
  duration_seconds?: number;

  /** Raw analysis result stored for display */
  @prop({ type: Object, required: false })
  analysis_result?: Record<string, any>;
}

export const InterviewSessionModel = getModelForClass(InterviewSession);
