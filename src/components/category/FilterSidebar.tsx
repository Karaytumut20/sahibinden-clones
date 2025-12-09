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
import { Separator } from "@/components/ui/separator";

export default function FilterSidebar() {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 hidden md:block space-y-4">
      
      {/* Kategori Ağacı Simülasyonu */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-sm text-[#3b5062] mb-3">Vasıta</h3>
        <ul className="text-sm space-y-2 text-gray-600 ml-2 border-l-2 border-gray-200 pl-3">
          <li className="font-semibold text-blue-600 cursor-pointer">Otomobil</li>
          <li className="hover:text-blue-600 cursor-pointer">Arazi, SUV & Pickup</li>
          <li className="hover:text-blue-600 cursor-pointer">Motosiklet</li>
          <li className="hover:text-blue-600 cursor-pointer">Minivan & Panelvan</li>
        </ul>
      </div>

      {/* Detaylı Filtreler */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 p-3 border-b">
          <h2 className="font-bold text-gray-700 text-sm">Filtrele</h2>
        </div>
        
        <div className="p-4">
          <Accordion type="multiple" defaultValue={["fiyat", "adres", "yil"]} className="w-full">
            
            {/* Adres Filtresi */}
            <AccordionItem value="adres">
              <AccordionTrigger className="text-sm font-semibold text-[#3b5062]">Adres</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <select className="w-full border rounded p-1 text-sm bg-white">
                    <option>İl Seçiniz</option>
                    <option>İstanbul</option>
                    <option>Ankara</option>
                    <option>İzmir</option>
                  </select>
                  <select className="w-full border rounded p-1 text-sm bg-white" disabled>
                    <option>İlçe Seçiniz</option>
                  </select>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Fiyat Filtresi */}
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

            {/* Yıl Filtresi */}
            <AccordionItem value="yil">
              <AccordionTrigger className="text-sm font-semibold text-[#3b5062]">Yıl</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-2 pt-2">
                  <Input type="number" placeholder="Min" className="h-8 text-xs" />
                  <span className="text-gray-400">-</span>
                  <Input type="number" placeholder="Max" className="h-8 text-xs" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Yakıt Tipi (Checkbox Örneği) */}
            <AccordionItem value="yakit">
              <AccordionTrigger className="text-sm font-semibold text-[#3b5062]">Yakıt</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {["Benzin", "Dizel", "LPG", "Elektrik"].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={item} />
                      <label htmlFor={item} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

             {/* Vites (Checkbox Örneği) */}
             <AccordionItem value="vites">
              <AccordionTrigger className="text-sm font-semibold text-[#3b5062]">Vites</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {["Manuel", "Otomatik", "Yarı Otomatik"].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={item} />
                      <label htmlFor={item} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </div>
    </aside>
  );
}