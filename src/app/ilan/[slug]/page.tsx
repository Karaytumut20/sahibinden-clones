import ListingGallery from "@/components/listing-detail/ListingGallery";
import ListingInfo from "@/components/listing-detail/ListingInfo";
import ListingFeatures from "@/components/listing-detail/ListingFeatures";
import SellerSidebar from "@/components/listing-detail/SellerSidebar";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Share2, Flag, MapPin } from "lucide-react";

export default function ListingDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="pb-10 container mx-auto px-4 py-6">
      {/* İlan Başlığı ve Navigasyon */}
      <div className="border-b pb-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-2xl font-bold text-[#3b5062] dark:text-white">Sahibinden Temiz Satılık Passat 2018 - Hatasız Boyasız</h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-slate-800 dark:text-blue-400">Vasıta</Badge>
                    <span className="text-sm text-gray-500">/ Otomobil / Volkswagen / Passat / 1.6 TDI / BlueMotion Comfortline</span>
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
                <div className="text-3xl font-bold text-red-600">1.250.000 TL</div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={14} /> İstanbul / Kadıköy / Göztepe Mah.
                </div>
            </div>
        </div>
        
        {/* Aksiyon Butonları */}
        <div className="flex justify-end gap-4 mt-4 text-xs text-gray-500">
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Heart size={14} /> Favorilere Ekle</button>
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Share2 size={14} /> Paylaş</button>
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Flag size={14} /> İlanı Bildir</button>
            <span className="flex items-center gap-1 text-gray-400 ml-2"><Eye size={14} /> 1.250 Görüntüleme</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sol Taraf: Galeri ve Özellikler */}
        <div className="lg:col-span-9 space-y-8">
            <ListingGallery />
            
            {/* Mobil için Satıcı Bilgisi */}
            <div className="lg:hidden">
               <SellerSidebar />
            </div>

            {/* İlan Açıklaması ve Özellikler */}
            <div className="space-y-8">
                <ListingInfo />      
                <ListingFeatures />
                
                {/* Açıklama Alanı */}
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                    <h3 className="font-bold text-lg text-[#3b5062] mb-4 border-b pb-2">Açıklama</h3>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        Aracım 2018 model olup trafiğe 2019 çıkışlıdır. 
                        İlk sahibinden, garaj arabasıdır. Sigara içilmemiştir.
                        Tüm bakımları yetkili serviste yapılmıştır.
                        
                        Ekstra olarak:
                        - Cam filmi
                        - Seramik kaplama
                        - Kışlık lastikleri yanında verilecektir.
                        
                        Alıcısına şimdiden hayırlı olsun. Cüzi miktarda pazarlık payı vardır.
                    </p>
                </div>
            </div>
        </div>

        {/* Sağ Taraf: Satıcı Bilgisi (Sticky) */}
        <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
                <SellerSidebar />
                
                {/* Güvenlik Uyarısı */}
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-xs text-yellow-800">
                    <strong>Güvenlik İpucu:</strong> Kapora veya benzeri bir ödeme yapmadan önce ürünü görmenizi öneririz.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}