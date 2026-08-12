import "./globals.css";
import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";

const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "T Martin Training",
  description: "Strength coaching built on discipline, mindset, and proven training.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-brand-cream text-brand-black font-body">
        {children}
      </body>
    </html>
  );
}
