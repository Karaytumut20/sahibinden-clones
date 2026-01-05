const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  const absolutePath = path.join(process.cwd(), filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(absolutePath, content, "utf8");
  console.log(`✅ Dosya güncellendi: ${filePath}`);
}

console.log("🔄 Admin Actions Onarımı Başlıyor...");

// ---------------------------------------------------------
// src/actions/adminActions.ts (images include eklendi)
// ---------------------------------------------------------
const adminActionsContent = `"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdminOrThrow() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Giriş yapmalısınız.");
  if (session.user.role !== "ADMIN") throw new Error("Yetkisiz işlem.");
  return session;
}

export async function getPendingListings() {
  await requireAdminOrThrow();
  return db.listing.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, surname: true, email: true } },
      category: true,
      images: true, // DÜZELTME: Resimler artık ilişkisel tablo, include edilmeli.
    },
  });
}

export async function approveListing(listingId: string) {
  const session = await requireAdminOrThrow();

  await db.listing.update({
    where: { id: listingId },
    data: {
      status: "ACTIVE",
      moderatedAt: new Date(),
      moderatedById: session.user.id,
      moderationNote: null,
      publishedAt: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/listings");
  return { success: true };
}

export async function rejectListing(listingId: string, note?: string) {
  const session = await requireAdminOrThrow();

  await db.listing.update({
    where: { id: listingId },
    data: {
      status: "REJECTED",
      moderatedAt: new Date(),
      moderatedById: session.user.id,
      moderationNote: note ?? "İlan reddedildi.",
    },
  });

  revalidatePath("/admin/listings");
  return { success: true };
}
`;

writeFile("src/actions/adminActions.ts", adminActionsContent);

console.log("🎉 Onarım tamamlandı! Şimdi tekrar build alabilirsiniz.");
