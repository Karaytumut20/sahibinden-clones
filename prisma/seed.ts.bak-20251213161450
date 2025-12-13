import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugifyTR(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

async function seedCategories() {
  console.log("🌱 Kategoriler ekleniyor...");
  const categories = [
    { name: "Emlak", slug: "emlak", sub: ["Konut", "İş Yeri", "Arsa", "Bina"] },
    { name: "Vasıta", slug: "vasita", sub: ["Otomobil", "Arazi, SUV & Pickup", "Motosiklet", "Minivan & Panelvan"] },
    { name: "Yedek Parça", slug: "yedek-parca", sub: ["Otomotiv Ekipmanları", "Motosiklet Ekipmanları"] },
    { name: "İkinci El ve Sıfır Alışveriş", slug: "alisveris", sub: ["Bilgisayar", "Cep Telefonu", "Fotoğraf & Kamera"] },
  ];

  for (const cat of categories) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug },
    });

    for (const subName of cat.sub) {
      const subSlug = slugifyTR(subName);
      await prisma.category.upsert({
        where: { slug: subSlug },
        update: { parentId: parent.id },
        create: { name: subName, slug: subSlug, parentId: parent.id },
      });
    }
  }

  console.log("✅ Kategoriler hazır.");
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@sahibindenclone.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";

  console.log("👑 Admin kullanıcı kontrol ediliyor...");
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", password: hash, name: "Super", surname: "Admin" },
    create: {
      email,
      password: hash,
      role: "ADMIN",
      name: "Super",
      surname: "Admin",
    },
  });

  console.log(`✅ Admin hazır: ${email}`);
}

async function main() {
  console.log("🌱 Seed başlıyor...");
  await seedCategories();
  await seedAdmin();
  console.log("🎉 Seed bitti.");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
