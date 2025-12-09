"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, PlusCircle, Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Mobilde arama barını açıp kapatmak için state
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); 
  const { theme, setTheme } = useTheme();
  
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsMobileSearchOpen(false); // Aramadan sonra kapat
    }
  };

  return (
    <header className="bg-[#3b5062] dark:bg-[#1e293b] text-white py-3 shadow-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          
          {/* LOGO */}
          <Link href="/" className="text-2xl font-bold tracking-tighter text-[#ffd008] flex-shrink-0 mr-4">
            sahibinden<span className="text-white text-xs opacity-80 font-normal ml-1">clone</span>
          </Link>

          {/* ARAMA ÇUBUĞU (Masaüstü) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative mr-6">
            <input 
              type="text" 
              placeholder="Kelime, ilan no veya mağaza adı ile ara" 
              className="w-full h-10 pl-4 pr-12 text-gray-800 dark:text-white dark:bg-slate-800 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#ffd008] transition-all placeholder:text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-r-sm transition-colors">
              <Search size={18} />
            </button>
          </form>

          {/* SAĞ TARAF (Mobil ve Masaüstü Ortak) */}
          <div className="flex items-center gap-2">
            
            {/* MOBİL İÇİN: Arama Açma Butonu */}
            <button 
              className="md:hidden p-2 text-white hover:text-[#ffd008]"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search size={22} />
            </button>

            {/* DARK MODE TOGGLE (Artık Mobilde de Görünüyor) */}
            {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-white hover:bg-white/10 hover:text-[#ffd008]"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
            )}

            {/* MASAÜSTÜ MENÜ (Gizli kalmaya devam ediyor) */}
            <div className="hidden md:flex items-center gap-3 text-sm font-medium">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>AY</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Ahmet Yılmaz</p>
                        <p className="text-xs leading-none text-muted-foreground">ahmet@example.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile"><DropdownMenuItem className="cursor-pointer"><LayoutDashboard className="mr-2 h-4 w-4" /><span>Hesabım</span></DropdownMenuItem></Link>
                    <Link href="/profile/my-listings"><DropdownMenuItem className="cursor-pointer"><PlusCircle className="mr-2 h-4 w-4" /><span>İlanlarım</span></DropdownMenuItem></Link>
                    <Link href="/profile/settings"><DropdownMenuItem className="cursor-pointer"><Settings className="mr-2 h-4 w-4" /><span>Ayarlar</span></DropdownMenuItem></Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => setIsLoggedIn(false)}><LogOut className="mr-2 h-4 w-4" /><span>Çıkış Yap</span></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login" className="flex items-center gap-1 hover:text-[#ffd008] transition-colors"><User size={18} /><span>Giriş Yap</span></Link>
                  <span className="text-gray-500">|</span>
                  <Link href="/register" className="hover:text-[#ffd008] transition-colors">Üye Ol</Link>
                </>
              )}

              <Link href="/new-listing">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm h-9 px-4 ml-2 gap-2 shadow-sm border border-blue-500">
                  <PlusCircle size={16} />
                  <span>Ücretsiz İlan Ver</span>
                </Button>
              </Link>
            </div>

            {/* MOBİL MENÜ BUTONU (Hamburger) */}
            <button 
              className="md:hidden text-white hover:text-[#ffd008] ml-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBİL ARAMA BARI (Toggle ile açılır) */}
        {isMobileSearchOpen && (
           <div className="md:hidden py-3 animate-in slide-in-from-top-5">
             <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  placeholder="Mobilde ilan ara..." 
                  className="w-full h-10 pl-4 pr-10 text-gray-800 dark:text-white dark:bg-slate-800 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-[#ffd008]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="absolute right-2 top-2 text-blue-600">
                  <Search size={20} />
                </button>
             </form>
           </div>
        )}

        {/* MOBİL MENÜ LİSTESİ */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-4 border-t border-gray-600 mt-2 animate-in slide-in-from-top-2 bg-[#3b5062] dark:bg-[#1e293b]">
            <div className="flex flex-col gap-3 text-sm">
              {isLoggedIn ? (
                 <>
                    <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg mx-2">
                        <Avatar className="h-10 w-10 border-2 border-white/20">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AY</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-bold block">Ahmet Yılmaz</span>
                          <span className="text-xs text-gray-300">ahmet@example.com</span>
                        </div>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg mx-2">
                        <LayoutDashboard size={20} /> Hesabım Özeti
                    </Link>
                    <Link href="/profile/my-listings" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg mx-2">
                        <PlusCircle size={20} /> İlanlarım
                    </Link>
                    <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg mx-2 text-red-300">
                        <LogOut size={20} /> Çıkış Yap
                    </button>
                 </>
              ) : (
                 <div className="grid grid-cols-2 gap-2 mx-2">
                    <Link href="/login" className="flex items-center justify-center gap-2 p-3 bg-white/10 rounded-lg">
                        <User size={18} /> Giriş Yap
                    </Link>
                    <Link href="/register" className="flex items-center justify-center gap-2 p-3 bg-[#ffd008] text-[#3b5062] font-bold rounded-lg">
                        <User size={18} /> Üye Ol
                    </Link>
                 </div>
              )}
              
              <div className="mx-2 mt-2">
                <Link href="/new-listing">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base shadow-lg">
                    <PlusCircle size={20} className="mr-2" /> Ücretsiz İlan Ver
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}