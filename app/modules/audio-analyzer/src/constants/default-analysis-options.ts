import type { TranscriptionAnalysisOptions } from "../libs/types";

/**
 * Interview-specific analysis options for InterviewIQ.
 * Evaluates job candidates on answer quality, communication clarity,
 * confidence, and delivery.
 */
export const defaultAnalysisOptions: TranscriptionAnalysisOptions = {
  context:
    "Job interview session between a candidate and an interviewer. Evaluate the candidate's answer quality, communication clarity, confidence, and professional delivery. Focus on how well the candidate responds to questions.",
  speaker_roles: ["candidate", "interviewer", "other"],
  primary_role: "candidate",
  default_role: "interviewer",
  role_display: {
    candidate: "Candidate",
    interviewer: "Interviewer",
    other: "Other",
  },
  scoring_rules: [
    {
      id: "answer_quality",
      title: "Answer Quality",
      rule: "Score 0-{max_score} for relevance, depth, and structure of answers. Penalize vague, off-topic, or incomplete responses. Reward STAR method usage (Situation, Task, Action, Result).",
      params: { max_score: "100" },
    },
    {
      id: "communication_clarity",
      title: "Communication Clarity",
      rule: "Score 0-{max_score} for clear articulation, logical flow, and absence of filler words (um, uh, like). Penalize rambling, contradictions, or unclear phrasing.",
      params: { max_score: "100" },
    },
    {
      id: "confidence",
      title: "Confidence & Delivery",
      rule: "Score 0-{max_score} for confident tone, appropriate pacing, and assertive language. Penalize excessive hedging, uncertainty markers, and weak openers.",
      params: { max_score: "100" },
    },
    {
      id: "professionalism",
      title: "Professionalism",
      rule: "Score 0-{max_score} for professional language, respectful tone, and appropriate interview etiquette. Penalize informal slang, interruptions, or negative framing.",
      params: { max_score: "100" },
    },
  ],
};
