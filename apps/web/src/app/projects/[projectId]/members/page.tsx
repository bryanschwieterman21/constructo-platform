'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { getInitials } from '@/lib/utils';
import { UserPlus } from 'lucide-react';

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  company?: {
    name: string;
  };
}

export default function MembersPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: Member[] }>(`/projects/${projectId}/members`)
      .then((res) => setMembers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <AppShell projectId={projectId}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                            {getInitials(member.user.firstName, member.user.lastName)}
                          </div>
                          <span className="font-medium">
                            {member.user.firstName} {member.user.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">{member.user.email}</TableCell>
                      <TableCell>
                        <StatusBadge status={member.role} />
                      </TableCell>
                      <TableCell className="text-gray-500">{member.company?.name || '-'}</TableCell>
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
