import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sahibinden Clone",
  description: "Türkiye'nin ilan ve alışveriş sitesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        
        {/* Ana İçerik Alanı */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>

        {/* Geçici Footer */}
        <footer className="bg-gray-200 py-6 text-center text-sm text-gray-500 mt-auto">
          <p>© 2025 Sahibinden Clone - Eğitim Amaçlıdır</p>
        </footer>
      </body>
    </html>
  );
}