import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#3b5062]">Ayarlar</h1>

      {/* Kişisel Bilgiler */}
      <Card className="shadow-sm">
        <CardHeader className="border-b py-4">
            <CardTitle className="text-base font-bold text-gray-700">Üyelik Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ad</label>
                    <Input defaultValue="Ahmet" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Soyad</label>
                    <Input defaultValue="Yılmaz" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">E-posta</label>
                <Input defaultValue="ahmet.yilmaz@example.com" disabled className="bg-gray-100" />
                <p className="text-xs text-gray-500">E-posta adresi değiştirilemez.</p>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Telefon</label>
                <Input defaultValue="0532 555 44 33" />
            </div>
            <div className="pt-2">
                <Button className="bg-[#3b5062] hover:bg-[#2c3e4e]">Bilgileri Güncelle</Button>
            </div>
        </CardContent>
      </Card>

      {/* Şifre Değiştirme */}
      <Card className="shadow-sm">
        <CardHeader className="border-b py-4">
            <CardTitle className="text-base font-bold text-gray-700">Şifre Değiştir</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mevcut Şifre</label>
                <Input type="password" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Yeni Şifre</label>
                    <Input type="password" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Yeni Şifre (Tekrar)</label>
                    <Input type="password" />
                </div>
            </div>
            <div className="pt-2">
                <Button variant="outline" className="border-[#3b5062] text-[#3b5062] hover:bg-gray-50">Şifreyi Değiştir</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}