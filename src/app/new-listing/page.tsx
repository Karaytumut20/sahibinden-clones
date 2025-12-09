import NewListingWizard from "@/components/new-listing/NewListingWizard";

export default function NewListingPage() {
  return (
    <div className="container mx-auto py-10 px-4 bg-gray-50/50 min-h-screen">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#3b5062] tracking-tight">Ücretsiz İlan Ver</h1>
            <p className="text-gray-500 mt-2">Hızlı ve kolay bir şekilde ilanını oluştur, milyonlara ulaş.</p>
        </div>
        <NewListingWizard />
    </div>
  );
}