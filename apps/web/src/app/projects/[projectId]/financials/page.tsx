'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface Budget {
  id: string;
  name: string;
  lineItems: {
    id: string;
    costCode: string;
    description: string;
    originalAmount: number;
    committedCost: number;
    actualCost: number;
  }[];
}

interface Contract {
  id: string;
  title: string;
  type: string;
  amount: number;
  status: string;
  company?: { name: string };
}

export default function FinancialsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ data: Budget[] }>(`/projects/${projectId}/budgets`).catch(() => ({ data: [] })),
      api.get<{ data: Contract[] }>(`/projects/${projectId}/contracts`).catch(() => ({ data: [] })),
    ]).then(([b, c]) => {
      setBudgets(b.data);
      setContracts(c.data);
      setLoading(false);
    });
  }, [projectId]);

  const totalBudget = budgets.reduce(
    (sum, b) => sum + b.lineItems.reduce((s, li) => s + li.originalAmount, 0),
    0,
  );
  const totalCommitted = budgets.reduce(
    (sum, b) => sum + b.lineItems.reduce((s, li) => s + li.committedCost, 0),
    0,
  );
  const totalActual = budgets.reduce(
    (sum, b) => sum + b.lineItems.reduce((s, li) => s + li.actualCost, 0),
    0,
  );

  return (
    <AppShell projectId={projectId}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Financials</h1>
          <div className="flex gap-2">
            <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Budget</Button>
            <Button><Plus className="mr-2 h-4 w-4" />Contract</Button>
          </div>
        </div>

        {!loading && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-4 py-6">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Budget</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 py-6">
                  <div className="rounded-lg bg-yellow-50 p-3">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Committed</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(totalCommitted)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 py-6">
                  <div className="rounded-lg bg-green-50 p-3">
                    <TrendingDown className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Actual Cost</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(totalActual)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Contracts</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.title}</TableCell>
                        <TableCell><StatusBadge status={c.type} /></TableCell>
                        <TableCell className="text-gray-500">{c.company?.name || '-'}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(c.amount)}</TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
