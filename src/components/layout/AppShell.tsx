// @ts-nocheck
import { type ReactNode } from "react";
import { TopBar } from "./TopBar";
import { WorkspaceBar } from "./WorkspaceBar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <TopBar />
      <main className="flex-1 min-w-0 px-6 py-6">
        <div className="max-w-[1600px] w-full mx-auto">
          <WorkspaceBar />
          {children}
        </div>
      </main>
    </div>
  );
}
