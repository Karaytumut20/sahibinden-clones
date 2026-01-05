"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import qs from "query-string";

// Kategorilere göre özel filtre tanımları (İleride DB'den gelebilir)
const categoryFilters: any = {
  vasita: {
    title: "Vasıta",
    subCategories: [
      { name: "Otomobil", slug: "otomobil" }, 
      { name: "Motosiklet", slug: "motosiklet" }
    ],
    fields: [
      { id: "yil", label: "Yıl", type: "range" },
      { id: "yakit", label: "Yakıt", type: "checkbox", options: ["Benzin", "Dizel", "LPG", "Elektrik"] },
    ]
  },
  emlak: {
    title: "Emlak",
    subCategories: [
      { name: "Konut", slug: "konut" },
      { name: "İş Yeri", slug: "is-yeri" }
    ],
    fields: [
      { id: "m2", label: "Metrekare", type: "range" },
      { id: "oda", label: "Oda Sayısı", type: "checkbox", options: ["1+1", "2+1", "3+1"] },
    ]
  },
  default: {
    title: "Kategori",
    subCategories: [],
    fields: []
  }
};

interface FilterSidebarProps {
  categorySlug: string;
  isMobile?: boolean;
}

export default function FilterSidebar({ categorySlug, isMobile = false }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL'deki mevcut değerleri state olarak tut
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
  
  const currentFilters = categoryFilters[categorySlug] || categoryFilters.default;

  // Filtreleme İşlemi
  const handleFilter = () => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      min: minPrice || null,
      max: maxPrice || null,
    };

    const url = qs.stringifyUrl({
      url: window.location.pathname,
      query: query,
    }, { skipNull: true, skipEmptyString: true });

    router.push(url);
  };
  
  // Kategori Değiştirme
  const handleCategoryChange = (slug: string) => {
     // Mevcut queryleri koruyarak kategori değiştirilebilir veya sıfırlanabilir.
     // Burada basitçe o kategoriye yönlendiriyoruz.
     router.push(`/search?category=${slug}`);
  };

  return (
    <aside className={`w-full md:w-64 flex-shrink-0 ${isMobile ? 'block' : 'hidden md:block'} space-y-4`}>
      
      {/* Kategori Ağacı */}
      {currentFilters.subCategories.length > 0 && (
        <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-bold text-sm text-[#3b5062] mb-3">{currentFilters.title}</h3>
            <ul className="text-sm space-y-2 text-gray-600 ml-2 border-l-2 border-gray-200 pl-3">
            {currentFilters.subCategories.map((sub: any) => (
                <li 
                    key={sub.slug} 
                    className="hover:text-blue-600 cursor-pointer"
                    onClick={() => handleCategoryChange(sub.slug)}
                >
                    {sub.name}
                </li>
            ))}
            </ul>
        </div>
      )}

      {/* Dinamik Filtreler */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 p-3 border-b">
          <h2 className="font-bold text-gray-700 text-sm">Filtrele</h2>
        </div>
        
        <div className="p-4">
          <Accordion type="multiple" defaultValue={["fiyat"]} className="w-full">
            
            <AccordionItem value="fiyat">
              <AccordionTrigger className="text-sm font-semibold text-[#3b5062]">Fiyat (TL)</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-2 pt-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    className="h-8 text-xs"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="text-gray-400">-</span>
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    className="h-8 text-xs"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <Button size="sm" onClick={handleFilter} className="w-full mt-2 h-7 text-xs bg-blue-600 hover:bg-blue-700">Ara</Button>
              </AccordionContent>
            </AccordionItem>

            {/* Diğer dinamik alanlar buraya eklenebilir (Yıl, KM vb.) - Mantığı Fiyat ile aynı */}

          </Accordion>
        </div>
      </div>
    </aside>
  );
}
