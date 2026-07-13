import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/shared/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeHaat — India's #1 Digital Code Marketplace",
  description:
    "Buy and sell production-grade digital assets with seamless GitHub integration. No .zip files — code delivered directly to your GitHub. Starting from ₹49. Only 2.5% commission.",
  keywords: [
    "CodeHaat",
    "digital marketplace",
    "code marketplace",
    "developer tools",
    "GitHub integration",
    "buy source code",
    "sell templates",
    "India marketplace",
    "B.Tech projects",
    "UI kits",
    "web templates",
  ],
  authors: [{ name: "CodeHaat" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='28' font-size='28'>⚡</text></svg>",
  },
  openGraph: {
    title: "CodeHaat — India's #1 Digital Code Marketplace",
    description:
      "Buy and sell production-grade digital assets. GitHub repo delivery. Only 2.5% commission.",
    url: "https://codehaat.com",
    siteName: "CodeHaat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeHaat — India's #1 Digital Code Marketplace",
    description:
      "No .zip files. GitHub repos delivered instantly. Only 2.5% commission.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
