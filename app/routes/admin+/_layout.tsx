import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { AuthProvider, useAuth } from "~/modules/authentication/use-authentication";
import { useConfigurables } from "~/modules/configurables";
import { apiRequest } from "~/lib/api.client";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { config } = useConfigurables();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const primary = config?.brandColor?.primary ?? "#1E3A5F";
  const accent = config?.brandColor?.accent ?? "#00BCD4";
  const appName = config?.appName ?? "InterviewIQ";

  async function handleLogout() {
    await apiRequest("/api/auth/logout", { method: "POST" });
    navigate("/");
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please sign in to continue</p>
          <Link to="/login" className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: primary }}>Sign In</Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm mb-4">Admin access required.</p>
          <Link to="/sessions" className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: primary }}>Go to Sessions</Link>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      to: "/admin",
      label: "Overview",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      to: "/admin/sessions",
      label: "All Sessions",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      ),
    },
    {
      to: "/admin/users",
      label: "Users",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shadow-sm shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: primary }}>IQ</div>
            <span className="font-bold text-sm" style={{ color: primary }}>{appName}</span>
          </Link>
          <div className="mt-2">
            <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accent}20`, color: accent }}>
              Admin Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={isActive ? { backgroundColor: `${primary}15`, color: primary } : { color: "#6B7280" }}
              >
                <span style={isActive ? { color: primary } : { color: "#9CA3AF" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-gray-100">
            <Link
              to="/sessions"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              User App
            </Link>
          </div>
        </nav>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: accent }}>
                {user?.username?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{user?.username}</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              title="Sign out"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AuthProvider>
      <AdminShell>
        <Outlet />
      </AdminShell>
    </AuthProvider>
  );
}
