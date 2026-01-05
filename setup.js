const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

console.log(
  `${colors.blue}🚀 Sahibinden-Clone 'Saf Frontend' Dönüşüm Aracı Başlatılıyor...${colors.reset}\n`
);

// ---------------------------------------------------------
// 1. ADIM: DOSYA VE KLASÖRLERİ SİL (Admin, API, Prisma)
// ---------------------------------------------------------
const pathsToDelete = [
  "prisma",
  "src/app/admin",
  "src/components/admin",
  "src/app/api",
  "src/actions/adminActions.ts",
];

console.log(
  `${colors.yellow}🗑️  Gereksiz Backend ve Admin dosyaları siliniyor...${colors.reset}`
);

pathsToDelete.forEach((p) => {
  const fullPath = path.join(__dirname, p);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`   - Silindi: ${p}`);
  }
});
console.log(`${colors.green}✔ Dosya temizliği tamamlandı.${colors.reset}\n`);

// ---------------------------------------------------------
// 2. ADIM: Footer.tsx'den Admin Linkini Kaldır
// ---------------------------------------------------------
console.log(
  `${colors.yellow}📝 Footer düzenleniyor (Admin linki kaldırılıyor)...${colors.reset}`
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
  // Admin linkini regex ile bul ve kaldır
  const regex = /<Link href="\/admin".*?>\s*Yönetici Girişi\s*<\/Link>/s;
  if (content.match(regex)) {
    content = content.replace(regex, "");
    fs.writeFileSync(footerPath, content);
    console.log(`${colors.green}✔ Footer temizlendi.${colors.reset}`);
  } else {
    console.log(`   - Footer zaten temiz veya desen bulunamadı.`);
  }
}

// ---------------------------------------------------------
// 3. ADIM: auth.config.ts'den Admin Kontrolünü Kaldır
// ---------------------------------------------------------
console.log(
  `${colors.yellow}📝 Auth Config düzenleniyor (Admin yetki kontrolü kaldırılıyor)...${colors.reset}`
);
const authConfigPath = path.join(__dirname, "src", "auth.config.ts");
if (fs.existsSync(authConfigPath)) {
  let content = fs.readFileSync(authConfigPath, "utf8");

  // Admin path kontrolünü kaldır
  content = content.replace(
    /const isOnAdmin = nextUrl\.pathname\.startsWith\("\/admin"\);/g,
    ""
  );

  // Yetki kontrol bloğunu temizle
  content = content.replace(
    /if \(isOnAdmin\) \{[\s\S]*?return isLoggedIn && \(auth\?\.user as any\)\?\.role === "ADMIN";[\s\S]*?\}/g,
    ""
  );

  fs.writeFileSync(authConfigPath, content);
  console.log(`${colors.green}✔ Auth Config temizlendi.${colors.reset}`);
}

// ---------------------------------------------------------
// 4. ADIM: db.ts'den Admin Kullanıcısını Kaldır
// ---------------------------------------------------------
console.log(
  `${colors.yellow}📝 Mock Veritabanı düzenleniyor (Admin kullanıcısı siliniyor)...${colors.reset}`
);
const dbPath = path.join(__dirname, "src", "lib", "db.ts");
if (fs.existsSync(dbPath)) {
  let content = fs.readFileSync(dbPath, "utf8");

  // Admin kullanıcısını listeden sil
  const adminUserRegex = /\{ id: 'user-admin',.*?\},/s;
  content = content.replace(adminUserRegex, "");

  fs.writeFileSync(dbPath, content);
  console.log(`${colors.green}✔ Mock DB temizlendi.${colors.reset}`);
}

// ---------------------------------------------------------
// 5. ADIM: auth.ts'den Admin Şifre Kontrolünü Kaldır
// ---------------------------------------------------------
console.log(`${colors.yellow}📝 Auth Logic düzenleniyor...${colors.reset}`);
const authPath = path.join(__dirname, "src", "auth.ts");
if (fs.existsSync(authPath)) {
  let content = fs.readFileSync(authPath, "utf8");

  // " || password === 'admin'" kısmını kaldır
  content = content.replace(" || password === 'admin'", "");

  fs.writeFileSync(authPath, content);
  console.log(`${colors.green}✔ Auth logic temizlendi.${colors.reset}`);
}

console.log(`\n${colors.blue}✅ İŞLEM TAMAMLANDI!${colors.reset}`);
console.log(`Proje artık saf bir kullanıcı arayüzü (Frontend) uygulamasıdır.`);
console.log(`Lütfen değişiklikleri kaydetmek için şu komutları çalıştırın:\n`);
console.log(`1. git add .`);
console.log(
  `2. git commit -m "Remove admin and backend parts for pure frontend"`
);
console.log(`3. git push origin master`);
