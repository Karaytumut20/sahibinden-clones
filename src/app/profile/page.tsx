import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, List, Heart, MessageSquare } from "lucide-react";

export default function ProfilePage() {
  const stats = [
    { label: "Yayındaki İlanlar", value: "3", icon: List, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Toplam Görüntülenme", value: "1,240", icon: Eye, color: "text-green-600", bg: "bg-green-100" },
    { label: "Favoriye Alınma", value: "45", icon: Heart, color: "text-red-600", bg: "bg-red-100" },
    { label: "Okunmamış Mesaj", value: "2", icon: MessageSquare, color: "text-yellow-600", bg: "bg-yellow-100" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#3b5062]">Özet Durum</h1>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
            <Card key={i} className="shadow-sm">
                <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full">
                    <div className={`p-3 rounded-full mb-3 ${stat.bg} ${stat.color}`}>
                        <stat.icon size={24} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </CardContent>
            </Card>
        ))}
      </div>

      {/* Son Hareketler / Bildirimler */}
      <Card className="shadow-sm">
        <CardHeader className="border-b py-4">
            <CardTitle className="text-lg font-bold text-[#3b5062]">Son Hareketler</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <ul className="divide-y text-sm">
                <li className="p-4 hover:bg-gray-50 flex justify-between items-center">
                    <span><strong>Passat 2018</strong> ilanınız onaylandı ve yayına alındı.</span>
                    <span className="text-gray-400 text-xs">Bugün</span>
                </li>
                <li className="p-4 hover:bg-gray-50 flex justify-between items-center">
                    <span><strong>iPhone 15</strong> ilanınızın süresi dolmak üzere.</span>
                    <span className="text-gray-400 text-xs">Dün</span>
                </li>
                <li className="p-4 hover:bg-gray-50 flex justify-between items-center">
                    <span><strong>Mehmet K.</strong> size yeni bir mesaj gönderdi.</span>
                    <span className="text-gray-400 text-xs">3 Gün Önce</span>
                </li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}