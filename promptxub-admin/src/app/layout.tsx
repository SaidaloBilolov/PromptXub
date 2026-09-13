import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PromptXub Admin Dashboard',
  description: 'Enterprise moderation and content management portal for PromptXub AI Platform',
  icons: {
    icon: [
      { url: '/circular-logo.png?v=4', type: 'image/png', sizes: '512x512' },
      { url: '/icon-192.png?v=4', type: 'image/png', sizes: '192x192' },
      { url: '/icon-32.png?v=4', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.ico?v=4', sizes: 'any' },
    ],
    shortcut: '/circular-logo.png?v=4',
    apple: [
      { url: '/apple-touch-icon.png?v=4', sizes: '180x180', type: 'image/png' },
      { url: '/circular-logo.png?v=4', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/png" href="/circular-logo.png?v=4" sizes="any" />
        <link rel="apple-touch-icon" href="/circular-logo.png?v=4" />
        <link rel="shortcut icon" href="/circular-logo.png?v=4" />
      </head>
      <body className={`${outfit.variable} ${jetbrainsMono.variable} antialiased bg-[#0F172A] text-slate-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
