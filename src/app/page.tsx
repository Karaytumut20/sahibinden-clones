import CategorySidebar from "@/components/home/CategorySidebar";
import VitrinSlider from "@/components/home/VitrinSlider";
import ListingCard from "@/components/listings/ListingCard";
import { Car, Home, ShoppingBag, Briefcase, Wrench, MoreHorizontal, Monitor, Utensils } from "lucide-react";
import Link from "next/link";
import connectToDB from "@/lib/db";
import Listing from "@/models/Listing";

// Bu sayfa artık bir Server Component ve asenkron veri çekiyor
export default async function HomePage() {
  
  // MongoDB'den Verileri Çek
  await connectToDB();
  // .lean() performansı artırır, sadece veri döner, mongoose objesi dönmez
  const latestListings = await Listing.find({ status: 'active' }).sort({ createdAt: -1 }).limit(8).lean();

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

        {/* Diğer İlanlar (Grid) - Gerçek Veriler */}
        <div>
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded shadow-sm border">
                <h2 className="text-sm font-bold text-gray-700">Son Eklenen İlanlar</h2>
            </div>
            
            {latestListings.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {latestListings.map((item: any) => (
                  <ListingCard 
                      key={item._id.toString()}
                      title={item.title} 
                      price={`${item.price} TL`} 
                      location="İstanbul" // Lokasyon şimdilik sabit, ileride dinamik yapılacak
                      // Resim yoksa placeholder göster
                      image={item.images && item.images.length > 0 ? item.images[0] : "https://placehold.co/300x200?text=Resim+Yok"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white border rounded text-gray-500">
                Henüz hiç ilan eklenmemiş. İlk ilanı sen ekle!
              </div>
            )}
        </div>

      </section>
    </div>
  );
}
