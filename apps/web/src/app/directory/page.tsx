'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Building2, Plus, Phone, Mail, X } from 'lucide-react';

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
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    tradeType: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  function loadCompanies() {
    api
      .get<{ data: Company[] }>('/directory/companies')
      .then((res) => setCompanies(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  function openForm() {
    setForm({ name: '', tradeType: '', phone: '', email: '', address: '', city: '', state: '', zip: '' });
    setError('');
    setShowForm(true);
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Company name is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload: Record<string, string> = { name: form.name.trim() };
      if (form.tradeType.trim()) payload.tradeType = form.tradeType.trim();
      if (form.phone.trim()) payload.phone = form.phone.trim();
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.address.trim()) payload.address = form.address.trim();
      if (form.city.trim()) payload.city = form.city.trim();
      if (form.state.trim()) payload.state = form.state.trim();
      if (form.zip.trim()) payload.zip = form.zip.trim();

      await api.post('/directory/companies', payload);
      setShowForm(false);
      setLoading(true);
      loadCompanies();
    } catch (err: any) {
      setError(err.message || 'Failed to create company.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Directory</h1>
          <Button onClick={openForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>

        {showForm && (
          <Card>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Add Company</h2>
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
                    label="Company Name *"
                    placeholder="Acme Construction LLC"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                  <Input
                    id="tradeType"
                    label="Trade / Specialty"
                    placeholder="Electrical"
                    value={form.tradeType}
                    onChange={(e) => updateField('tradeType', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="phone"
                    label="Phone"
                    placeholder="+1-555-123-4567"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="info@acme.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>
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
              </CardContent>
              <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Company'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
            ) : companies.length === 0 ? (
              <EmptyState
                icon={<Building2 className="h-12 w-12" />}
                title="No companies in directory"
                description="Add subcontractors, vendors, and other companies you work with."
                action={{ label: 'Add Company', onClick: openForm }}
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
