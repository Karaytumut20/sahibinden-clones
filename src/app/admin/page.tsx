import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListVideo, Users, AlertCircle, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Toplam İlan", value: "12,450", icon: ListVideo, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Onay Bekleyen", value: "45", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Toplam Üye", value: "3,200", icon: Users, color: "text-green-600", bg: "bg-green-100" },
    { label: "Günlük Ziyaret", value: "15K", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Genel Bakış</h1>
      
      {/* İstatistikler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                        <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

      {/* Onay Bekleyen Son İlanlar */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-700">Onay Bekleyen Son İlanlar</CardTitle>
            <a href="/admin/listings" className="text-sm text-blue-600 hover:underline">Tümünü Gör</a>
        </CardHeader>
        <CardContent className="p-0">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                    <tr>
                        <th className="px-6 py-3">İlan Başlığı</th>
                        <th className="px-6 py-3">Kullanıcı</th>
                        <th className="px-6 py-3">Tarih</th>
                        <th className="px-6 py-3">Durum</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {[1, 2, 3, 4].map((i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-800">Sahibinden Temiz Araç 202{i} Model</td>
                            <td className="px-6 py-4">Ahmet Yılmaz</td>
                            <td className="px-6 py-4 text-gray-500">10 Dakika önce</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    İnceleniyor
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </CardContent>
      </Card>
    </div>
  );
}