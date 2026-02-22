'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';
import { Building2, Plus, Phone, Mail } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  tradeType?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  contacts: { id: string; firstName: string; lastName: string; isPrimary: boolean }[];
}

export default function DirectoryPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: Company[] }>('/directory/companies')
      .then((res) => setCompanies(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Directory</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
            ) : companies.length === 0 ? (
              <EmptyState
                icon={<Building2 className="h-12 w-12" />}
                title="No companies in directory"
                description="Add subcontractors, vendors, and other companies you work with."
                action={{ label: 'Add Company', onClick: () => {} }}
              />
            ) : (
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>Company</TableHead>
                    <TableHead>Trade</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => {
                    const primaryContact = company.contacts.find((c) => c.isPrimary) || company.contacts[0];
                    return (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell className="text-gray-500">{company.tradeType || '-'}</TableCell>
                        <TableCell className="text-gray-500">
                          {company.city ? `${company.city}, ${company.state}` : '-'}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {primaryContact
                            ? `${primaryContact.firstName} ${primaryContact.lastName}`
                            : '-'}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {company.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />{company.phone}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {company.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />{company.email}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
