
import { Sidebar } from "@/components/layout/sidebar";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto p-6 bg-background">
        {children}
      </main>
    </div>
  );
}
