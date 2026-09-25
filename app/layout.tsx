import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { ToastHost } from "@/components/ui/toast";
import { AppShell } from "@/components/layout/app-shell";
import { SearchOverlay } from "@/components/search/search-overlay";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "NexaAI — AI workspace demo",
  description:
    "A polished, frontend-only AI SaaS workspace — chat, projects, documents, templates and usage, all simulated locally.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${display.variable}`}>
        <AppProvider>
          <AppShell>{children}</AppShell>
          <ToastHost />
          <SearchOverlay />
        </AppProvider>
      </body>
    </html>
  );
}