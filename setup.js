const fs = require("fs");
const path = require("path");

// 1. Yeni SQLite Uyumlu Prisma Şeması
const sqliteSchemaContent = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// SQLite Enum desteklemez, String kullanıyoruz
model User {
  id            String    @id @default(cuid())
  name          String?
  surname       String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  phone         String?
  role          String    @default("INDIVIDUAL") // INDIVIDUAL, CORPORATE, ADMIN

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  listings      Listing[]
  favorites     Favorite[]
  store         Store?
  sentMessages     Message[] @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")
  moderatedListings Listing[] @relation("ModeratedBy")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Store {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  logo        String?
  phone       String?
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  listings    Listing[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Category {
  id        String     @id @default(cuid())
  name      String
  slug      String     @unique
  parentId  String?
  parent    Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryHierarchy")
  listings  Listing[]
}

model Listing {
  id          String        @id @default(cuid())
  title       String
  description String
  price       Decimal
  currency    String        @default("TL")
  city        String
  district    String

  // SQLite array desteklemediği için ilişki kullanıyoruz
  images      ListingImage[]

  status      String        @default("PENDING") // PENDING, ACTIVE, etc.

  userId      String
  user        User          @relation(fields: [userId], references: [id])
  storeId     String?
  store       Store?        @relation(fields: [storeId], references: [id])
  categoryId  String
  category    Category      @relation(fields: [categoryId], references: [id])
  favorites   Favorite[]
  messages    Message[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  moderatedAt     DateTime?
  moderationNote  String?
  moderatedById   String?
  moderatedBy     User? @relation("ModeratedBy", fields: [moderatedById], references: [id])
  publishedAt     DateTime?

  @@index([status])
  @@index([categoryId])
  @@index([userId])
}

// Yeni Resim Modeli (SQLite Array Desteklemediği İçin)
model ListingImage {
  id        String  @id @default(cuid())
  url       String
  listingId String
  listing   Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  listingId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  listing Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@unique([userId, listingId])
  @@index([userId])
  @@index([listingId])
}

model Message {
  id         String   @id @default(cuid())
  content    String
  senderId   String
  sender     User     @relation("SentMessages", fields: [senderId], references: [id])
  receiverId String
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
  listingId  String?
  listing    Listing? @relation(fields: [listingId], references: [id])
  isRead     Boolean  @default(false)
  createdAt  DateTime @default(now())

  @@index([senderId])
  @@index([receiverId])
  @@index([listingId])
}
`;

// 2. .env Dosyasını Güncelle
const envContent = `DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="demo"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="demo"
AUTH_SECRET="secret"
`;

function writeFile(filePath, content) {
  const absolutePath = path.join(process.cwd(), filePath);
  fs.writeFileSync(absolutePath, content, "utf8");
  console.log(`✅ Dosya güncellendi: ${filePath}`);
}

console.log("🔄 SQLite dönüşümü başlıyor...");

// Schema'yı yaz
writeFile("prisma/schema.prisma", sqliteSchemaContent);

// .env dosyasını güncelle
writeFile(".env", envContent);

// Eski migrations klasörünü sil (Çatışma olmaması için)
const migrationsDir = path.join(process.cwd(), "prisma/migrations");
if (fs.existsSync(migrationsDir)) {
  fs.rmSync(migrationsDir, { recursive: true, force: true });
  console.log("🗑️ Eski migrationlar temizlendi.");
}

console.log(`
🎉 Dönüşüm tamamlandı! Şimdi sırasıyla şunları yapın:

1. Veritabanını oluşturun:
   npx prisma migrate dev --name init

2. Projeyi başlatın:
   npm run dev

⚠️ DİKKAT: SQLite 'String[]' (Liste) desteklemediği için 'Listing' modelinde 'images' alanı artık ayrı bir tablo ('ListingImage') oldu.
Kodunuzda 'listing.images[0]' kullanan yerleri 'listing.images[0]?.url' şeklinde güncellemeniz gerekebilir.
`);
