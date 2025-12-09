import { Button } from "@/components/ui/button";
import { Check, X, Eye, MoreHorizontal } from "lucide-react";

export default function AdminListingsPage() {
  const listings = [
    { id: 101, title: "iPhone 15 Pro Max - Acil Satılık", user: "Mehmet K.", date: "Bugün 14:30", status: "pending", price: "75.000 TL" },
    { id: 102, title: "Denize Sıfır Yazlık Bodrum", user: "Ayşe T.", date: "Dün 09:15", status: "active", price: "12.500.000 TL" },
    { id: 103, title: "2015 Model Honda Civic", user: "Veli B.", date: "2 Gün Önce", status: "rejected", price: "850.000 TL" },
    { id: 104, title: "Playstation 5 Oyun Konsolu", user: "Canan D.", date: "3 Gün Önce", status: "pending", price: "22.000 TL" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">İlan Yönetimi</h1>
        <div className="flex gap-2">
            <Button variant="outline" className="bg-white">Filtrele</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Dışa Aktar</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                    <th className="px-6 py-4">İlan Detayı</th>
                    <th className="px-6 py-4">Fiyat</th>
                    <th className="px-6 py-4">Satıcı</th>
                    <th className="px-6 py-4">Durum</th>
                    <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {listings.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500">ID: #{item.id} • {item.date}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-700">{item.price}</td>
                        <td className="px-6 py-4">{item.user}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                item.status === "active" ? "bg-green-50 text-green-700 border-green-200" :
                                item.status === "pending" ? "bg-orange-50 text-orange-700 border-orange-200" :
                                "bg-red-50 text-red-700 border-red-200"
                            }`}>
                                {item.status === "active" ? "Yayında" : item.status === "pending" ? "Onay Bekliyor" : "Reddedildi"}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                                {item.status === "pending" && (
                                    <>
                                        <Button size="icon" className="h-8 w-8 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 border-none shadow-none" title="Onayla">
                                            <Check size={16} />
                                        </Button>
                                        <Button size="icon" className="h-8 w-8 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-none shadow-none" title="Reddet">
                                            <X size={16} />
                                        </Button>
                                    </>
                                )}
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                                    <Eye size={16} />
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}