import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10 py-8 text-sm text-gray-500">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-gray-700 mb-3">Kurumsal</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:underline">Hakkımızda</Link></li>
            <li><Link href="#" className="hover:underline">İnsan Kaynakları</Link></li>
            <li><Link href="#" className="hover:underline">Haberler</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-700 mb-3">Hizmetlerimiz</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:underline">Doping</Link></li>
            <li><Link href="#" className="hover:underline">Güvenli e-Ticaret</Link></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-2 text-center md:text-right">
          <p className="mb-2">Bizi Takip Edin</p>
          <p>© 2025 Sahibinden Clone - Tüm Hakları Saklıdır</p>
        </div>
      </div>
    </footer>
  );
}