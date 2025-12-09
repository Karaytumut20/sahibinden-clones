import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import Link from "next/link";

interface ListingCardProps {
  title?: string;
  price?: string;
  location?: string;
  image?: string;
  isVitrin?: boolean;
}

export default function ListingCard({ 
  title = "Sahibinden Satılık Temiz 2023 Model Araç", 
  price = "1.250.000 TL", 
  location = "İstanbul / Kadıköy",
  image,
  isVitrin = false
}: ListingCardProps) {
  return (
    <Link href="/ilan/ornek-ilan-slug">
      <Card className="group cursor-pointer overflow-hidden border transition-all hover:shadow-md hover:border-blue-400 h-full flex flex-col">
        <div className="relative h-40 w-full bg-gray-200">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 select-none">
             {image ? (
               <Image src={image} alt={title} fill className="object-cover" />
             ) : "Resim Yok"}
          </div>
          
          {isVitrin && (
            <Badge className="absolute left-2 top-2 bg-yellow-400 text-black hover:bg-yellow-500 text-[10px] px-1.5 py-0 border-none shadow-sm">
              Vitrin
            </Badge>
          )}
        </div>

        <CardContent className="p-3 space-y-2 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-blue-900 group-hover:underline min-h-[40px]">
            {title}
          </h3>
          <p className="text-lg font-bold text-red-600">
            {price}
          </p>
        </CardContent>

        <CardFooter className="p-3 pt-0 text-xs text-gray-500 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span className="truncate max-w-[150px]">{location}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}