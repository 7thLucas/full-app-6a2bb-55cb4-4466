import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { AuthProvider, useAuth } from "~/modules/authentication/use-authentication";

function LandingContent() {
  const { config, loading } = useConfigurables();
  const { isAuthenticated, isAdmin } = useAuth();

  const appName = loading ? "InterviewIQ" : (config?.appName ?? "InterviewIQ");
  const tagline = loading ? "AI-Powered Interview Performance Review" : ((config as any)?.tagline ?? "AI-Powered Interview Performance Review");
  const heroTitle = loading ? "Know Exactly How You Performed" : ((config as any)?.heroTitle ?? "Know Exactly How You Performed");
  const heroSubtitle = loading
    ? "Upload your interview recording. Get objective, structured feedback on answer quality, clarity, confidence, and delivery — in minutes."
    : ((config as any)?.heroSubtitle ?? "Upload your interview recording. Get objective, structured feedback on answer quality, clarity, confidence, and delivery — in minutes.");
  const ctaLabel = loading ? "Analyze My Interview" : ((config as any)?.ctaLabel ?? "Analyze My Interview");
  const footerText = loading ? "© 2026 InterviewIQ. All rights reserved." : ((config as any)?.footerText ?? "© 2026 InterviewIQ. All rights reserved.");

  const primary = config?.brandColor?.primary ?? "#1E3A5F";
  const accent = config?.brandColor?.accent ?? "#00BCD4";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          {config?.logoUrl && config.logoUrl !== "FILL_LOGO_URL_HERE" ? (
            <img src={config.logoUrl} alt={appName} className="h-8 w-8 object-contain rounded" />
          ) : (
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: primary }}
            >
              IQ
            </div>
          )}
          <span className="font-bold text-lg" style={{ color: primary }}>{appName}</span>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/sessions"
                className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: primary }}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: primary }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <span
          className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6"
          style={{ backgroundColor: `${accent}20`, color: accent }}
        >
          {tagline}
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight" style={{ color: primary }}>
          {heroTitle}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed">
          {heroSubtitle}
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            to={isAuthenticated ? "/sessions/upload" : "/register"}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-base shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: accent }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {ctaLabel}
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-gray-700 text-base bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full text-left">
          {[
            { icon: "🎯", title: "Answer Quality", desc: "Scores response depth, relevance, and use of structured frameworks like STAR." },
            { icon: "💬", title: "Communication Clarity", desc: "Detects filler words, rambling, and coherence issues with actionable rewrites." },
            { icon: "💪", title: "Confidence & Delivery", desc: "Analyzes pacing, tone, and assertiveness to surface what strong candidates sound like." },
            { icon: "🏅", title: "Professionalism", desc: "Flags informal language, negative framing, and interview etiquette issues." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-24 max-w-3xl w-full text-left">
          <h2 className="text-2xl font-bold text-center mb-12" style={{ color: primary }}>How It Works</h2>
          <div className="flex flex-col sm:flex-row gap-8">
            {[
              { step: "1", title: "Upload Your Video", desc: "Drag and drop your interview recording — MP4, WebM, or MOV." },
              { step: "2", title: "AI Analyzes", desc: "Our AI transcribes speech and scores every dimension of your performance." },
              { step: "3", title: "Get Your Report", desc: "Receive a detailed breakdown by category with specific, actionable feedback." },
            ].map((s) => (
              <div key={s.step} className="flex-1 flex gap-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ backgroundColor: primary }}>
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center">
        <p className="text-sm text-gray-400">{footerText}</p>
      </footer>
    </div>
  );
}

export default function IndexPage() {
  return (
    <AuthProvider>
      <LandingContent />
    </AuthProvider>
  );
}
