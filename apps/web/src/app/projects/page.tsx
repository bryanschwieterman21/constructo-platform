'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { FolderKanban, Plus } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  code: string;
  status: string;
  city?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: Project[] }>('/projects')
      .then((res) => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
            ) : projects.length === 0 ? (
              <EmptyState
                icon={<FolderKanban className="h-12 w-12" />}
                title="No projects yet"
                description="Create your first project to start managing construction."
                action={{ label: 'New Project', onClick: () => {} }}
              />
            ) : (
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>Project</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Created</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Link
                          href={`/projects/${project.id}/rfis`}
                          className="font-medium text-primary-600 hover:text-primary-800"
                        >
                          {project.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-500">{project.code}</TableCell>
                      <TableCell className="text-gray-500">
                        {project.city ? `${project.city}, ${project.state}` : '-'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={project.status} />
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {project.startDate ? formatDate(project.startDate) : '-'}
                      </TableCell>
                      <TableCell className="text-gray-500">{formatDate(project.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
