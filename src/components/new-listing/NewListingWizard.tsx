"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Check, Car, Home, ChevronRight, Upload, DollarSign, Loader2 } from "lucide-react";
import Link from "next/link";
import { createListing } from "@/actions/listingActions"; // Backend action importu

export default function NewListingWizard() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false); // Yükleniyor durumu
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
  });

  const categories = [
    { id: "vasita", name: "Vasıta", icon: <Car size={24} /> },
    { id: "emlak", name: "Emlak", icon: <Home size={24} /> },
  ];

  const handleCategorySelect = (id: string) => {
    setCategory(id);
    setStep(2);
  };

  const handlePublish = async () => {
    setLoading(true);
    
    // Server Action'ı çağırıyoruz
    const result = await createListing({
      ...formData,
      category: category
    });

    setLoading(false);

    if (result.success) {
      setStep(3);
    } else {
      alert("Hata: " + result.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* İlerleme Çubuğu (Stepper) */}
      <div className="flex items-center justify-between mb-8 px-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2 hidden md:block"></div> 
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center bg-gray-50 px-2 z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              {step > s ? <Check size={16} /> : s}
            </div>
            <span className={`text-xs mt-1 font-medium ${step >= s ? "text-blue-600" : "text-gray-400"}`}>
              {s === 1 ? "Kategori" : s === 2 ? "Bilgiler" : "Sonuç"}
            </span>
          </div>
        ))}
      </div>

      <Card className="p-6 min-h-[400px] shadow-md">
        
        {/* ADIM 1: KATEGORİ SEÇİMİ */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-[#3b5062] mb-6 text-center">İlan Kategorisini Seç</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="flex items-center justify-between p-6 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group text-left bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-full border shadow-sm group-hover:bg-white group-hover:text-blue-600 text-gray-500">
                      {cat.icon}
                    </div>
                    <span className="font-semibold text-lg text-gray-700 group-hover:text-blue-700">{cat.name}</span>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ADIM 2: İLAN DETAYLARI */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b pb-4 mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#3b5062]">İlan Bilgilerini Gir</h2>
                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:underline">Kategoriyi Değiştir</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">İlan Başlığı</label>
                <Input 
                  placeholder="Örn: Sahibinden temiz 2018 model Passat" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="focus-visible:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Fiyat (TL)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                            type="number" 
                            placeholder="0" 
                            className="pl-9 focus-visible:ring-blue-600"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Para Birimi</label>
                    <select className="w-full h-9 px-3 py-1 border rounded-md bg-white text-sm outline-none focus:ring-1 focus:ring-blue-600">
                        <option>TL - Türk Lirası</option>
                        <option>USD - Amerikan Doları</option>
                        <option>EUR - Euro</option>
                    </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Açıklama</label>
                <textarea 
                    className="w-full min-h-[120px] p-3 border rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-600"
                    placeholder="İlanınızla ilgili detaylı bilgileri buraya yazın..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="p-3 bg-gray-100 rounded-full mb-2 group-hover:bg-white group-hover:shadow-sm">
                    <Upload size={24} className="text-gray-400 group-hover:text-blue-600" />
                </div>
                <span className="text-sm font-medium">Fotoğrafları sürükleyip bırakın</span>
                <span className="text-xs text-gray-400 mt-1">veya seçmek için tıklayın</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t mt-6">
                <Button 
                    onClick={handlePublish} 
                    className="bg-blue-600 hover:bg-blue-700 px-8"
                    disabled={!formData.title || !formData.price || loading}
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                    {loading ? "Kaydediliyor..." : "İlanı Yayınla"}
                </Button>
            </div>
          </div>
        )}

        {/* ADIM 3: SONUÇ / TEBRİKLER */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-in zoom-in duration-300">
                <Check size={48} strokeWidth={4} />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">Tebrikler!</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  İlanınız başarıyla oluşturuldu ve sistemlerimize kaydedildi.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                <Link href="/">
                    <Button variant="outline" className="w-full sm:w-auto">Ana Sayfaya Dön</Button>
                </Link>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
}
