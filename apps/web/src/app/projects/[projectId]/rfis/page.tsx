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
import { FileText, Plus } from 'lucide-react';

interface Rfi {
  id: string;
  number: number;
  subject: string;
  status: string;
  priority: string;
  dueDate?: string;
  createdBy: { firstName: string; lastName: string };
  assignee?: { firstName: string; lastName: string };
  createdAt: string;
}

export default function RfisPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [rfis, setRfis] = useState<Rfi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: Rfi[] }>(`/projects/${projectId}/rfis`)
      .then((res) => setRfis(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <AppShell projectId={projectId}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">RFIs</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New RFI
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
            ) : rfis.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-12 w-12" />}
                title="No RFIs yet"
                description="Create your first Request for Information."
                action={{ label: 'New RFI', onClick: () => {} }}
              />
            ) : (
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>#</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Created</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {rfis.map((rfi) => (
                    <TableRow key={rfi.id}>
                      <TableCell className="font-medium">{rfi.number}</TableCell>
                      <TableCell className="max-w-xs truncate font-medium text-primary-600">
                        {rfi.subject}
                      </TableCell>
                      <TableCell><StatusBadge status={rfi.status} /></TableCell>
                      <TableCell><StatusBadge status={rfi.priority} /></TableCell>
                      <TableCell className="text-gray-500">
                        {rfi.assignee ? `${rfi.assignee.firstName} ${rfi.assignee.lastName}` : '-'}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {rfi.dueDate ? formatDate(rfi.dueDate) : '-'}
                      </TableCell>
                      <TableCell className="text-gray-500">{formatDate(rfi.createdAt)}</TableCell>
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
