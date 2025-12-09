import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MyListingsPage() {
  const listings = [
    { id: 101, title: "Sahibinden Temiz Passat 2018", price: "1.250.000 TL", status: "Yayında", image: "https://placehold.co/100x75?text=Arac" },
    { id: 102, title: "iPhone 15 Pro Max - Kutusunda", price: "85.000 TL", status: "Onay Bekliyor", image: "https://placehold.co/100x75?text=Telefon" },
    { id: 103, title: "Kullanılmamış Oyuncu Koltuğu", price: "5.000 TL", status: "Pasif", image: "https://placehold.co/100x75?text=Koltuk" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#3b5062]">İlanlarım</h1>
        <Link href="/new-listing">
            <Button className="bg-blue-600 hover:bg-blue-700">Yeni İlan Ekle</Button>
        </Link>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        {listings.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 p-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
                {/* Resim */}
                <div className="relative w-full md:w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>

                {/* Bilgi */}
                <div className="flex-1 text-center md:text-left w-full">
                    <h3 className="font-semibold text-[#3b5062] line-clamp-1">{item.title}</h3>
                    <div className="text-red-600 font-bold text-sm">{item.price}</div>
                    <div className="text-xs text-gray-400 mt-1">İlan No: {item.id}</div>
                </div>

                {/* Durum */}
                <div className="w-full md:w-auto text-center">
                    <Badge variant="outline" className={`
                        ${item.status === "Yayında" ? "bg-green-50 text-green-700 border-green-200" : ""}
                        ${item.status === "Onay Bekliyor" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                        ${item.status === "Pasif" ? "bg-gray-50 text-gray-600 border-gray-200" : ""}
                    `}>
                        {item.status}
                    </Badge>
                </div>

                {/* Aksiyonlar */}
                <div className="flex gap-2 w-full md:w-auto justify-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 bg-blue-50 hover:bg-blue-100"><Edit size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 bg-gray-100 hover:bg-gray-200"><Eye size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 bg-red-50 hover:bg-red-100"><Trash2 size={14} /></Button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}