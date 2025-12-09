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
          <ListingCard title="Sahibinden Temiz Passat" price="1.450.000 TL" location="İstanbul / Kadıköy" isVitrin={true} />
          <ListingCard title="iPhone 15 Pro Max TR Cihazı" price="85.000 TL" location="Ankara / Çankaya" />
          <ListingCard title="Denize Sıfır Yazlık" price="12.500.000 TL" location="Muğla / Bodrum" isVitrin={true} />
          <ListingCard title="PlayStation 5 Çift Kol" price="22.000 TL" location="İzmir / Karşıyaka" />
          <ListingCard title="2020 Model Motosiklet" price="180.000 TL" location="Antalya / Merkez" />
          <ListingCard title="Oyuncu Bilgisayarı RTX 4090" price="110.000 TL" location="İstanbul / Beşiktaş" />
          <ListingCard title="Kiralık 3+1 Daire" price="25.000 TL" location="Bursa / Nilüfer" />
          <ListingCard title="Antika Saat Koleksiyonluk" price="15.000 TL" location="İstanbul / Fatih" />
        </div>

      </section>
    </div>
  );
}