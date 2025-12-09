import StoreCard from "@/components/stores/StoreCard";
import Breadcrumb from "@/components/ui/breadcrumb-custom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function StoresPage() {
  const stores = [
    { id: "guven-emlak", name: "Güven Emlak & Gayrimenkul", logo: "https://placehold.co/150x100?text=Guven+Emlak", category: "Emlak Ofisi", location: "İstanbul / Kadıköy", phone: "0216 555 44 33", listingCount: 42 },
    { id: "yildiz-galeri", name: "Yıldız Otomotiv", logo: "https://placehold.co/150x100?text=Yildiz+Oto", category: "Galeri", location: "Ankara / Çankaya", phone: "0312 444 22 11", listingCount: 15 },
    { id: "teknik-insaat", name: "Teknik İnşaat", logo: "https://placehold.co/150x100?text=Teknik+Yapi", category: "İnşaat Firması", location: "İzmir / Bornova", phone: "0232 333 11 00", listingCount: 8 },
    { id: "mega-motors", name: "Mega Motors", logo: "https://placehold.co/150x100?text=Mega+Motors", category: "Galeri", location: "Bursa / Nilüfer", phone: "0224 222 99 88", listingCount: 24 },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Mağazalar" }]} />

      <div className="mb-8 bg-white p-6 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold text-[#3b5062] mb-2">Mağazalar</h1>
        <p className="text-gray-500 text-sm mb-6">Türkiye genelindeki emlak ofisleri, galeriler ve mağazaları inceleyin.</p>
        
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input placeholder="Mağaza adı, yetkili veya telefon no ile arayın..." className="pl-10 h-11" />
            </div>
            <Button className="h-11 px-8 bg-[#3b5062] hover:bg-[#2c3e4e]">Mağaza Ara</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {stores.map((store) => (
            <StoreCard key={store.id} {...store} />
        ))}
      </div>
    </div>
  );
}