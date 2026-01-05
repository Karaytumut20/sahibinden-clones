const fs = require("fs");
const path = require("path");

const authTsPath = path.join(process.cwd(), "src/auth.ts");

if (fs.existsSync(authTsPath)) {
  let content = fs.readFileSync(authTsPath, "utf8");

  // Hatalı satır: adapter: PrismaAdapter(db),
  // Düzeltme: adapter: PrismaAdapter(db) as any,

  // Regex ile bul ve değiştir (Boşluklara ve virgüllere duyarlı)
  const regex = /adapter:\s*PrismaAdapter\(db\)(,?)/g;

  if (regex.test(content)) {
    content = content.replace(regex, "adapter: PrismaAdapter(db) as any$1");
    fs.writeFileSync(authTsPath, content, "utf8");
    console.log(
      "✅ src/auth.ts düzeltildi: Adapter tip hatası giderildi (as any eklendi)."
    );
  } else {
    console.log(
      "⚠️ Uyarı: src/auth.ts içinde değiştirilecek adapter satırı bulunamadı veya zaten düzeltilmiş."
    );
  }
} else {
  console.error("❌ Hata: src/auth.ts dosyası bulunamadı.");
}

console.log("🎉 İşlem tamamlandı. Tekrar build alabilirsiniz.");
