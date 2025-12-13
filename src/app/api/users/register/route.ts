import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { registerSchema } from "@/lib/validators/auth";

export const runtime = "nodejs";

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

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ ok: false, error: "Bu e-posta zaten kayıtlı." }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email,
      password: hash,
      name,
      surname,
      phone: phone || null,
      role: "INDIVIDUAL",
    },
    select: { id: true, email: true, name: true, surname: true },
  });

  return NextResponse.json({ ok: true, user }, { status: 201 });
}