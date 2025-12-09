import CategorySidebar from "@/components/home/CategorySidebar";
import VitrinSlider from "@/components/home/VitrinSlider";
import ListingCard from "@/components/listings/ListingCard";
import { Car, Home, ShoppingBag, Briefcase, Wrench, MoreHorizontal, Monitor, Utensils } from "lucide-react";
import Link from "next/link";

// Fonksiyon adını 'Home' yerine 'HomePage' yaptık
export default function HomePage() {
  
  const categories = [
    { name: "Emlak", icon: Home, count: "1205" },
    { name: "Vasıta", icon: Car, count: "5420" },
    { name: "Yedek Parça", icon: Wrench, count: "850" },
    { name: "Alışveriş", icon: ShoppingBag, count: "12300" },
    { name: "İş Makineleri", icon: Briefcase, count: "420" },
    { name: "Elektronik", icon: Monitor, count: "3500" },
    { name: "Ev Eşyaları", icon: Utensils, count: "980" },
    { name: "Hizmetler", icon: MoreHorizontal, count: "150" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* Sol Menü (Masaüstü) */}
      <CategorySidebar />

      {/* Sağ Taraf - İçerik */}
      <section className="flex-1 overflow-hidden min-w-0">
        
        {/* MOBİL İÇİN YATAY KATEGORİLER */}
        <div className="md:hidden mb-6">
            <h2 className="text-sm font-bold text-gray-700 mb-3 px-1">Kategoriler</h2>
            <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide px-1">
                {categories.map((cat) => (
                    <Link href={`/category/${cat.name.toLowerCase()}`} key={cat.name} className="flex flex-col items-center gap-2 min-w-[80px]">
                        <div className="w-14 h-14 rounded-full bg-white border shadow-sm flex items-center justify-center text-blue-600">
                            <cat.icon size={24} />
                        </div>
                        <span className="text-xs text-center font-medium text-gray-700">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>

        {/* VİTRİN SLIDER ALANI */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded shadow-sm border border-l-4 border-l-[#ffd008]">
                <h1 className="text-sm font-bold text-gray-700">Ana Sayfa Vitrini</h1>
                <a href="#" className="text-xs text-blue-600 hover:underline">Tümünü Göster</a>
            </div>
            <VitrinSlider />
        </div>

        {/* Diğer İlanlar (Grid) */}
        <div>
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded shadow-sm border">
                <h2 className="text-sm font-bold text-gray-700">İlginizi Çekebilecek İlanlar</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ListingCard 
                    key={i}
                    title={`Fırsat İlanı ${i + 1}`} 
                    price={`${250 + i * 20}.000 TL`} 
                    location="İstanbul" 
                />
              ))}
            </div>
        </div>

      </section>
    </div>
  );
}