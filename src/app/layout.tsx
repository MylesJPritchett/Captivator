import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { applyRememberedAppearanceScript } from "@/appearance";
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
  title: "Captivator",
  description:
    "Design your WiFi Splash Page: add a Logo, Background, Text Blocks, Input Fields and a Connect Button, and see a live Preview.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The inline script sets the remembered Appearance on <html> before React
    // hydrates; suppressHydrationWarning keeps React from treating that as a
    // mismatch.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: applyRememberedAppearanceScript }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
