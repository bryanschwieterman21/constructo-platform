import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Constructo - Construction Management Platform',
  description: 'Manage your construction projects, RFIs, submittals, drawings, and finances in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
