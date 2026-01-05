import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10 text-sm text-gray-600">
      {/* Üst Linkler */}
      <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div>
          <h4 className="font-bold text-[#3b5062] mb-4">Kurumsal</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-blue-600">Hakkımızda</Link></li>
            <li><Link href="#" className="hover:text-blue-600">İnsan Kaynakları</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Haberler</Link></li>
            <li><Link href="#" className="hover:text-blue-600">İletişim</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#3b5062] mb-4">Hizmetlerimiz</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-blue-600">Doping</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Güvenli e-Ticaret</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Reklam Verin</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Mobil Uygulamalar</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#3b5062] mb-4">Gizlilik</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-blue-600">Kullanım Koşulları</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Üyelik Sözleşmesi</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Gizlilik Politikası</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Çerez Yönetimi</Link></li>
          </ul>
        </div>
        <div className="col-span-2 lg:col-span-2">
          <h4 className="font-bold text-[#3b5062] mb-4">Bizi Takip Edin</h4>
          <div className="flex gap-4 mb-6">
            <a href="#" className="p-2 bg-white border rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors"><Facebook size={18} /></a>
            <a href="#" className="p-2 bg-white border rounded-full hover:border-pink-600 hover:text-pink-600 transition-colors"><Instagram size={18} /></a>
            <a href="#" className="p-2 bg-white border rounded-full hover:border-sky-500 hover:text-sky-500 transition-colors"><Twitter size={18} /></a>
            <a href="#" className="p-2 bg-white border rounded-full hover:border-blue-700 hover:text-blue-700 transition-colors"><Linkedin size={18} /></a>
          </div>
          <div className="bg-white p-4 border rounded-lg shadow-sm inline-block">
             <div className="flex items-center gap-3">
                <Phone size={24} className="text-blue-600" />
                <div>
                    <div className="text-xs text-gray-500">7/24 Destek Hattı</div>
                    <div className="font-bold text-lg text-[#3b5062]">0850 222 44 44</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Alt Telif */}
      <div className="bg-[#3b5062] text-white/80 py-4 text-xs">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <p>© 2025 Sahibinden Clone. Tüm hakları saklıdır.</p>
            
            {/* Gizli Admin Linki */}
            
        </div>
      </div>
    </footer>
  );
}