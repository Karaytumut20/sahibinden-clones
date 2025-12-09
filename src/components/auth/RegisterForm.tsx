import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock, Phone } from "lucide-react";

export default function RegisterForm() {
  return (
    <Card className="w-full shadow-xl border-t-4 border-t-[#ffd008]">
      <CardHeader className="space-y-1 text-center pb-2">
        <CardTitle className="text-2xl font-bold text-[#3b5062]">Hesap Oluştur</CardTitle>
        <p className="text-sm text-gray-500">
          Hemen üye ol, ilanlarını yayınlamaya başla!
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Ad</label>
            <Input placeholder="Adınız" className="focus-visible:ring-[#3b5062]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Soyad</label>
            <Input placeholder="Soyadınız" className="focus-visible:ring-[#3b5062]" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">E-posta</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input type="email" placeholder="ornek@domain.com" className="pl-9 focus-visible:ring-[#3b5062]" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Telefon</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input type="tel" placeholder="05XX XXX XX XX" className="pl-9 focus-visible:ring-[#3b5062]" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Şifre</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input type="password" className="pl-9 focus-visible:ring-[#3b5062]" />
          </div>
        </div>

      </CardContent>
      <CardFooter className="flex flex-col gap-4 bg-gray-50 pt-6 pb-6 border-t">
        <Button className="w-full bg-[#3b5062] hover:bg-[#2c3e4e] text-white font-semibold h-10 shadow-sm">
          Üye Ol
        </Button>
        <div className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
          Zaten hesabın var mı? 
          <Link href="/login" className="text-blue-600 hover:underline font-bold">
            Giriş Yap
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}