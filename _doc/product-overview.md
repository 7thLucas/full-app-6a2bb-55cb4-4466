# InterviewIQ

## What It Does
AI-powered interview video reviewer. Users upload interview session videos and receive AI-scored feedback on answer quality, communication clarity, and delivery confidence.

## Users
- Hiring managers reviewing candidate interviews
- Recruiters assessing candidate performance
- Job candidates wanting feedback on their own interview recordings

## Brand & Tone
Professional, intelligent, analytical. Sharp and modern. Not clinical — warm but data-driven.

## Core Value
Real, actionable feedback replacing subjective gut-feel with scored, structured analysis.

## Features
- Upload interview video sessions (MP4, WebM, MOV up to 500 MB)
- AI analysis via LLM: scores for answer quality, communication clarity, delivery confidence
- Structured feedback: strengths, areas for improvement, tips
- Session management: list, view, delete
- Live polling while analysis is in progress
- Visual score rings and progress bars
- Inline video playback

## Tech
- Backend: Express + MongoDB (InterviewSession model), uploader microservice for video storage, agentic LLM for analysis
- Frontend: Remix flat routes, React hooks for data fetching, Tailwind CSS
- Routes: /sessions (list), /sessions/:sessionId (detail)
- API: POST/GET/DELETE /api/interview/sessions, GET /api/interview/sessions/:id
