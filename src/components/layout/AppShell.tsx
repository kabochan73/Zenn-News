import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

type AppShellProps = {
  children: ReactNode;
  hideNav?: boolean;
};

export function AppShell({ children, hideNav = false }: AppShellProps) {
  return (
    <>
      <Header minimal={hideNav} />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      {!hideNav && <BottomNav />}
    </>
  );
}
