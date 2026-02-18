import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { DataProvider } from "@/lib/data-store";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreelaCRM - Gestão de Clientes",
  description: "Sistema completo de gestão de clientes para freelancer de marketing digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <DataProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            {/* Main content area */}
            <main className="flex-1 lg:pl-64">
              {/* Spacer for mobile header */}
              <div className="h-16 lg:h-0" />
              <div className="p-4 md:p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
          <Toaster richColors position="top-right" />
        </DataProvider>
      </body>
    </html>
  );
}
