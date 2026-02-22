'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.patch('/users/me', form);
      setMessage('Profile updated successfully');
    } catch {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                label="First Name"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
              />
              <Input
                id="lastName"
                label="Last Name"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
              />
            </div>
            <Input id="email" label="Email" value={user?.email || ''} disabled />
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
