const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(process.cwd(), "package.json");

if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);

    if (packageJson.scripts) {
      let modified = false;

      // 1. build komutunu güncelle
      if (
        packageJson.scripts.build &&
        !packageJson.scripts.build.includes("prisma generate")
      ) {
        const oldBuild = packageJson.scripts.build;
        packageJson.scripts.build = `prisma generate && ${oldBuild}`;
        console.log(
          `✅ 'build' scripti güncellendi: "${oldBuild}" -> "${packageJson.scripts.build}"`
        );
        modified = true;
      } else {
        // HATA BURADAYDI: Tırnak işaretlerini düzelttik
        console.log("ℹ️ 'build' scripti zaten güncel veya bulunamadı.");
      }

      // 2. postinstall komutu ekle
      if (!packageJson.scripts.postinstall) {
        packageJson.scripts.postinstall = "prisma generate";
        console.log('✅ "postinstall" scripti eklendi: "prisma generate"');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(
          packageJsonPath,
          JSON.stringify(packageJson, null, 4),
          "utf8"
        );
        console.log("🎉 package.json başarıyla kaydedildi.");
      } else {
        console.log("✨ Herhangi bir değişiklik gerekmedi.");
      }
    }
  } catch (error) {
    console.error(
      "❌ package.json okunurken veya yazılırken hata oluştu:",
      error
    );
  }
} else {
  console.error("❌ package.json dosyası bulunamadı.");
}
