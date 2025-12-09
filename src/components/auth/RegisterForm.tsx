"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterForm() {
  return (
    <Card className="shadow-lg border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-[#3b5062]">Üye Ol</CardTitle>
        <CardDescription className="text-center">
          Hemen ücretsiz hesap oluşturun
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Ad</label>
            <Input placeholder="Adınız" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Soyad</label>
            <Input placeholder="Soyadınız" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">E-Posta</label>
          <Input type="email" placeholder="ornek@email.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Şifre</label>
          <Input type="password" />
        </div>
        <Button className="w-full bg-[#3b5062] hover:bg-[#2c3e4e] font-bold">
          Kayıt Ol
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="text-sm text-center text-gray-500">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Giriş Yap
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}