import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Website 1 Wun",
  description: "A modern learning management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 py-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
