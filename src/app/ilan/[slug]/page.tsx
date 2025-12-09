import ListingGallery from "@/components/listing-detail/ListingGallery";
import ListingInfo from "@/components/listing-detail/ListingInfo";
import ListingFeatures from "@/components/listing-detail/ListingFeatures";
import SellerSidebar from "@/components/listing-detail/SellerSidebar";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Share2, Flag } from "lucide-react";

export default function ListingDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="pb-10">
      {/* İlan Başlığı ve Navigasyon */}
      <div className="border-b pb-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-2xl font-bold text-[#3b5062]">Sahibinden Temiz Satılık Passat 2018 - Hatasız Boyasız</h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Vasıta</Badge>
                    <span className="text-sm text-gray-500">/ Otomobil / Volkswagen / Passat / 1.6 TDI / BlueMotion Comfortline</span>
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
                <div className="text-3xl font-bold text-red-600">1.250.000 TL</div>
                <div className="text-sm text-gray-500">İstanbul / Kadıköy / Göztepe Mah.</div>
            </div>
        </div>
        
        {/* Aksiyon Butonları (Favori, Paylaş vb.) */}
        <div className="flex justify-end gap-4 mt-4 text-xs text-gray-500">
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Heart size={14} /> Favorilere Ekle</button>
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Share2 size={14} /> Paylaş</button>
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Flag size={14} /> İlanı Bildir</button>
            <span className="flex items-center gap-1 text-gray-400 ml-2"><Eye size={14} /> 1.250 Görüntüleme</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sol Taraf: Galeri ve Özellikler */}
        <div className="lg:col-span-7 space-y-8">
            <ListingGallery />
            
            {/* Mobil için Satıcı Bilgisi (Masaüstünde gizli) */}
            <div className="lg:hidden">
               <SellerSidebar />
            </div>

            {/* İlan Açıklaması ve Özellikler */}
            <div className="space-y-6">
                <ListingInfo />      {/* Mevcut Açıklama ve Temel Bilgiler */}
                <ListingFeatures />  {/* Yeni Eklediğimiz Özellikler Tablosu */}
            </div>
        </div>

        {/* Sağ Taraf: Satıcı Bilgisi ve Özet Tablo (Sticky) */}
        <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-24 space-y-6">
                <SellerSidebar />
                
                {/* Güvenlik Uyarısı Kutusu */}
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-xs text-yellow-800">
                    <strong>Güvenlik İpucu:</strong> Kapora veya benzeri bir ödeme yapmadan önce ürünü görmenizi öneririz.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}