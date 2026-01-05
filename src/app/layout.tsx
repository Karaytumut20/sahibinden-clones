import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sahibinden Clone",
  description: "Next.js ile geliştirilmiş klon proje",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
            <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
              <Header user={session?.user} /> 
              <main className="flex-1 container mx-auto px-4 py-6">
                {children}
              </main>
              <Footer />
            </div>
        </Providers>
      </body>
    </html>
  );
}
