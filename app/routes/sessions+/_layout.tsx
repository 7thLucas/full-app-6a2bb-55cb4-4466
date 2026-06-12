import { Outlet } from "react-router";
import { AuthProvider } from "~/modules/authentication/use-authentication";
import { AppShell } from "~/components/layout/app-shell";

export default function SessionsLayout() {
  return (
    <AuthProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </AuthProvider>
  );
}
