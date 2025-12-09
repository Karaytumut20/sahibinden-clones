import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginForm() {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-blue-900">Giriş Yap</CardTitle>
        <p className="text-sm text-gray-500">
          Devam etmek için hesabına giriş yap
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">E-posta</label>
          <Input id="email" type="email" placeholder="ornek@domain.com" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none" htmlFor="password">Şifre</label>
            <Link href="#" className="text-xs text-blue-600 hover:underline">Şifremi Unuttum</Link>
          </div>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Giriş Yap</Button>
        <p className="text-xs text-center text-gray-500">
          Hesabın yok mu?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-semibold">
            Hemen Üye Ol
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}