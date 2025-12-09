import ListingCard from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

// Mock Veri: Arama sonuçlarını simüle etmek için
const mockResults = Array.from({ length: 5 }).map((_, i) => ({
  id: i,
  title: `Sahibinden Satılık Temiz Araç ${i + 1}`,
  price: `${850 + i * 25}.000 TL`,
  location: "İstanbul / Kadıköy",
  image: `https://placehold.co/300x200/png?text=Sonuc+${i + 1}`
}));

// DİKKAT: searchParams artık bir Promise, bu yüzden fonksiyonu 'async' yaptık
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Önce parametreleri bekliyoruz (await)
  const params = await searchParams;
  const query = params.q || "";

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Arama Başlığı ve Filtre Butonu */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#3b5062]">
            Arama Sonuçları
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            "{query}" araması için <span className="font-bold text-black">{mockResults.length}</span> sonuç bulundu.
          </p>
        </div>
        
        <Button variant="outline" className="gap-2 border-gray-300 text-gray-700">
          <SlidersHorizontal size={16} />
          Filtrele
        </Button>
      </div>

      {/* Sonuç Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockResults.map((item: any) => (
          <ListingCard
            key={item.id}
            title={item.title}
            price={item.price}
            location={item.location}
            image={item.image}
          />
        ))}
      </div>

      {/* Sonuç Yoksa Gösterilecek Alan */}
      {mockResults.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
          <h3 className="text-lg font-semibold text-gray-600">Sonuç Bulunamadı</h3>
          <p className="text-gray-400">Lütfen farklı anahtar kelimelerle tekrar deneyin.</p>
        </div>
      )}
    </div>
  );
}