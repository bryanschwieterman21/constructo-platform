'use client';

import { useAuth } from '@/hooks/use-auth';
import { getInitials } from '@/lib/utils';
import { LogOut, Bell } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/80 backdrop-blur-sm px-6">
      <div />
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-medium text-white shadow-sm">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user.firstName} {user.lastName}
            </span>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
