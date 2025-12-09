import ListingCard from "@/components/listings/ListingCard";
import Breadcrumb from "@/components/ui/breadcrumb-custom";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Globe, Share2 } from "lucide-react";
import Image from "next/image";

export default async function StoreDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 15+ için params asenkron hale getirildi
  const { slug } = await params;
  
  // Slug''a göre isim formatla (Örn: guven-emlak -> Güven Emlak)
  const storeName = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Mağazalar", href: "/magazalar" }, { label: storeName }]} />

      {/* Mağaza Header / Banner */}
      <div className="bg-white border rounded-lg shadow-sm mb-6 overflow-hidden">
        {/* Banner Alanı */}
        <div className="h-32 bg-gradient-to-r from-blue-900 to-[#3b5062]"></div>
        
        <div className="px-6 pb-6 relative flex flex-col md:flex-row items-start md:items-end justify-between gap-4 -mt-10 md:-mt-0">
            
            {/* Logo ve İsim */}
            <div className="flex items-end gap-4">
                <div className="w-32 h-32 bg-white rounded-lg border-4 border-white shadow-md relative overflow-hidden -mt-10 md:-mt-16">
                    <Image 
                        src={`https://placehold.co/200x200?text=${storeName.charAt(0)}`} 
                        alt={storeName} 
                        fill 
                        className="object-contain p-2" 
                    />
                </div>
                <div className="mb-1">
                    <h1 className="text-2xl font-bold text-[#3b5062]">{storeName}</h1>
                    <p className="text-sm text-gray-500">Kurumsal Üye • 5. Yıl</p>
                </div>
            </div>

            {/* İletişim Butonları */}
            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                <Button className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 gap-2">
                    <Phone size={16} /> 0216 555 44 33
                </Button>
                <Button variant="outline" className="gap-2">
                    <Share2 size={16} /> Paylaş
                </Button>
            </div>
        </div>

        {/* Alt Bilgi Barı */}
        <div className="bg-gray-50 px-6 py-3 border-t flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-gray-600">
            <span className="flex items-center gap-1"><MapPin size={14} /> Kadıköy, İstanbul</span>
            <span className="flex items-center gap-1"><Globe size={14} /> www.guvenemlak.com</span>
        </div>
      </div>

      {/* Mağaza İlanları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sol: Mağaza İçi Arama / Filtre */}
        <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-4 border rounded-lg shadow-sm">
                <h3 className="font-bold text-[#3b5062] mb-3 border-b pb-2">Mağazada Ara</h3>
                <input type="text" placeholder="Kelime ile ara..." className="w-full border rounded px-3 py-2 text-sm mb-3" />
                <Button size="sm" className="w-full bg-[#3b5062]">Ara</Button>
            </div>
            
            <div className="bg-white p-4 border rounded-lg shadow-sm">
                <h3 className="font-bold text-[#3b5062] mb-2">Kategoriler</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                    <li className="font-semibold text-blue-600 cursor-pointer">Konut (30)</li>
                    <li className="hover:text-blue-600 cursor-pointer">İş Yeri (10)</li>
                    <li className="hover:text-blue-600 cursor-pointer">Arsa (2)</li>
                </ul>
            </div>
        </div>

        {/* Sağ: İlan Listesi */}
        <div className="md:col-span-3">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mağaza İlanları (42)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ListingCard 
                        key={i}
                        title={`Mağazadan Fırsat Daire ${i + 1}`} 
                        price={`${3 + i}.000.000 TL`} 
                        location="İstanbul / Kadıköy" 
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}