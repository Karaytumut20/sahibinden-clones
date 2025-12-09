import CategorySidebar from "@/components/home/CategorySidebar";
import ListingCard from "@/components/listings/ListingCard";

export default function CategoryPage({ params }: { params: { categorySlug: string } }) {
  // Slug'ı başlık formatına çevir (örn: emlak -> Emlak)
  const title = params.categorySlug.charAt(0).toUpperCase() + params.categorySlug.slice(1);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sol Menü */}
      <CategorySidebar />

      {/* Sağ Taraf - Liste */}
      <section className="flex-1">
        <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h1 className="text-xl font-bold text-[#3b5062]">{title} İlanları</h1>
            <span className="text-sm text-gray-500">245 sonuç bulundu</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListingCard 
              key={i} 
              title={title + " Kategorisinde Fırsat İlan " + (i+1)}
              price={(1000 + i * 150) + ".000 TL"}
              location="İstanbul / Merkez"
            />
          ))}
        </div>
      </section>
    </div>
  );
}