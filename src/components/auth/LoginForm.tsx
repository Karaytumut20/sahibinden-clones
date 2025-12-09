"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginForm() {
  return (
    <Card className="shadow-lg border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-[#3b5062]">Giriş Yap</CardTitle>
        <CardDescription className="text-center">
          Sahibinden Clone hesabınıza erişin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none">E-Posta</label>
          <Input id="email" type="email" placeholder="ornek@email.com" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium leading-none">Şifre</label>
            <Link href="#" className="text-xs text-blue-600 hover:underline">Şifremi Unuttum</Link>
          </div>
          <Input id="password" type="password" />
        </div>
        <Button className="w-full bg-[#3b5062] hover:bg-[#2c3e4e] font-bold">
          Giriş Yap
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="text-sm text-center text-gray-500">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-semibold">
            Üye Ol
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}