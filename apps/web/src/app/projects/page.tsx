'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { FolderKanban, Plus, X } from 'lucide-react';

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
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  function loadProjects() {
    api
      .get<{ data: Project[] }>('/projects')
      .then((res) => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  function openForm() {
    setForm({ name: '', code: '', description: '', address: '', city: '', state: '', zip: '', startDate: '', endDate: '' });
    setError('');
    setShowForm(true);
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      setError('Name and Code are required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload: Record<string, string> = {
        name: form.name.trim(),
        code: form.code.trim(),
      };
      if (form.description.trim()) payload.description = form.description.trim();
      if (form.address.trim()) payload.address = form.address.trim();
      if (form.city.trim()) payload.city = form.city.trim();
      if (form.state.trim()) payload.state = form.state.trim();
      if (form.zip.trim()) payload.zip = form.zip.trim();
      if (form.startDate) payload.startDate = form.startDate;
      if (form.endDate) payload.endDate = form.endDate;

      await api.post('/projects', payload);
      setShowForm(false);
      setLoading(true);
      loadProjects();
    } catch (err: any) {
      setError(err.message || 'Failed to create project.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <Button onClick={openForm}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {showForm && (
          <Card>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Create Project</h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="name"
                    label="Project Name *"
                    placeholder="Downtown Office Tower"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                  <Input
                    id="code"
                    label="Project Code *"
                    placeholder="PRJ-2026-001"
                    value={form.code}
                    onChange={(e) => updateField('code', e.target.value)}
                  />
                </div>
                <Input
                  id="description"
                  label="Description"
                  placeholder="Brief project description"
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
                <Input
                  id="address"
                  label="Address"
                  placeholder="123 Main St"
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    id="city"
                    label="City"
                    placeholder="Austin"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                  <Input
                    id="state"
                    label="State"
                    placeholder="TX"
                    value={form.state}
                    onChange={(e) => updateField('state', e.target.value)}
                  />
                  <Input
                    id="zip"
                    label="ZIP"
                    placeholder="78701"
                    value={form.zip}
                    onChange={(e) => updateField('zip', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="startDate"
                    label="Start Date"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                  />
                  <Input
                    id="endDate"
                    label="End Date"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                  />
                </div>
              </CardContent>
              <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
            ) : projects.length === 0 ? (
              <EmptyState
                icon={<FolderKanban className="h-12 w-12" />}
                title="No projects yet"
                description="Create your first project to start managing construction."
                action={{ label: 'New Project', onClick: openForm }}
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
