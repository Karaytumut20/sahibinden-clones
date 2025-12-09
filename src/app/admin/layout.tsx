import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header (Opsiyonel) */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm md:hidden">
            <span className="font-bold text-gray-700">Admin Paneli</span>
            {/* Mobil toggle buraya eklenebilir */}
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}