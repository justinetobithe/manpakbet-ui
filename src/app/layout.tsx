import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
import { siteConfig } from "@/config/site";

const display = Sora({ variable: "--font-display", subsets: ["latin"], weight: ["600", "700", "800"] });
const body = Manrope({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
    title: { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s · ${siteConfig.name}` },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    openGraph: { title: siteConfig.name, description: siteConfig.description, type: "website" },
};

export const viewport: Viewport = {
    themeColor: "#0b0613",
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${display.variable} ${body.variable} bg-stage`}>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
