import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'NGFW Dashboard',
    template: '%s | NGFW Dashboard'
  },
  description: 'Elegant security management interface for next generation firewall',
  keywords: ['firewall', 'security', 'network', 'cybersecurity', 'dashboard', 'ngfw', 'fortinet'],
  authors: [{ name: 'NGFW Dashboard Team' }],
  creator: 'NGFW Dashboard Team',
  publisher: 'NGFW Dashboard',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'NGFW Dashboard - Next Generation Firewall',
    description: 'Elegant security management interface for next generation firewall',
    siteName: 'NGFW Dashboard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NGFW Dashboard',
    description: 'Elegant security management interface for next generation firewall',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
