"use client";
import { SessionProvider } from 'next-auth/react';
import Layout from '../Layout';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>
            <SessionProvider>{children}</SessionProvider>
        </Layout>
      </body>
    </html>
  );
}
