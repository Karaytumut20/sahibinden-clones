import CategorySidebar from "@/src/components/home/CategorySidebar";
import ListingCard from "@/src/components/listings/ListingCard";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* Sol Menü */}
      <CategorySidebar />

      {/* Sağ Taraf - Vitrin */}
      <section className="flex-1">
        
        {/* Vitrin Başlığı */}
        <div className="flex items-center justify-between mb-4 bg-white p-3 rounded shadow-sm border">
            <h1 className="text-sm font-bold text-gray-700">Ana Sayfa Vitrini</h1>
            <a href="#" className="text-xs text-blue-600 hover:underline">Tümünü Göster</a>
        </div>

        {/* İlan Grid Yapısı */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* 12 adet örnek kart basalım */}
          {Array.from({ length: 12 }).map((_, i) => (
            <ListingCard key={i} />
          ))}
        </div>

      </section>
    </div>
  );
}