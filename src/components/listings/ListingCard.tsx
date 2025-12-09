import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export default function ListingCard() {
  return (
    <Card className="group cursor-pointer overflow-hidden border transition-all hover:shadow-md hover:border-blue-400">
      {/* Resim Alanı */}
      <div className="relative h-40 w-full bg-gray-200">
        {/* Placeholder resim (Next.js Image kullanırken width/height zorunludur veya fill kullanılır) */}
        {/* Gerçek resim gelene kadar gri alan veya dummy resim */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Resim Yok
        </div>
        
        {/* Sahibinden tarzı "Vitrin" etiketi */}
        <Badge className="absolute left-2 top-2 bg-yellow-400 text-black hover:bg-yellow-500 text-[10px] px-1.5 py-0 border-none shadow-sm">
          Vitrin
        </Badge>
      </div>

      {/* İçerik */}
      <CardContent className="p-3 space-y-2">
        <h3 className="line-clamp-2 text-sm font-semibold text-blue-900 group-hover:underline min-h-[40px]">
          Sahibinden Satılık Temiz 2023 Model Araç Düşük KM
        </h3>
        
        <p className="text-lg font-bold text-red-600">
          1.250.000 TL
        </p>
      </CardContent>

      <CardFooter className="p-3 pt-0 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>İstanbul / Kadıköy</span>
        </div>
      </CardFooter>
    </Card>
  );
}