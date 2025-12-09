import Link from "next/link";
import { Search, User, PlusCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-[#445c6e] text-white py-3 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* Sol Taraf: Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tighter text-[#ffd008]">
          sahibinden<span className="text-white text-xs opacity-80 font-normal ml-1">clone</span>
        </Link>

        {/* Orta Taraf: Arama Çubuğu (Mobilde gizli) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Kelime, ilan no veya mağaza adı ile ara" 
            className="w-full py-2.5 px-4 text-gray-800 rounded-sm focus:outline-none placeholder:text-sm"
          />
          <button className="absolute right-0 top-0 h-full px-5 bg-blue-600 hover:bg-blue-700 rounded-r-sm transition-colors">
            <Search size={18} />
          </button>
        </div>

        {/* Sağ Taraf: Linkler */}
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="hidden md:flex items-center gap-1 hover:text-[#ffd008] transition-colors">
            <User size={18} />
            <span>Giriş Yap</span>
          </Link>
          
          <span className="hidden md:block text-gray-400">|</span>

          <Link href="/register" className="hidden md:block hover:text-[#ffd008] transition-colors">
            Üye Ol
          </Link>

          <Link 
            href="/new-listing" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm flex items-center gap-2 shadow-sm transition-all hover:shadow-md ml-2"
          >
            <PlusCircle size={18} />
            <span className="font-semibold">Ücretsiz İlan Ver</span>
          </Link>
        </div>
      </div>
    </header>
  );
}