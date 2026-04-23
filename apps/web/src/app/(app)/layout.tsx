import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { OnboardingBanner } from "@/components/shell/onboarding-banner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "stretch" }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <OnboardingBanner />
        <main style={{ padding: "0 32px" }}>{children}</main>
      </div>
    </div>
  );
}
