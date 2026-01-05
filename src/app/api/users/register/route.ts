
import { NextResponse } from "next/server";
import { db } from "@/lib/mock-db";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues.map(i => i.message).join(" | ") },
      { status: 400 }
    );
  }

  const { email, password, name, surname, phone } = parsed.data;

  // Mock kontrol
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ ok: false, error: "Bu e-posta zaten kayıtlı." }, { status: 409 });
  }

  // Şifre hashleme yok, mock ortamı
  const user = await db.user.create({
    data: {
      email,
      password, // Düz metin sakla (Mock)
      name,
      surname,
      phone: phone || null,
      role: "INDIVIDUAL",
    }
  });

  return NextResponse.json({ ok: true, user }, { status: 201 });
}
