import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPendingListings, approveListing, rejectListing } from "@/actions/adminActions";

export default async function AdminPendingListingsPage() {
  const session = await auth();
  
  // 1. Güvenlik Kontrolü: Giriş yapmamışsa login'e at
  if (!session?.user?.id) redirect("/login");
  
  // 2. Rol Kontrolü: Admin değilse ana sayfaya at
  if (session.user.role !== "ADMIN") redirect("/");

  // Bekleyen ilanları veritabanından çek
  const pending = await getPendingListings();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Bekleyen İlanlar (Onay Kuyruğu)</h1>

      {pending.length === 0 ? (
        <div className="p-10 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center text-gray-500">
            🎉 Bekleyen ilan yok, her şey güncel!
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((l: any) => (
            <div key={l.id} className="p-5 rounded-xl border bg-white shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-blue-900">{l.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Kategori:</span> {l.category?.name} • 
                    <span className="font-semibold ml-2">Konum:</span> {l.city}/{l.district}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Satıcı:</span> {l.user?.name ?? "İsimsiz"} {l.user?.surname ?? ""} 
                    <span className="text-gray-400 ml-1">({l.user?.email})</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 font-mono">ID: {l.id}</div>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-xl font-bold text-[#b00]">{String(l.price)} {l.currency}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {l.images?.length ? l.images.length + " Fotoğraf" : "Fotoğraf Yok"}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t mt-2">
                <form action={async () => { "use server"; await approveListing(l.id); }}>
                  <button className="px-5 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-sm">
                    ✅ Onayla & Yayınla
                  </button>
                </form>

                <form action={async () => { "use server"; await rejectListing(l.id, "Admin tarafından reddedildi."); }}>
                  <button className="px-5 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm">
                    ❌ Reddet
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
