import ProfileSidebar from "@/components/profile/ProfileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <ProfileSidebar />
        <main className="flex-1 min-w-0">
            {children}
        </main>
      </div>
    </div>
  );
}