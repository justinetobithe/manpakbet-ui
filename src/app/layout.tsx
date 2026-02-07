import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";
import { Toaster } from "@/components/ui/sonner";
import AppShell from "@/components/AppShell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ManpakBet",
  description: "ManpakBet UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
          <AppShell>{children}</AppShell>
          <Toaster richColors />
        </AppProviders>
      </body>
    </html>
  );
}
