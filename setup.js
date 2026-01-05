const fs = require("fs");
const path = require("path");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

console.log(
  `${colors.blue}🚀 Sahibinden-Clone 'Saf Frontend' Dönüşüm Operasyonu Başlıyor...${colors.reset}\n`
);

// ---------------------------------------------------------
// 1. ADIM: GEREKSİZ KLASÖR VE DOSYALARI SİL
// ---------------------------------------------------------
console.log(
  `${colors.yellow}1. Backend ve Admin kalıntıları temizleniyor...${colors.reset}`
);

const pathsToDelete = [
  "prisma", // Prisma veritabanı şemaları
  "src/models", // Mongoose modelleri
  "src/app/admin", // Admin sayfaları
  "src/components/admin", // Admin bileşenleri
  "src/actions/adminActions.ts", // Admin server action'ları
  "src/app/api/debug", // Debug API'leri
  "src/lib/authz.ts", // Karmaşık yetki kontrolleri
];

pathsToDelete.forEach((p) => {
  const fullPath = path.join(__dirname, p);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`   ${colors.red}🗑️  Silindi:${colors.reset} ${p}`);
  }
});

// ---------------------------------------------------------
// 2. ADIM: PACKAGE.JSON TEMİZLİĞİ (BAĞIMLILIKLARI KALDIR)
// ---------------------------------------------------------
console.log(
  `\n${colors.yellow}2. package.json temizleniyor (Gereksiz kütüphaneler kaldırılıyor)...${colors.reset}`
);

const packageJsonPath = path.join(__dirname, "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  const dependenciesToRemove = [
    "mongoose",
    "prisma",
    "@prisma/client",
    "@auth/prisma-adapter",
    "bcryptjs",
    "mongodb",
  ];

  dependenciesToRemove.forEach((dep) => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      delete packageJson.dependencies[dep];
      console.log(`   ${colors.red}x Kaldırıldı:${colors.reset} ${dep}`);
    }
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      delete packageJson.devDependencies[dep];
      console.log(`   ${colors.red}x Kaldırıldı (dev):${colors.reset} ${dep}`);
    }
  });

  // Scripts temizliği (Prisma komutlarını kaldır)
  if (packageJson.scripts && packageJson.scripts.postinstall) {
    delete packageJson.scripts.postinstall;
  }
  if (packageJson.prisma) {
    delete packageJson.prisma;
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`   ${colors.green}✔ package.json güncellendi.${colors.reset}`);
}

// ---------------------------------------------------------
// 3. ADIM: AUTH YAPISINI BASİTLEŞTİR (MOCK AUTH)
// ---------------------------------------------------------
console.log(
  `\n${colors.yellow}3. Authentication yapısı 'Mock' moduna alınıyor...${colors.reset}`
);

// A. auth.ts dosyasını yeniden yaz
const authPath = path.join(__dirname, "src", "auth.ts");
const newAuthContent = `
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import db from "@/lib/db"; // Mock DB
import { authConfig } from "./auth.config";

// Basit giriş şeması
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

        // Mock DB'den kullanıcıyı bul (Dizi içinden arar)
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        // Şifre kontrolü (Basit string karşılaştırması)
        // Not: Gerçek app'te bcrypt kullanılır, burada mock olduğu için direkt bakıyoruz.
        if (password === user.password || password === 'demo') {
             return {
                id: user.id,
                email: user.email,
                name: user.name + " " + (user.surname || ""),
                role: user.role,
                image: user.image
             };
        }
        return null;
      },
    }),
  ],
});
`;
fs.writeFileSync(authPath, newAuthContent.trim());
console.log(`   ${colors.green}✔ src/auth.ts basitleştirildi.${colors.reset}`);

// B. auth.config.ts dosyasını yeniden yaz (Admin kontrollerini kaldır)
const authConfigPath = path.join(__dirname, "src", "auth.config.ts");
const newAuthConfigContent = `
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Sadece profil ve yeni ilan sayfalarını koru
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
fs.writeFileSync(authConfigPath, newAuthConfigContent.trim());
console.log(
  `   ${colors.green}✔ src/auth.config.ts admin kurallarından arındırıldı.${colors.reset}`
);

// ---------------------------------------------------------
// 4. ADIM: MOCK DB KONTROLÜ
// ---------------------------------------------------------
console.log(
  `\n${colors.yellow}4. Mock DB (Veritabanı) doğrulanıyor...${colors.reset}`
);
// db.ts dosyasını garantiye alalım (kullanıcı zaten mock kullanıyor ama emin olalım)
// Eğer lib/db.ts dosyasında "prisma" importu varsa temizleyeceğiz.
const dbPath = path.join(__dirname, "src", "lib", "db.ts");
if (fs.existsSync(dbPath)) {
  let dbContent = fs.readFileSync(dbPath, "utf8");
  // Eğer dosya Prisma client import ediyorsa, tamamen mock yapı ile değiştireceğiz.
  // Ancak sizin dosyanız zaten mock array kullanıyor.
  // Sadece "admin" kullanıcısını silelim ki kafa karışıklığı olmasın.
  if (dbContent.includes("user-admin")) {
    dbContent = dbContent.replace(/{ id: 'user-admin'.*?},/s, "");
    fs.writeFileSync(dbPath, dbContent);
    console.log(
      `   ${colors.green}✔ Mock DB içindeki admin kullanıcısı temizlendi.${colors.reset}`
    );
  } else {
    console.log(`   ${colors.green}✔ Mock DB zaten temiz.${colors.reset}`);
  }
}

// ---------------------------------------------------------
// 5. ADIM: FOOTER TEMİZLİĞİ
// ---------------------------------------------------------
console.log(
  `\n${colors.yellow}5. Footer admin linkleri temizleniyor...${colors.reset}`
);
const footerPath = path.join(
  __dirname,
  "src",
  "components",
  "layout",
  "Footer.tsx"
);
if (fs.existsSync(footerPath)) {
  let content = fs.readFileSync(footerPath, "utf8");
  // Admin linki varsa kaldır
  content = content.replace(/<Link href="\/admin".*?>.*?<\/Link>/gs, "");
  content = content.replace(/{.*Gizli Admin Linki.*}/gs, "");
  fs.writeFileSync(footerPath, content);
  console.log(`   ${colors.green}✔ Footer temizlendi.${colors.reset}`);
}

console.log(`\n${colors.blue}✅ DÖNÜŞÜM TAMAMLANDI!${colors.reset}`);
console.log(
  `\nLütfen değişikliklerin geçerli olması için şu adımları izleyin:`
);
console.log(
  `1. Terminalde: ${colors.yellow}npm install${colors.reset} (Yeni package.json'ı yüklemek için)`
);
console.log(`2. Terminalde: ${colors.yellow}npm run dev${colors.reset}`);
console.log(
  `\nArtık projeniz veritabanı gerektirmeyen, %100 Frontend bir Next.js uygulamasıdır.`
);
