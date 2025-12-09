"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ListChecks, 
  Users, 
  Settings, 
  LogOut,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/listings", label: "İlan Yönetimi", icon: ListChecks },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
  { href: "/admin/settings", label: "Site Ayarları", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1e293b] text-white min-h-screen flex-shrink-0 flex flex-col hidden md:flex">
      {/* Admin Logo */}
      <div className="p-6 border-b border-gray-700 flex items-center gap-2">
        <ShieldCheck className="text-[#ffd008]" size={32} />
        <div>
            <h1 className="font-bold text-lg tracking-tight">Yönetim Paneli</h1>
            <p className="text-[10px] text-gray-400">v1.0.0 Admin</p>
        </div>
      </div>

      {/* Menü */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                isActive 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Alt Kısım */}
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors w-full">
            <LogOut size={20} />
            Çıkış Yap
        </button>
      </div>
    </aside>
  );
}