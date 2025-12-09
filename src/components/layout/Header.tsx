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
  const { theme, setTheme } = useTheme();
  
  // AUTH SİMÜLASYONU: true yaparsan "Giriş Yapmış" gibi görünür
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  // Hydration hatasını önlemek için mounted kontrolü
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="bg-[#3b5062] dark:bg-[#1e293b] text-white py-3 shadow-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          
          {/* LOGO */}
          <Link href="/" className="text-2xl font-bold tracking-tighter text-[#ffd008] flex-shrink-0 mr-6">
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

          {/* SAĞ MENÜ (Masaüstü) */}
          <div className="hidden md:flex items-center gap-3 text-sm font-medium">
            
            {/* Dark Mode Toggle */}
            {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-white hover:bg-white/10 hover:text-[#ffd008]"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
            )}

            {isLoggedIn ? (
              // GİRİŞ YAPILMIŞSA: Kullanıcı Menüsü
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
                      <p className="text-xs leading-none text-muted-foreground">
                        ahmet@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Hesabım / Özet</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile/my-listings">
                    <DropdownMenuItem className="cursor-pointer">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>İlanlarım</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile/settings">
                    <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Ayarlar</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => setIsLoggedIn(false)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // GİRİŞ YAPILMAMIŞSA: Login Linkleri
              <>
                <Link href="/login" className="flex items-center gap-1 hover:text-[#ffd008] transition-colors">
                  <User size={18} />
                  <span>Giriş Yap</span>
                </Link>
                <span className="text-gray-500">|</span>
                <Link href="/register" className="hover:text-[#ffd008] transition-colors">
                  Üye Ol
                </Link>
              </>
            )}

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

        {/* MOBİL MENÜ İÇERİĞİ */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-gray-600 mt-3 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input 
                type="text" 
                placeholder="İlan ara..." 
                className="w-full h-10 pl-3 pr-10 text-gray-800 dark:text-white dark:bg-slate-800 rounded-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-blue-600">
                <Search size={18} />
              </button>
            </form>
            
            <div className="flex flex-col gap-3 text-sm">
              {isLoggedIn ? (
                 <>
                    <div className="flex items-center gap-3 p-2 bg-white/10 rounded">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AY</AvatarFallback>
                        </Avatar>
                        <span className="font-bold">Ahmet Yılmaz</span>
                    </div>
                    <Link href="/profile" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded">
                        <LayoutDashboard size={18} /> Hesabım
                    </Link>
                    <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded text-red-300">
                        <LogOut size={18} /> Çıkış Yap
                    </button>
                 </>
              ) : (
                 <>
                    <Link href="/login" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded">
                        <User size={18} /> Giriş Yap
                    </Link>
                    <Link href="/register" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded">
                        <User size={18} /> Üye Ol
                    </Link>
                 </>
              )}
              
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
