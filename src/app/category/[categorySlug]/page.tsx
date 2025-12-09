import FilterSidebar from "@/components/category/FilterSidebar";
import ListingCard from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { List, Grid, Map } from "lucide-react";

export default function CategoryPage({ params }: { params: { categorySlug: string } }) {
  const title = params.categorySlug.charAt(0).toUpperCase() + params.categorySlug.slice(1);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Sol Filtre Menüsü - Slug bilgisi gönderiliyor */}
      <FilterSidebar categorySlug={params.categorySlug} />

      {/* Sağ Taraf - Liste */}
      <section className="flex-1">
        {/* Üst Bar: Başlık, Sonuç Sayısı ve Sıralama */}
        <div className="bg-white p-3 border rounded-t-lg shadow-sm mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3 mb-3">
                <div>
                    <h1 className="text-lg font-bold text-[#3b5062]">{title} İlanları</h1>
                    <p className="text-xs text-gray-500 mt-1">Arama kriterlerinize uygun <span className="font-bold text-black">245</span> ilan bulundu.</p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="border rounded-sm text-sm py-1.5 px-2 bg-gray-50 focus:outline-none text-gray-700">
                        <option>Fiyata Göre (Önce En Düşük)</option>
                        <option>Fiyata Göre (Önce En Yüksek)</option>
                        <option>Tarihe Göre (Önce En Yeni)</option>
                    </select>
                </div>
            </div>
            
            {/* Görünüm Modları */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Tüm Türkiye / Otomobil / {title}</span>
                <div className="flex border rounded-md overflow-hidden">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none bg-blue-50 text-blue-600"><List size={16}/></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none"><Grid size={16}/></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none"><Map size={16}/></Button>
                </div>
            </div>
        </div>

        {/* İlan Listesi */}
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="hidden md:block">
                 {/* Masaüstü için Yatay Liste Görünümü (Classic View) */}
                 <ListingRow 
                    image={"https://placehold.co/200x150/png?text=Araba+" + (i+1)}
                    title={title + " Kategorisinde Temiz Aile Aracı 2018 Model Hatasız Boyasız"}
                    price={(900 + i * 50) + ".000 TL"}
                    location="İstanbul / Kadıköy"
                    date="09 Ara"
                 />
            </div>
          ))}
          
          {/* Mobil için Grid Görünüm */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
             {Array.from({ length: 4 }).map((_, i) => (
                <ListingCard 
                  key={i}
                  title={title + " Fırsat Aracı"}
                  price={(900 + i * 50) + ".000 TL"}
                  location="İstanbul"
                />
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Sadece bu sayfa için basit bir Yatay Liste Bileşeni (Sahibinden Klasik Görünüm)
function ListingRow({ image, title, price, location, date }: any) {
    return (
        <div className="flex bg-white border rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer group h-[120px] overflow-hidden">
            <div className="relative w-[160px] h-full flex-shrink-0">
                <img src={image} alt={title} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
                <h3 className="font-semibold text-[#3b5062] text-sm group-hover:underline line-clamp-1">{title}</h3>
                <div className="flex justify-between items-end">
                    <div className="text-lg font-bold text-red-600">{price}</div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-gray-700 block">{date}</div>
                        <div className="text-xs text-gray-500">{location}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}