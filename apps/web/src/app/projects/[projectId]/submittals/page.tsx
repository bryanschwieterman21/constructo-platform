'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { ClipboardCheck, Plus } from 'lucide-react';

interface Submittal {
  id: string;
  number: number;
  title: string;
  status: string;
  specSection?: string;
  dueDate?: string;
  assignee?: { firstName: string; lastName: string };
  createdAt: string;
}

export default function SubmittalsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [submittals, setSubmittals] = useState<Submittal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: Submittal[] }>(`/projects/${projectId}/submittals`)
      .then((res) => setSubmittals(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <AppShell projectId={projectId}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Submittals</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Submittal
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
            ) : submittals.length === 0 ? (
              <EmptyState
                icon={<ClipboardCheck className="h-12 w-12" />}
                title="No submittals yet"
                description="Create your first submittal to track shop drawings and materials."
                action={{ label: 'New Submittal', onClick: () => {} }}
              />
            ) : (
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Spec Section</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Created</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {submittals.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.number}</TableCell>
                      <TableCell className="max-w-xs truncate font-medium text-primary-600">
                        {sub.title}
                      </TableCell>
                      <TableCell className="text-gray-500">{sub.specSection || '-'}</TableCell>
                      <TableCell><StatusBadge status={sub.status} /></TableCell>
                      <TableCell className="text-gray-500">
                        {sub.assignee ? `${sub.assignee.firstName} ${sub.assignee.lastName}` : '-'}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {sub.dueDate ? formatDate(sub.dueDate) : '-'}
                      </TableCell>
                      <TableCell className="text-gray-500">{formatDate(sub.createdAt)}</TableCell>
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
