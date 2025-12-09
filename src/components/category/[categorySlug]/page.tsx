import FilterSidebar from "@/components/category/FilterSidebar";
import ListingCard from "@/components/listings/ListingCard";
import Pagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { List, Grid, Map, SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Next.js 15+ async params
export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const title = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  return (
    <div className="flex flex-col md:flex-row gap-4 relative">
      
      {/* MASAÜSTÜ FİLTRE (MD ve Üstü Görünür) */}
      <FilterSidebar categorySlug={categorySlug} />

      {/* MOBİL FİLTRE DIALOG'U (Sadece Mobilde İşlevsel Olacak Buton) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-xl bg-[#3b5062] text-white px-6 h-12 flex items-center gap-2">
              <SlidersHorizontal size={18} />
              Sonuçları Filtrele
            </Button>
          </DialogTrigger>
          <DialogContent className="h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Filtrele: {title}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
               {/* FilterSidebar bileşeninin responsive olması lazım, 
                   burada içeriğini direkt render etmek yerine FilterSidebar'ı 
                   "mobile=true" prop'u ile çağırabiliriz ama şimdilik 
                   bileşeni direkt burada kullanıyoruz. CSS ile 'hidden' olduğu için 
                   FilterSidebar içinde küçük bir değişiklik yapacağız. */}
               <div className="block"> 
                  {/* Mobilde 'hidden' class'ını ezmek için wrapper div */}
                  <FilterSidebar categorySlug={categorySlug} isMobile={true} />
               </div>
            </div>
            <div className="p-4 border-t bg-white">
                <Button className="w-full bg-blue-600 h-12 text-lg">Sonuçları Göster (245)</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* SAĞ TARAF - LİSTE */}
      <section className="flex-1 min-w-0"> {/* min-w-0 flex taşmalarını önler */}
        <div className="bg-white p-3 border rounded-t-lg shadow-sm mb-4">
            {/* ... (Mevcut kodlar aynı kalacak) ... */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3 mb-3">
                <div>
                    <h1 className="text-lg font-bold text-[#3b5062]">{title} İlanları</h1>
                    <p className="text-xs text-gray-500 mt-1">Arama kriterlerinize uygun <span className="font-bold text-black">245</span> ilan bulundu.</p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="border rounded-sm text-sm py-1.5 px-2 bg-gray-50 focus:outline-none text-gray-700 w-full sm:w-auto">
                        <option>Fiyata Göre (Önce En Düşük)</option>
                        <option>Fiyata Göre (Önce En Yüksek)</option>
                        <option>Tarihe Göre (Önce En Yeni)</option>
                    </select>
                </div>
            </div>
            
            {/* Görünüm Modları */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="truncate">Tüm Türkiye / Otomobil / {title}</span>
                <div className="flex border rounded-md overflow-hidden flex-shrink-0">
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
                 <ListingRow 
                    image={`https://placehold.co/200x150/png?text=Araba+${i+1}`}
                    title={title + " Kategorisinde Temiz Aile Aracı 2018 Model Hatasız Boyasız"}
                    price={(900 + i * 50) + ".000 TL"}
                    location="İstanbul / Kadıköy"
                    date="09 Ara"
                 />
            </div>
          ))}
          
          {/* Mobil Grid */}
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

        <Pagination currentPage={1} totalPages={12} />

      </section>
    </div>
  );
}

// ListingRow bileşeni aynı kalabilir...
function ListingRow({ image, title, price, location, date }: any) {
    return (
        <div className="flex bg-white border rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer group h-[120px] overflow-hidden">
            <div className="relative w-[160px] h-full flex-shrink-0">
                <img src={image} alt={title} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <h3 className="font-semibold text-[#3b5062] text-sm group-hover:underline line-clamp-1">{title}</h3>
                <div className="flex justify-between items-end">
                    <div className="text-lg font-bold text-red-600">{price}</div>
                    <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-xs font-bold text-gray-700 block">{date}</div>
                        <div className="text-xs text-gray-500">{location}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}