import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterForm() {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-blue-900">Hesap Oluştur</CardTitle>
        <p className="text-sm text-gray-500">
          Hemen üye ol, ilanlarını yayınla!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="name">Ad Soyad</label>
          <Input id="name" placeholder="Adınız Soyadınız" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">E-posta</label>
          <Input id="email" type="email" placeholder="ornek@domain.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="password">Şifre</label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Üye Ol</Button>
        <p className="text-xs text-center text-gray-500">
          Zaten hesabın var mı?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Giriş Yap
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}