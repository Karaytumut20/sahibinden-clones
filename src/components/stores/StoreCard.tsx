import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StoreCardProps {
  id: string;
  name: string;
  logo: string;
  category: string;
  location: string;
  phone: string;
  listingCount: number;
}

export default function StoreCard({ id, name, logo, category, location, phone, listingCount }: StoreCardProps) {
  return (
    <Card className="flex flex-col md:flex-row p-4 gap-4 items-center md:items-start hover:shadow-md transition-shadow">
      {/* Mağaza Logosu */}
      <div className="w-32 h-24 relative border rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
        <Image src={logo} alt={name} fill className="object-contain p-2" />
      </div>

      {/* Mağaza Bilgileri */}
      <div className="flex-1 text-center md:text-left space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h3 className="font-bold text-lg text-[#3b5062]">{name}</h3>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">{category}</span>
        </div>
        
        <div className="text-sm text-gray-500 flex flex-col md:flex-row gap-2 md:gap-4 items-center md:items-start justify-center md:justify-start">
            <span className="flex items-center gap-1"><MapPin size={14} /> {location}</span>
            <span className="flex items-center gap-1"><Phone size={14} /> {phone}</span>
        </div>

        <div className="text-xs text-gray-400">
            Toplam <strong>{listingCount}</strong> ilan yayında
        </div>
      </div>

      {/* Aksiyon */}
      <div className="flex items-center">
        <Link href={`/magazalar/${id}`}>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Mağazayı Gör
            </Button>
        </Link>
      </div>
    </Card>
  );
}