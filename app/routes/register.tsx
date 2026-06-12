import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { apiRequest } from "~/lib/api.client";

export default function RegisterPage() {
  const { config, loading } = useConfigurables();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const appName = loading ? "InterviewIQ" : (config?.appName ?? "InterviewIQ");
  const primary = config?.brandColor?.primary ?? "#1E3A5F";
  const accent = config?.brandColor?.accent ?? "#00BCD4";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await apiRequest("/api/auth/register", {
        method: "POST",
        data: { username, email, password },
      });
      if (res.success) {
        navigate("/sessions");
      } else {
        setError(res.message ?? "Registration failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: primary }}>IQ</div>
          <span className="font-bold text-lg" style={{ color: primary }}>{appName}</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="text-sm text-gray-500 mt-1">Start getting objective interview feedback</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  placeholder="johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  placeholder="Min. 8 characters"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg font-semibold text-white text-sm transition-opacity disabled:opacity-60"
                style={{ backgroundColor: primary }}
              >
                {submitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: accent }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
