'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { PenTool, Plus } from 'lucide-react';

interface DrawingSet {
  id: string;
  name: string;
  description?: string;
  issueDate?: string;
  drawings: {
    id: string;
    number: string;
    title: string;
    discipline: string;
    currentRev: string;
  }[];
  createdAt: string;
}

export default function DrawingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [sets, setSets] = useState<DrawingSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: DrawingSet[] }>(`/projects/${projectId}/drawing-sets`)
      .then((res) => setSets(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <AppShell projectId={projectId}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Drawings</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Drawing Set
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
        ) : sets.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={<PenTool className="h-12 w-12" />}
                title="No drawing sets yet"
                description="Upload your first set of construction drawings."
                action={{ label: 'Upload Drawings', onClick: () => {} }}
              />
            </CardContent>
          </Card>
        ) : (
          sets.map((set) => (
            <Card key={set.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{set.name}</CardTitle>
                    {set.issueDate && (
                      <p className="text-sm text-gray-500">Issued: {formatDate(set.issueDate)}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm">Add Drawing</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHead>Number</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Discipline</TableHead>
                      <TableHead>Rev</TableHead>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {set.drawings.map((dwg) => (
                      <TableRow key={dwg.id}>
                        <TableCell className="font-medium">{dwg.number}</TableCell>
                        <TableCell>{dwg.title}</TableCell>
                        <TableCell>
                          <StatusBadge status={dwg.discipline} />
                        </TableCell>
                        <TableCell className="font-mono">{dwg.currentRev}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AppShell>
  );
}
