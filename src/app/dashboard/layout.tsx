"use client";

import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh bg-sw-canvas text-sw-ink antialiased">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col min-h-dvh">
        {/* Mobile menu is fixed (Sidebar). Top inset lives on each page sticky header so
            there is no empty canvas strip + no h-screen + pt stacking overflow scroll. */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col px-0 pb-0 pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
