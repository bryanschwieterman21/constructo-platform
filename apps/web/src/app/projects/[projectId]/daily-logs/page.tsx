'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Calendar, Plus, Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';

interface DailyLog {
  id: string;
  date: string;
  weather: string;
  tempHigh?: number;
  tempLow?: number;
  notes?: string;
  manpowerLogs: { id: string; headcount: number; hours: number; company: { name: string } }[];
  createdBy: { firstName: string; lastName: string };
}

const weatherIcons: Record<string, React.ReactNode> = {
  CLEAR: <Sun className="h-5 w-5 text-yellow-500" />,
  PARTLY_CLOUDY: <Cloud className="h-5 w-5 text-gray-400" />,
  CLOUDY: <Cloud className="h-5 w-5 text-gray-500" />,
  RAIN: <CloudRain className="h-5 w-5 text-blue-500" />,
  SNOW: <CloudSnow className="h-5 w-5 text-blue-300" />,
  WIND: <Wind className="h-5 w-5 text-gray-500" />,
};

export default function DailyLogsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: DailyLog[] }>(`/projects/${projectId}/daily-logs`)
      .then((res) => setLogs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <AppShell projectId={projectId}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Daily Logs</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Log
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
        ) : logs.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={<Calendar className="h-12 w-12" />}
                title="No daily logs yet"
                description="Record daily weather, manpower, and field notes."
                action={{ label: 'New Log', onClick: () => {} }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <Card key={log.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{formatDate(log.date)}</CardTitle>
                    <div className="flex items-center gap-2">
                      {weatherIcons[log.weather] || <Cloud className="h-5 w-5" />}
                      <span className="text-sm text-gray-500">
                        {log.weather.replace(/_/g, ' ')}
                        {log.tempHigh != null && ` ${log.tempHigh}°/${log.tempLow}°F`}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {log.notes && <p className="mb-3 text-sm text-gray-700">{log.notes}</p>}
                  {log.manpowerLogs.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Manpower</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {log.manpowerLogs.map((mp) => (
                          <div key={mp.id} className="rounded-lg bg-gray-50 p-3">
                            <p className="text-sm font-medium text-gray-900">{mp.company.name}</p>
                            <p className="text-xs text-gray-500">
                              {mp.headcount} workers - {mp.hours}hrs
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
