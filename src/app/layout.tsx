import { Inter } from 'next/font/google';
import '../styles/globals.css';
import '../styles/layout.css';
import { ReactNode, useEffect } from 'react';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

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
  if (typeof window !== 'undefined') {
    console.log('Firebase environment variables set:', {
      apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  return (
    <html lang="en" className={'min-h-full dark'}>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
