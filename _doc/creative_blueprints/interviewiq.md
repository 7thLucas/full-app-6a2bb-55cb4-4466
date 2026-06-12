# InterviewIQ — Creative Blueprint

## Slide 1: Identity

**Product:** InterviewIQ
**Tagline:** Real feedback. Scored, structured, actionable.
**One-liner:** Upload an interview recording — get AI scores and coaching in minutes.

**Brand feel:** Premium analytics dashboard. Apple HIG-inspired. Warm but data-driven. Never clinical, never cold.

---

## Slide 2: Users & Jobs-to-be-Done

| User | Job |
|---|---|
| Hiring Manager | Review candidate recordings without rewatching 45-minute videos |
| Recruiter | Objectively compare candidates across a scored rubric |
| Job Candidate | Get coached feedback on their own practice or live recordings |

**Core tension resolved:** Replaces subjective "gut feel" with structured, repeatable analysis.

---

## Slide 3: Color & Type

| Token | Value | Use |
|---|---|---|
| Primary | `#1E3A5F` deep blue | Sidebar, headings, primary buttons |
| Accent | `#00D4C8` electric teal | Score rings (high), CTAs, active nav, badges |
| Background | `#F8FAFC` near-white | Page background |
| Surface | `#FFFFFF` + shadow | Cards, modals |
| Text | `#1A202C` dark slate | Body copy |
| Warning | `#F59E0B` amber | Mid-range scores (60–79) |
| Danger | `#EF4444` red | Low scores (0–59), errors |

**Typography:** Inter — bold tight-tracked headings, comfortable body.

---

## Slide 4: Information Architecture

```
/ → redirect → /sessions

/sessions
  Sidebar (deep blue) + main content area
  - Session grid cards (status badge, candidate, role, overall score ring)
  - "New Session" button → upload modal

/sessions/:sessionId
  - Header: title, candidate, role, status badge, overall score chip
  - Inline video player (dark bg, full aspect-video)
  - AI Summary paragraph
  - Feedback cards (strength / improvement / tip)
  - Score rings: Answer Quality · Communication · Confidence
  - Score bars: detailed breakdown + overall
  - Grade guide legend
```

---

## Slide 5: Core Flows

**Upload & Analyze**
1. Click "New Session" → modal opens
2. Fill title, candidate name, job role
3. Drop/select video file (MP4, WebM, MOV, ≤500 MB)
4. Submit → video uploads to file service → session created with status ANALYZING
5. Navigate to detail page → polling every 5 s
6. LLM returns scores + feedback → status DONE → page updates

**View Results**
- Overall score chip (color-coded teal/amber/red)
- Three score rings for sub-dimensions
- Progress bars for detailed breakdown
- Feedback cards grouped by category (strength, improvement, tip)
- Inline video for side-by-side review

**Delete Session**
- Hover card → Delete link (requires confirm dialog)
- Or from detail page header

---

## Slide 6: Score System

| Dimension | What it measures |
|---|---|
| Answer Quality (0–100) | Depth, relevance, structure (STAR method, specifics) |
| Communication Clarity (0–100) | Vocabulary, coherence, conciseness |
| Delivery Confidence (0–100) | Tone, pacing, energy, presence |
| Overall (0–100) | Holistic weighted average |

**Color thresholds:** ≥80 teal (excellent) · 60–79 amber (good) · <60 red (needs work)

---

## Slide 7: Component Inventory

| Component | Location | Purpose |
|---|---|---|
| `SidebarLayout` | `app/components/interview/sidebar-layout.tsx` | Deep-blue sidebar + main area shell |
| `SessionCard` | `app/components/interview/session-card.tsx` | Grid card with status, score, meta |
| `UploadModal` | `app/components/interview/upload-modal.tsx` | Drag-drop video upload form |
| `ScoreRing` | `app/components/interview/score-ring.tsx` | SVG circular score gauge |
| `ScoreBar` | `app/components/interview/score-bar.tsx` | Labeled horizontal progress bar |
| `FeedbackCard` | `app/components/interview/feedback-badge.tsx` | Color-coded feedback item |
| `StatusBadge` | `app/components/interview/feedback-badge.tsx` | PENDING/ANALYZING/DONE/ERROR pill |
| `useSessions` | `app/components/interview/use-sessions.ts` | List + delete hook with polling |
| `useSession` | `app/components/interview/use-sessions.ts` | Single session hook with auto-poll |

---

## Slide 8: API Surface

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/interview/sessions` | Upload video + create session + kick off analysis |
| GET | `/api/interview/sessions` | List all sessions |
| GET | `/api/interview/sessions/:id` | Single session detail |
| DELETE | `/api/interview/sessions/:id` | Remove session |

**Analysis pipeline:** video → uploader microservice (URL stored) → LLM via `/api/agents/llm` (multipart, 300 s timeout) → scores + feedback written back to MongoDB → status DONE.

---

## Slide 9: Data Model

**InterviewSession** (`tbl_interview_sessions` via Mongoose)

| Field | Type | Notes |
|---|---|---|
| sessionId | String | UUID, unique index |
| title | String | Session label |
| candidateName | String | |
| jobRole | String | |
| videoUrl | String | CDN URL from uploader |
| videoFilename | String | Original filename |
| status | Enum | PENDING / ANALYZING / DONE / ERROR |
| scores | Object | answerQuality, communicationClarity, deliveryConfidence, overall |
| feedback | Array | `{ category, text }` items |
| summary | String | 2–3 sentence AI summary |
| error | String | Populated on ERROR |

---

## Slide 10: Empty & Loading States

- **Sessions list empty:** illustration + "Upload First Session" CTA button in accent teal
- **Sessions loading:** centered spinner
- **Analyzing banner:** blue info bar on list page + full-panel pulsing state on detail
- **Error state:** red panel with error message and retry link
- **Card hover:** delete action fades in (opacity-0 → opacity-100)
