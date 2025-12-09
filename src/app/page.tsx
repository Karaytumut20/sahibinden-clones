import CategorySidebar from "@/components/home/CategorySidebar";
import VitrinSlider from "@/components/home/VitrinSlider";
import ListingCard from "@/components/listings/ListingCard";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* Sol Menü */}
      <CategorySidebar />

      {/* Sağ Taraf - İçerik */}
      <section className="flex-1 overflow-hidden">
        
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