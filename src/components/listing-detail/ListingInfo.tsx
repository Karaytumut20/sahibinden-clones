import { Separator } from "@/components/ui/separator";

export default function ListingInfo() {
  const details = [
    { label: "İlan No", value: "105423123" },
    { label: "İlan Tarihi", value: "09 Aralık 2025" },
    { label: "Marka", value: "Volkswagen" },
    { label: "Seri", value: "Passat" },
    { label: "Model", value: "1.6 TDI BlueMotion" },
    { label: "Yıl", value: "2018" },
    { label: "Yakıt", value: "Dizel" },
    { label: "Vites", value: "Otomatik" },
    { label: "KM", value: "120.000" },
    { label: "Renk", value: "Beyaz" },
  ];

  return (
    <div className="bg-white">
      <h3 className="font-bold text-lg mb-4 text-[#3b5062]">İlan Bilgileri</h3>
      <ul className="space-y-0 text-sm">
        {details.map((item, index) => (
          <li key={index} className="flex justify-between py-2 border-b border-gray-100 hover:bg-gray-50 px-2">
            <span className="font-semibold text-gray-700">{item.label}</span>
            <span className="text-red-600 font-medium">{item.value}</span>
          </li>
        ))}
      </ul>
      <Separator className="my-4" />
      <div className="text-sm text-gray-600 leading-relaxed">
        <h4 className="font-bold mb-2 text-[#3b5062]">Açıklama</h4>
        <p>Aracım temizdir, sahibinden satılıktır. Tüm bakımları yetkili serviste yapılmıştır. Alıcısına hayırlı olsun.</p>
      </div>
    </div>
  );
}