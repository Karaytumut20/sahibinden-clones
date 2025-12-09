import { Check } from "lucide-react";

// Örnek Donanım Verisi (Normalde veritabanından gelir)
const featuresData = {
  "Güvenlik": ["ABS", "ASR", "ESP", "Yokuş Kalkış Desteği", "Hava Yastığı (Sürücü)", "Hava Yastığı (Yolcu)", "Lastik Arıza Göstergesi"],
  "İç Donanım": ["Deri Koltuk", "Elektrikli Camlar", "Klima (Dijital)", "Otomatik Kararan Dikiz Aynası", "Ön Kol Dayama", "Hız Sabitleyici"],
  "Dış Donanım": ["Alaşımlı Jant", "Sis Farı", "Sunroof", "Park Sensörü (Arka)", "Yağmur Sensörü"],
  "Multimedya": ["Bluetooth", "USB / AUX", "Navigasyon", "Apple CarPlay"]
};

export default function ListingFeatures() {
  return (
    <div className="bg-white border rounded-lg shadow-sm mt-6 p-5">
      <h3 className="font-bold text-lg text-[#3b5062] mb-4 border-b pb-2">Donanım & Özellikler</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        {Object.entries(featuresData).map(([category, items]) => (
          <div key={category}>
            <h4 className="font-semibold text-sm text-blue-600 mb-3 uppercase tracking-wide">{category}</h4>
            <ul className="grid grid-cols-2 gap-2">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Check size={10} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}