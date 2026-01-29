import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Octavertex Media Platform",
    template: "%s | Octavertex Media",
  },
  description: "Complete in-house platform for attendance, time tracking, task & project management, chat, notifications, and HR workflows.",
  keywords: [
    "project management",
    "time tracking",
    "attendance",
    "team collaboration",
    "task management",
    "HR platform",
    "leave management",
  ],
  authors: [{ name: "Octavertex Media" }],
  creator: "Octavertex Media",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://platform.octavertex.com",
    siteName: "Octavertex Media Platform",
    title: "Octavertex Media Platform",
    description: "Complete in-house platform for attendance, time tracking, task & project management, chat, notifications, and HR workflows.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Octavertex Media Platform",
    description: "Complete in-house platform for attendance, time tracking, task & project management, chat, notifications, and HR workflows.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
