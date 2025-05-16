import { Inter } from 'next/font/google';
import '../styles/globals.css';
import '../styles/layout.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { AnalysisProvider } from '@/contexts/AnalysisContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InsightHub - AI-Powered Business Intelligence',
  description: 'Turn your business data into actionable insights with AI-powered analytics and intelligence',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={'min-h-full dark'}>
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <AnalysisProvider>
              {children}
              <Toaster />
            </AnalysisProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
