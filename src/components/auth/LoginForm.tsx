import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";

export default function LoginForm() {
  return (
    <Card className="w-full shadow-xl border-t-4 border-t-[#ffd008]">
      <CardHeader className="space-y-1 text-center pb-2">
        <CardTitle className="text-2xl font-bold text-[#3b5062]">Giriş Yap</CardTitle>
        <p className="text-sm text-gray-500">
          Devam etmek için hesabına giriş yap
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="email">E-posta Adresi</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input id="email" type="email" placeholder="ornek@domain.com" className="pl-9 focus-visible:ring-[#3b5062]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700" htmlFor="password">Şifre</label>
            <Link href="#" className="text-xs text-blue-600 hover:underline">Şifremi Unuttum</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input id="password" type="password" className="pl-9 focus-visible:ring-[#3b5062]" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 bg-gray-50 pt-6 pb-6 border-t">
        <Button className="w-full bg-[#3b5062] hover:bg-[#2c3e4e] text-white font-semibold h-10 shadow-sm transition-all hover:shadow-md">
          Giriş Yap
        </Button>
        <div className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
          Hesabın yok mu? 
          <Link href="/register" className="text-blue-600 hover:underline font-bold">
            Hemen Üye Ol
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}