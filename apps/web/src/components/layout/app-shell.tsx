'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';

interface AppShellProps {
  children: React.ReactNode;
  projectId?: string;
  projectName?: string;
}

export function AppShell({ children, projectId, projectName }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar projectId={projectId} projectName={projectName} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
