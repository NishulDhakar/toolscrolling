import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import GlobalShell from "@/components/GlobalShell";
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
  title: "ToolScrolling - Discover Dev & UI Tools",
  description: "A curated list of developer tools, UI libraries, and AI resources.",
};

const themeScript = `
  (function() {
    try {
      const stored = localStorage.getItem(’theme’);
      const systemDark = window.matchMedia(’(prefers-color-scheme: dark)’).matches;
      const theme = stored ? stored : (systemDark ? ‘dark’ : ‘light’);
      document.documentElement.setAttribute(’data-theme’, theme);
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative overflow-x-hidden`}
      >
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="5558b0e4-fbcd-46be-9a77-fe5fa183798c"
          strategy="afterInteractive"
        />

        <GlobalShell>{children}</GlobalShell>
      </body>
    </html>
  );
}
