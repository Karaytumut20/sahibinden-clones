"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, PlusCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Arama sayfasına yönlendir (Henüz sayfa yoksa bile URL değişir)
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="bg-[#3b5062] text-white py-3 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          
          {/* LOGO */}
          <Link href="/" className="text-2xl font-bold tracking-tighter text-[#ffd008] flex-shrink-0 mr-6">
            sahibinden<span className="text-white text-xs opacity-80 font-normal ml-1">clone</span>
          </Link>

          {/* ARAMA ÇUBUĞU (Masaüstü) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative mr-6">
            <input 
              type="text" 
              placeholder="Kelime, ilan no veya mağaza adı ile ara" 
              className="w-full h-10 pl-4 pr-12 text-gray-800 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#ffd008] transition-all placeholder:text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-r-sm transition-colors">
              <Search size={18} />
            </button>
          </form>

          {/* SAĞ MENÜ (Masaüstü) */}
          <div className="hidden md:flex items-center gap-3 text-sm font-medium">
            <Link href="/login" className="flex items-center gap-1 hover:text-[#ffd008] transition-colors">
              <User size={18} />
              <span>Giriş Yap</span>
            </Link>
            
            <span className="text-gray-500">|</span>

            <Link href="/register" className="hover:text-[#ffd008] transition-colors">
              Üye Ol
            </Link>

            <Link href="/new-listing">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm h-9 px-4 ml-2 gap-2 shadow-sm border border-blue-500">
                <PlusCircle size={16} />
                <span>Ücretsiz İlan Ver</span>
              </Button>
            </Link>
          </div>

          {/* MOBİL MENÜ BUTONU */}
          <button 
            className="md:hidden text-white hover:text-[#ffd008]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBİL MENÜ İÇERİĞİ (Açılır/Kapanır) */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-gray-600 mt-3 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input 
                type="text" 
                placeholder="İlan ara..." 
                className="w-full h-10 pl-3 pr-10 text-gray-800 rounded-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-blue-600">
                <Search size={18} />
              </button>
            </form>
            
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/login" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded">
                <User size={18} /> Giriş Yap
              </Link>
              <Link href="/register" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded">
                <User size={18} /> Üye Ol
              </Link>
              <Link href="/new-listing" className="flex items-center gap-2 p-2 bg-blue-600 rounded text-white justify-center">
                <PlusCircle size={18} /> Ücretsiz İlan Ver
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}