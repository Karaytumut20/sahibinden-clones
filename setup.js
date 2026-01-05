const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Renkli konsol çıktıları için
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

console.log(
  `${colors.blue}🚀 Sahibinden-Clone Prisma Temizleme Aracı Başlatılıyor...${colors.reset}\n`
);

// 1. ADIM: Prisma Paketlerini Kaldır
try {
  console.log(
    `${colors.yellow}📦 Prisma paketleri kaldırılıyor (bu biraz sürebilir)...${colors.reset}`
  );
  execSync("npm uninstall prisma @prisma/client", { stdio: "inherit" });
  console.log(`${colors.green}✔ Paketler kaldırıldı.${colors.reset}\n`);
} catch (e) {
  console.log(
    `${colors.red}❌ Paket kaldırma sırasında hata (belki zaten yüklü değildi). Devam ediliyor...${colors.reset}\n`
  );
}

// 2. ADIM: Prisma Dosyalarını Sil
const filesToDelete = [
  "prisma", // Klasör
  ".env",
  "lib/prisma.ts",
  "lib/db.ts",
  "utils/db.ts",
  "utils/prisma.ts",
];

console.log(
  `${colors.yellow}🗑️  Gereksiz dosyalar taranıyor ve siliniyor...${colors.reset}`
);
filesToDelete.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`   - Silindi: ${file}`);
  }
});
console.log(`${colors.green}✔ Dosya temizliği tamamlandı.${colors.reset}\n`);

// 3. ADIM: package.json Temizliği (postinstall scripti)
console.log(`${colors.yellow}📝 package.json düzenleniyor...${colors.reset}`);
const packageJsonPath = path.join(__dirname, "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  if (
    packageJson.scripts &&
    packageJson.scripts.postinstall &&
    packageJson.scripts.postinstall.includes("prisma")
  ) {
    delete packageJson.scripts.postinstall;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(
      `${colors.green}✔ "postinstall": "prisma generate" satırı silindi.${colors.reset}\n`
    );
  } else {
    console.log(`${colors.green}✔ package.json zaten temiz.${colors.reset}\n`);
  }
}

// 4. ADIM: Sahte Veri (Mock Data) Dosyası Oluşturma
console.log(
  `${colors.yellow}🛠️  Veritabanı yerine kullanılacak sahte veriler oluşturuluyor...${colors.reset}`
);
const mockDataContent = `
// BU DOSYA OTOMATİK OLUŞTURULDU
// Veritabanı yerine bu verileri kullanın.

export const mockIlanlar = [
  {
    id: 1,
    baslik: "Sahibinden Temiz Aile Aracı",
    fiyat: 850000,
    aciklama: "Hatasız boyasız tramersiz.",
    kategori: "Vasıta",
    tarih: "2024-01-05",
    resim: "https://via.placeholder.com/300"
  },
  {
    id: 2,
    baslik: "Deniz Manzaralı 3+1 Daire",
    fiyat: 4500000,
    aciklama: "Merkezi konumda lüks daire.",
    kategori: "Emlak",
    tarih: "2024-01-04",
    resim: "https://via.placeholder.com/300"
  },
  {
    id: 3,
    baslik: "iPhone 14 Pro Max",
    fiyat: 65000,
    aciklama: "Kutulu faturalı garantili.",
    kategori: "Elektronik",
    tarih: "2024-01-06",
    resim: "https://via.placeholder.com/300"
  }
];

export const mockUsers = [
  { id: 1, name: "Ahmet Yılmaz", email: "ahmet@test.com" },
  { id: 2, name: "Ayşe Demir", email: "ayse@test.com" }
];
`;

// lib klasörü yoksa oluştur
if (!fs.existsSync(path.join(__dirname, "lib"))) {
  fs.mkdirSync(path.join(__dirname, "lib"));
}

fs.writeFileSync(path.join(__dirname, "lib", "mockData.ts"), mockDataContent);
console.log(
  `${colors.green}✔ 'lib/mockData.ts' dosyası oluşturuldu.${colors.reset}\n`
);

// 5. ADIM: Kod İçinde "prisma" Geçen Yerleri Bulma (Scanner)
console.log(
  `${colors.blue}🔍 PROJE TARANIYOR: Manuel düzeltmeniz gereken dosyalar bulunuyor...${colors.reset}`
);

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && f !== "node_modules" && f !== ".next" && f !== ".git") {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const foundFiles = [];
walkDir(__dirname, (filePath) => {
  if (
    filePath.endsWith(".ts") ||
    filePath.endsWith(".tsx") ||
    filePath.endsWith(".js")
  ) {
    // Kendi scriptimizi ve mock dosyamızı tarama
    if (filePath.includes("cleanup.js") || filePath.includes("mockData.ts"))
      return;

    const content = fs.readFileSync(filePath, "utf8");
    if (content.includes("prisma") || content.includes("@prisma")) {
      foundFiles.push(filePath);
    }
  }
});

if (foundFiles.length > 0) {
  console.log(
    `${colors.red}⚠️  AŞAĞIDAKİ DOSYALARDA HALA PRISMA KODLARI VAR!${colors.reset}`
  );
  console.log(
    `${colors.red}Bu dosyalara girip 'prisma' kodlarını silip, 'mockIlanlar' verisini kullanmalısınız:${colors.reset}\n`
  );
  foundFiles.forEach((f) => console.log(`👉 ${path.relative(__dirname, f)}`));
} else {
  console.log(
    `${colors.green}🎉 Harika! Kodlarınızda Prisma kalıntısı bulunamadı.${colors.reset}`
  );
}

console.log(`\n${colors.blue}✅ İŞLEM TAMAMLANDI.${colors.reset}`);
console.log(
  `Lütfen yukarıdaki listede belirtilen dosyaları açın ve veritabanı kodlarını 'lib/mockData.ts' verileriyle değiştirin.`
);
