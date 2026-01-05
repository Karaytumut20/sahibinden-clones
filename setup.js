const fs = require("fs");
const path = require("path");

// Yardımcı: Dosya/Klasör Silme
const removePath = (relativePath) => {
  const fullPath = path.join(__dirname, relativePath);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`❌ Silindi: ${relativePath}`);
  } else {
    console.log(`⚠️ Bulunamadı (Zaten temiz): ${relativePath}`);
  }
};

// Yardımcı: Dosya Yazma
const writeFile = (relativePath, content) => {
  const fullPath = path.join(__dirname, relativePath);
  // Klasör yoksa oluştur
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(fullPath, content.trim());
  console.log(`✅ Güncellendi: ${relativePath}`);
};

console.log(
  "🚀 Sahibinden Clone - Saf Frontend Dönüşümü ve Onarımı Başlıyor...\n"
);

// ---------------------------------------------------------
// 1. ADIM: BACKEND VE ADMIN DOSYALARINI SİL
// ---------------------------------------------------------
console.log("📦 1. Gereksiz Backend/Admin dosyaları temizleniyor...");
const pathsToDelete = [
  "prisma", // Prisma şemaları
  "src/models", // Mongoose modelleri
  "src/app/admin", // Admin sayfaları
  "src/components/admin", // Admin bileşenleri
  "src/actions/adminActions.ts", // Admin aksiyonları
  "src/app/api/debug", // Debug API'leri
  "src/lib/authz.ts", // Yetki kontrolleri
];
pathsToDelete.forEach((p) => removePath(p));

// ---------------------------------------------------------
// 2. ADIM: PACKAGE.JSON TEMİZLİĞİ
// ---------------------------------------------------------
console.log("\n📦 2. package.json temizleniyor...");
const packageJsonPath = path.join(__dirname, "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Silinecek paketler
  const depsToRemove = [
    "mongoose",
    "prisma",
    "@prisma/client",
    "@auth/prisma-adapter",
    "bcryptjs",
    "mongodb",
  ];

  depsToRemove.forEach((dep) => {
    if (packageJson.dependencies?.[dep]) delete packageJson.dependencies[dep];
    if (packageJson.devDependencies?.[dep])
      delete packageJson.devDependencies[dep];
  });

  // Prisma scriptlerini kaldır
  if (packageJson.scripts) {
    delete packageJson.scripts.postinstall;
    delete packageJson.scripts["prisma:generate"];
    delete packageJson.scripts["prisma:push"];
  }
  delete packageJson.prisma; // Prisma config

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("✅ package.json veritabanı bağımlılıklarından arındırıldı.");
}

// ---------------------------------------------------------
// 3. ADIM: FOOTER.TSX ONARIMI (HATA DÜZELTME)
// ---------------------------------------------------------
console.log("\n🛠️ 3. Footer.tsx onarılıyor (Admin linki kaldırılıyor)...");
const footerContent = `
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10 text-sm text-gray-600">
      <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div>
          <h4 className="font-bold text-[#3b5062] mb-4">Kurumsal</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-blue-600">Hakkımızda</Link></li>
            <li><Link href="#" className="hover:text-blue-600">İnsan Kaynakları</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Haberler</Link></li>
            <li><Link href="#" className="hover:text-blue-600">İletişim</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#3b5062] mb-4">Hizmetlerimiz</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-blue-600">Doping</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Güvenli e-Ticaret</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Reklam Verin</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Mobil Uygulamalar</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#3b5062] mb-4">Gizlilik</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-blue-600">Kullanım Koşulları</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Üyelik Sözleşmesi</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Gizlilik Politikası</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Çerez Yönetimi</Link></li>
          </ul>
        </div>
        <div className="col-span-2 lg:col-span-2">
          <h4 className="font-bold text-[#3b5062] mb-4">Bizi Takip Edin</h4>
          <div className="flex gap-4 mb-6">
            <a href="#" className="p-2 bg-white border rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors"><Facebook size={18} /></a>
            <a href="#" className="p-2 bg-white border rounded-full hover:border-pink-600 hover:text-pink-600 transition-colors"><Instagram size={18} /></a>
            <a href="#" className="p-2 bg-white border rounded-full hover:border-sky-500 hover:text-sky-500 transition-colors"><Twitter size={18} /></a>
            <a href="#" className="p-2 bg-white border rounded-full hover:border-blue-700 hover:text-blue-700 transition-colors"><Linkedin size={18} /></a>
          </div>
          <div className="bg-white p-4 border rounded-lg shadow-sm inline-block">
             <div className="flex items-center gap-3">
                <Phone size={24} className="text-blue-600" />
                <div>
                    <div className="text-xs text-gray-500">7/24 Destek Hattı</div>
                    <div className="font-bold text-lg text-[#3b5062]">0850 222 44 44</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-[#3b5062] text-white/80 py-4 text-xs">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <p>© 2025 Sahibinden Clone. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
`;
writeFile("src/components/layout/Footer.tsx", footerContent);

// ---------------------------------------------------------
// 4. ADIM: AUTH CONFIG (ADMIN KONTROLÜNÜ KALDIR)
// ---------------------------------------------------------
console.log("\n🔒 4. Auth Config güncelleniyor...");
const authConfigContent = `
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnNewListing = nextUrl.pathname.startsWith("/new-listing");

      if (isOnProfile || isOnNewListing) {
        return isLoggedIn;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as any) ?? "INDIVIDUAL";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
`;
writeFile("src/auth.config.ts", authConfigContent);

// ---------------------------------------------------------
// 5. ADIM: AUTH.TS (MOCK KULLANIMINI GARANTİLE)
// ---------------------------------------------------------
console.log("\n🔒 5. Auth Logic (auth.ts) güncelleniyor...");
const authContent = `
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import db from "@/lib/db";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // Mock DB'den kullanıcı bul
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        // Basit şifre kontrolü (Mock veriler için)
        if (password === user.password || password === 'demo') {
             return {
                id: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                role: user.role,
             } as any;
        }
        return null;
      },
    }),
  ],
});
`;
writeFile("src/auth.ts", authContent);

console.log("\n✨ DÖNÜŞÜM BAŞARIYLA TAMAMLANDI!");
console.log("--------------------------------------------------");
console.log("Lütfen şimdi terminalde sırasıyla şu komutları çalıştırın:");
console.log("1. npm install    (Gereksiz paketlerin silinmesi için)");
console.log("2. npm run dev    (Projeyi başlatmak için)");
console.log("--------------------------------------------------");
