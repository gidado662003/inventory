import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { FaUserCircle } from "react-icons/fa";
import { Toaster } from "@/components/ui/sonner";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const now = new Date();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 h-screen`}
      >
        <Toaster />
        <div className="flex h-screen">
          {/* Sidebar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {/* Top Bar */}
            <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
              <div className="text-sm font-medium text-gray-700">
                {now.toDateString()}
              </div>
              <div className="flex items-center gap-4">
                <FaUserCircle className="text-2xl text-gray-600 cursor-pointer" />
                <p>Name</p>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
