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
  title: 'PromptXub — Curated AI Prompts & Media Showcase',
  description: 'Explore, discover, and 1-click copy photorealistic and cinematic AI prompts for Midjourney v6, Flux.1, Runway Gen-3, Luma and Kling.',
  keywords: ['AI Prompts', 'Midjourney Prompts', 'Flux.1 Prompts', 'Runway Gen-3', 'AI Video Showcase', 'Prompt Engineering'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} antialiased selection:bg-neon-purple selection:text-white`}>
        <div className="min-h-screen flex flex-col bg-[#0F172A] text-slate-100 relative selection:bg-purple-600 selection:text-white">
          {/* Subtle Ambient Background Gradients */}
          <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          {children}
        </div>
      </body>
    </html>
  );
}
