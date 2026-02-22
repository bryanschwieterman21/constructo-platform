'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  FileText,
  ClipboardCheck,
  Calendar,
  PenTool,
  DollarSign,
  Files,
  Settings,
  HardHat,
  Users,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Directory', href: '/directory', icon: Building2 },
];

const projectNavigation = [
  { name: 'RFIs', href: 'rfis', icon: FileText },
  { name: 'Submittals', href: 'submittals', icon: ClipboardCheck },
  { name: 'Daily Logs', href: 'daily-logs', icon: Calendar },
  { name: 'Drawings', href: 'drawings', icon: PenTool },
  { name: 'Financials', href: 'financials', icon: DollarSign },
  { name: 'Documents', href: 'documents', icon: Files },
  { name: 'Members', href: 'members', icon: Users },
];

interface SidebarProps {
  projectId?: string;
  projectName?: string;
}

export function Sidebar({ projectId, projectName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-gradient-to-b from-primary-950 to-primary-900">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
          <HardHat className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Constructo</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-primary-200 hover:bg-white/10 hover:text-white',
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {projectId && (
          <>
            <div className="mt-6 mb-2 px-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-400">
                {projectName || 'Project'}
              </p>
            </div>
            <ul className="space-y-1">
              {projectNavigation.map((item) => {
                const href = `/projects/${projectId}/${item.href}`;
                const isActive = pathname === href;
                return (
                  <li key={item.name}>
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-white/15 text-white shadow-sm'
                          : 'text-primary-200 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>

      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-200 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
