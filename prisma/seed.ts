import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Veritabanı tohumlanıyor...');

  const categories = [
    { name: 'Emlak', slug: 'emlak', sub: ['Konut', 'İş Yeri', 'Arsa', 'Bina'] },
    { name: 'Vasıta', slug: 'vasita', sub: ['Otomobil', 'Arazi, SUV & Pickup', 'Motosiklet', 'Minivan & Panelvan'] },
    { name: 'Yedek Parça', slug: 'yedek-parca', sub: ['Otomotiv Ekipmanları', 'Motosiklet Ekipmanları'] },
    { name: 'İkinci El ve Sıfır Alışveriş', slug: 'alisveris', sub: ['Bilgisayar', 'Cep Telefonu', 'Fotoğraf & Kamera'] },
  ];

  for (const cat of categories) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug },
    });

    for (const subName of cat.sub) {
      const subSlug = subName.toLowerCase()
        .replace(/ /g, '-')
        .replace(/&/g, '')
        .replace(/,/g, '')
        .replace(/--/g, '-')
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');

      await prisma.category.upsert({
        where: { slug: subSlug },
        update: {},
        create: {
          name: subName,
          slug: subSlug,
          parentId: parent.id
        }
      });
    }
  }

  console.log('✅ Kategoriler başarıyla eklendi.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })