"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthNav() {
  const { data } = useSession();
  const user = data?.user;

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link className="text-sm hover:underline" href="/login">Giriş</Link>
        <Link className="text-sm hover:underline" href="/register">Kayıt</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700">{user.email}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm text-red-600 hover:underline"
      >
        Çıkış
      </button>
    </div>
  );
}