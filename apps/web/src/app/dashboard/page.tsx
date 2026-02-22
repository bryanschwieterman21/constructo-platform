'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { FolderKanban, FileText, ClipboardCheck, Plus } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  code: string;
  status: string;
  city?: string;
  state?: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({ projects: 0, rfis: 0, submittals: 0 });

  useEffect(() => {
    api.get<{ data: Project[]; meta: any }>('/projects', { limit: 5 }).then((res) => {
      setProjects(res.data);
      setStats((prev) => ({ ...prev, projects: res.meta.total }));
    }).catch(() => {});
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of your construction projects</p>
          </div>
          <Link href="/projects">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white shadow-lg shadow-primary-600/20">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-white/20 p-3">
                <FolderKanban className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-primary-100">Active Projects</p>
                <p className="text-2xl font-bold">{stats.projects}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 p-6 text-white shadow-lg shadow-sky-500/20">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-white/20 p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-sky-100">Open RFIs</p>
                <p className="text-2xl font-bold">{stats.rfis}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 text-white shadow-lg shadow-indigo-500/20">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-white/20 p-3">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-indigo-100">Pending Submittals</p>
                <p className="text-2xl font-bold">{stats.submittals}</p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {projects.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                No projects yet. Create your first project to get started.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/projects/${project.id}/rfis`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-500">
                          {project.code}
                          {project.city && ` - ${project.city}, ${project.state}`}
                        </p>
                      </div>
                      <StatusBadge status={project.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
