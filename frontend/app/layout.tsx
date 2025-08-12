import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientNavbar from "@/components/ClientNavbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context";

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
  title: "Lanab Inventory",
  description: "Lanab Inventory",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 h-screen`}
      >
        <Toaster />
        <AuthProvider>
          <div className="flex h-screen">
            {/* Sidebar */}
            <ClientNavbar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
