'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Files, Plus, Folder, FileIcon, Download } from 'lucide-react';

interface DocFolder {
  id: string;
  name: string;
}

interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  createdAt: string;
  uploadedBy: { firstName: string; lastName: string };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [folders, setFolders] = useState<DocFolder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<DocFolder[]>(`/projects/${projectId}/folders`).catch(() => []),
      api.get<{ data: Document[] }>(`/projects/${projectId}/documents`).catch(() => ({ data: [] })),
    ]).then(([f, d]) => {
      setFolders(Array.isArray(f) ? f : []);
      setDocuments(d.data);
      setLoading(false);
    });
  }, [projectId]);

  return (
    <AppShell projectId={projectId}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <div className="flex gap-2">
            <Button variant="outline"><Plus className="mr-2 h-4 w-4" />New Folder</Button>
            <Button><Plus className="mr-2 h-4 w-4" />Upload</Button>
          </div>
        </div>

        {folders.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {folders.map((folder) => (
              <button
                key={folder.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-left hover:bg-gray-50"
              >
                <Folder className="h-8 w-8 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900">{folder.name}</span>
              </button>
            ))}
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
            ) : documents.length === 0 && folders.length === 0 ? (
              <EmptyState
                icon={<Files className="h-12 w-12" />}
                title="No documents yet"
                description="Upload project documents, plans, and specifications."
                action={{ label: 'Upload Document', onClick: () => {} }}
              />
            ) : (
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{doc.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">{formatFileSize(doc.fileSize)}</TableCell>
                      <TableCell className="text-gray-500">
                        {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}
                      </TableCell>
                      <TableCell className="text-gray-500">{formatDate(doc.createdAt)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
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
