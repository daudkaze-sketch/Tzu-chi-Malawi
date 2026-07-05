import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { LanguageProvider } from '@/lib/i18n';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tzu Chi Malawi Office",
  description: "Office digitalization system for Tzu Chi Malawi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <LanguageProvider>
          <Navigation />
        </LanguageProvider>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
