import { NextResponse } from "next/server";
import db from "@/lib/db";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) return NextResponse.json({ ok: false, error: "Hata" }, { status: 400 });

  const { email, password, name, surname, phone } = parsed.data;
  const exists = await db.user.findUnique({ where: { email } });

  if (exists) return NextResponse.json({ ok: false, error: "E-posta kayıtlı." }, { status: 409 });

  const user = await db.user.create({
    data: { email, password, name, surname, phone, role: "INDIVIDUAL" }
  });

  return NextResponse.json({ ok: true, user }, { status: 201 });
}