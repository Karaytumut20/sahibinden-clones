import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPendingListings, approveListing, rejectListing } from "@/actions/adminActions";

export default async function AdminPendingListingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const pending = await getPendingListings();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bekleyen İlanlar (Onay Kuyruğu)</h1>

      {pending.length === 0 ? (
        <div className="p-6 rounded-xl border bg-white">Bekleyen ilan yok ✅</div>
      ) : (
        <div className="space-y-4">
          {pending.map((l) => (
            <div key={l.id} className="p-5 rounded-xl border bg-white space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">{l.title}</div>
                  <div className="text-sm text-gray-600">
                    Kategori: {l.category?.name} • Şehir: {l.city}/{l.district}
                  </div>
                  <div className="text-sm text-gray-600">
                    Kullanıcı: {l.user?.name ?? ""} {l.user?.surname ?? ""} ({l.user?.email})
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold">{String(l.price)} {l.currency}</div>
                  <div className="text-xs text-gray-500">ID: {l.id}</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <form action={async () => { "use server"; await approveListing(l.id); }}>
                  <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
                    Onayla & Yayınla
                  </button>
                </form>

                <form action={async () => { "use server"; await rejectListing(l.id, "Admin tarafından reddedildi."); }}>
                  <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                    Reddet
                  </button>
                </form>
              </div>

              {l.images?.length ? (
                <div className="text-xs text-gray-500">Fotoğraf sayısı: {l.images.length}</div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}