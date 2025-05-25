import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code",
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: "📊 Polymarket Predictions - Predict the Future",
  description: "Make informed predictions on future events with AI-powered insights! Advanced prediction interface for market events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceCode.variable} font-sourceCode antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
