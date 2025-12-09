import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Eğer Header/Footer bileşenleriniz henüz yoksa veya yolları farklıysa bu satırlar hata verebilir.
// Standart yapıya göre varsayılmıştır. Hata alırsanız bu iki satırı geçici olarak yorum satırı yapın.
import Header from "@/components/layout/Header"; 
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sahibinden Clone",
  description: "Next.js ile geliştirilmiş klon proje",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
           {/* Header bileşeni varsa göster, yoksa hata vermemesi için kontrol edilebilir ama burada direkt koyuyoruz */}
           <Header /> 
          <main className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>
           <Footer />
        </div>
      </body>
    </html>
  );
}