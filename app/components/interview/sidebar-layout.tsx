import { Link, useLocation } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import type { ReactNode } from "react";

interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation();
  const { config } = useConfigurables();

  const navItems = [
    {
      href: "/sessions",
      label: "Sessions",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-[#1E3A5F] flex flex-col">
        {/* Logo area */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#00D4C8" }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              {config?.appName ?? "InterviewIQ"}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/30 leading-relaxed">
            AI-powered interview analysis
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
