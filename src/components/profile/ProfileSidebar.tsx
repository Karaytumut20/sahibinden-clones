"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  List, 
  Heart, 
  MessageSquare, 
  Settings, 
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/profile", label: "Özet Durum", icon: LayoutDashboard },
  { href: "/profile/my-listings", label: "İlanlarım", icon: List },
  { href: "/favorites", label: "Favorilerim", icon: Heart },
  { href: "/profile/messages", label: "Mesajlarım", icon: MessageSquare }, // İleride eklenebilir
  { href: "/profile/settings", label: "Ayarlar", icon: Settings },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
      {/* Profil Kartı */}
      <div className="bg-white border rounded-lg p-6 text-center shadow-sm mb-4">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
            <User size={40} />
        </div>
        <h2 className="font-bold text-[#3b5062]">Ahmet Yılmaz</h2>
        <p className="text-xs text-gray-500">Üyelik Tarihi: Ekim 2024</p>
      </div>

      {/* Menü Linkleri */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <nav className="flex flex-col">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-600 border-b last:border-0",
                  isActive ? "bg-blue-50 text-blue-600 border-l-4 border-l-blue-600" : "text-gray-700 border-l-4 border-l-transparent"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
          
          <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left">
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </nav>
      </div>
    </aside>
  );
}