import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Ivy Homes",
  description: "Browse verified listings, rentals and projects across Bangalore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-[#F8F8F8] text-[#303030] flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
