'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Check, Car, Home, ChevronRight, DollarSign, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { createListing } from '@/actions/listingActions';
import ImageUpload from '@/components/common/ImageUpload';
import { useRouter } from 'next/navigation';

export default function NewListingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    price: '',
    currency: 'TL',
    description: '',
    images: [] as string[],
    city: 'İstanbul',
    district: 'Kadıköy'
  });

  const categories = [
    { id: 'vasita', name: 'Vasıta', icon: <Car size={24} /> },
    { id: 'emlak', name: 'Emlak', icon: <Home size={24} /> },
  ];

  const handleCategorySelect = (id: string) => {
    setFormData({ ...formData, category: id });
    setStep(2);
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.price || formData.images.length === 0) {
        alert('Lütfen başlık, fiyat girin ve en az bir fotoğraf yükleyin.');
        return;
    }

    setLoading(true);
    
    try {
        const result = await createListing(formData);
        
        if (result.success) {
          setStep(3);
        } else {
          alert('Hata: ' + result.message);
        }
    } catch (error) {
        console.error(error);
        alert('Bir hata oluştu.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* İlerleme Çubuğu */}
      <div className="flex items-center justify-between mb-8 px-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2 hidden md:block"></div> 
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center bg-gray-50 px-4 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s ? 'bg-[#3b5062] text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'}`}>
              {step > s ? <Check size={20} /> : s}
            </div>
            <span className={`text-xs mt-2 font-bold uppercase tracking-wide ${step >= s ? 'text-[#3b5062]' : 'text-gray-400'}`}>
              {s === 1 ? 'Kategori' : s === 2 ? 'Detaylar & Medya' : 'Sonuç'}
            </span>
          </div>
        ))}
      </div>

      <Card className="p-8 min-h-[500px] shadow-xl border-t-4 border-t-[#ffd008]">
        
        {step === 1 && (
          <div className="animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-[#3b5062] mb-8 text-center">İlan Kategorisini Seçin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="flex items-center justify-between p-8 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left bg-white shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-gray-50 rounded-full border shadow-sm group-hover:bg-white group-hover:text-blue-600 text-gray-500 transition-colors">
                      {cat.icon}
                    </div>
                    <span className="font-bold text-xl text-gray-700 group-hover:text-blue-700">{cat.name}</span>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-blue-500 w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#3b5062]">İlan Detayları</h2>
                    <p className="text-sm text-gray-500">Kategori: <span className="font-semibold text-blue-600 uppercase">{formData.category}</span></p>
                </div>
                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-blue-600 font-medium underline">Kategoriyi Değiştir</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">İlan Başlığı</label>
                        <Input 
                        placeholder="Örn: Sahibinden hatasız boyasız 2020 model..." 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="focus-visible:ring-[#3b5062] h-11"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Fiyat</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input 
                                    type="number" 
                                    placeholder="0" 
                                    className="pl-9 focus-visible:ring-[#3b5062] h-11 font-medium"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Para Birimi</label>
                            <select 
                                className="w-full h-11 px-3 border rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-[#3b5062]"
                                value={formData.currency}
                                onChange={(e) => setFormData({...formData, currency: e.target.value})}
                            >
                                <option value="TL">TL - Türk Lirası</option>
                                <option value="USD">USD - Amerikan Doları</option>
                                <option value="EUR">EUR - Euro</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Açıklama</label>
                        <textarea 
                            className="w-full min-h-[150px] p-3 border rounded-md text-sm outline-none focus:ring-2 focus:ring-[#3b5062] resize-none"
                            placeholder="İlanınızla ilgili tüm detayları buraya yazın."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                        <MapPin className="text-blue-600 mt-1" size={20} />
                        <div>
                            <h4 className="text-sm font-bold text-blue-800">Konum Bilgisi</h4>
                            <p className="text-xs text-blue-600">Şu an varsayılan olarak <strong>{formData.city} / {formData.district}</strong> seçili.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <label className="text-sm font-bold text-gray-700 block mb-2">Fotoğraflar</label>
                    <div className="bg-gray-50 p-4 rounded-xl border">
                        <ImageUpload 
                            value={formData.images}
                            onChange={(url) => setFormData((prev) => ({ ...prev, images: [...prev.images, url] }))}
                            onRemove={(url) => setFormData((prev) => ({ ...prev, images: prev.images.filter((current) => current !== url) }))}
                        />
                        <p className="text-xs text-gray-500 mt-3 text-center">
                            * İlk yüklediğiniz fotoğraf vitrin fotoğrafı olacaktır.<br/>
                            * En fazla 10 fotoğraf yükleyebilirsiniz.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t mt-8 gap-4">
                <Button variant="outline" onClick={() => setStep(1)} disabled={loading}>Geri Dön</Button>
                <Button 
                    onClick={handlePublish} 
                    className="bg-[#3b5062] hover:bg-[#2c3e4e] px-8 h-11 text-base shadow-lg"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" /> Yayınlanıyor...
                        </>
                    ) : (
                        'İlanı Onayla ve Yayınla'
                    )}
                </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-6 animate-in zoom-in duration-500">
            <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                <Check size={56} strokeWidth={4} />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">Tebrikler!</h2>
                <p className="text-gray-600 max-w-md mx-auto text-lg">
                  İlanınız başarıyla sistemlerimize kaydedildi ve yayına alındı.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
                <Button variant="outline" className="w-full sm:w-auto h-12 px-8" onClick={() => router.push('/')}>Ana Sayfaya Dön</Button>
                <Button className="w-full sm:w-auto bg-[#3b5062] hover:bg-[#2c3e4e] h-12 px-8" onClick={() => router.push('/profile/my-listings')}>İlanıma Git</Button>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
}