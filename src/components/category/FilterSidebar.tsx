"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Kategorilere göre özel filtre tanımları
const categoryFilters: any = {
  vasita: {
    title: "Vasıta",
    subCategories: ["Otomobil", "Arazi, SUV & Pickup", "Motosiklet", "Minivan & Panelvan"],
    fields: [
      { id: "yil", label: "Yıl", type: "range" },
      { id: "yakit", label: "Yakıt", type: "checkbox", options: ["Benzin", "Dizel", "LPG", "Elektrik"] },
      { id: "vites", label: "Vites", type: "checkbox", options: ["Manuel", "Otomatik", "Yarı Otomatik"] },
      { id: "km", label: "KM", type: "range" },
    ]
  },
  emlak: {
    title: "Emlak",
    subCategories: ["Konut", "İş Yeri", "Arsa", "Devremülk"],
    fields: [
      { id: "m2", label: "Metrekare (Brüt)", type: "range" },
      { id: "oda", label: "Oda Sayısı", type: "checkbox", options: ["1+0", "1+1", "2+1", "3+1", "4+1"] },
      { id: "isinma", label: "Isınma", type: "checkbox", options: ["Doğalgaz", "Merkezi", "Klima", "Soba"] },
      { id: "bina_yasi", label: "Bina Yaşı", type: "range" },
    ]
  },
  default: {
    title: "Kategori",
    subCategories: ["Alt Kategori 1", "Alt Kategori 2"],
    fields: []
  }
};

interface FilterSidebarProps {
  categorySlug: string;
}

export default function FilterSidebar({ categorySlug }: FilterSidebarProps) {
  // Gelen slug'a göre filtre setini seç (yoksa default)
  const currentFilters = categoryFilters[categorySlug] || categoryFilters.default;

  return (
    <aside className="w-full md:w-64 flex-shrink-0 hidden md:block space-y-4">
      
      {/* Kategori Ağacı */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-sm text-[#3b5062] mb-3">{currentFilters.title}</h3>
        <ul className="text-sm space-y-2 text-gray-600 ml-2 border-l-2 border-gray-200 pl-3">
          {currentFilters.subCategories.map((sub: string) => (
             <li key={sub} className="hover:text-blue-600 cursor-pointer">{sub}</li>
          ))}
        </ul>
      </div>

      {/* Dinamik Filtreler */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 p-3 border-b">
          <h2 className="font-bold text-gray-700 text-sm">Filtrele</h2>
        </div>
        
        <div className="p-4">
          <Accordion type="multiple" defaultValue={["fiyat", "adres"]} className="w-full">
            
            {/* Her kategoride olan Ortak Filtreler */}
            <AccordionItem value="adres">
              <AccordionTrigger className="text-sm font-semibold text-[#3b5062]">Adres</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <select className="w-full border rounded p-1 text-sm bg-white outline-none">
                    <option>İl Seçiniz</option>
                    <option>İstanbul</option>
                    <option>Ankara</option>
                    <option>İzmir</option>
                  </select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fiyat">
              <AccordionTrigger className="text-sm font-semibold text-[#3b5062]">Fiyat (TL)</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-2 pt-2">
                  <Input type="number" placeholder="Min" className="h-8 text-xs" />
                  <span className="text-gray-400">-</span>
                  <Input type="number" placeholder="Max" className="h-8 text-xs" />
                </div>
                <Button size="sm" className="w-full mt-2 h-7 text-xs bg-blue-600 hover:bg-blue-700">Ara</Button>
              </AccordionContent>
            </AccordionItem>

            {/* Kategoriye Özel Filtrelerin Render Edilmesi */}
            {currentFilters.fields.map((field: any) => (
              <AccordionItem key={field.id} value={field.id}>
                <AccordionTrigger className="text-sm font-semibold text-[#3b5062]">{field.label}</AccordionTrigger>
                <AccordionContent>
                  {field.type === "range" && (
                    <div className="flex items-center gap-2 pt-2">
                      <Input type="number" placeholder="Min" className="h-8 text-xs" />
                      <span className="text-gray-400">-</span>
                      <Input type="number" placeholder="Max" className="h-8 text-xs" />
                    </div>
                  )}
                  {field.type === "checkbox" && (
                    <div className="space-y-2 pt-2">
                      {field.options.map((opt: string) => (
                        <div key={opt} className="flex items-center space-x-2">
                          <Checkbox id={`${field.id}-${opt}`} />
                          <label htmlFor={`${field.id}-${opt}`} className="text-sm text-gray-600">
                            {opt}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}

          </Accordion>
        </div>
      </div>
    </aside>
  );
}