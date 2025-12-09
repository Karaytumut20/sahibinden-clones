import ListingGallery from "@/components/listing-detail/ListingGallery";
import ListingInfo from "@/components/listing-detail/ListingInfo";
import SellerSidebar from "@/components/listing-detail/SellerSidebar";
import { Badge } from "@/components/ui/badge";

export default function ListingDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6">
        <div>
            <h1 className="text-2xl font-bold text-[#3b5062]">Sahibinden Temiz Satılık Passat 2018</h1>
            <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Vasıta</Badge>
                <span className="text-sm text-gray-500">/ Otomobil / Volkswagen / Passat</span>
            </div>
        </div>
        <div className="mt-4 md:mt-0 text-right">
            <div className="text-2xl font-bold text-red-600">1.250.000 TL</div>
            <div className="text-xs text-gray-400">İstanbul / Kadıköy</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
            <ListingGallery />
            <div className="lg:hidden">
               <SellerSidebar />
            </div>
            <ListingInfo />
        </div>
        <div className="hidden lg:block lg:col-span-5">
            <SellerSidebar />
        </div>
      </div>
    </div>
  );
}