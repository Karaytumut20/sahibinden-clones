import { Button } from "@/components/ui/button";
import { Phone, User } from "lucide-react";
import MessageModal from "@/components/modals/MessageModal";

export default function SellerSidebar() {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm sticky top-20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          <User size={24} />
        </div>
        <div>
          <h4 className="font-bold text-[#3b5062]">Ahmet Yılmaz</h4>
          <p className="text-xs text-gray-500">Üyelik: Ekim 2020</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button className="w-full bg-[#3b5062] hover:bg-[#2c3e4e] h-10">
          <Phone size={16} className="mr-2" />
          0532 555 XX XX
        </Button>
        
        {/* Modal Buraya Eklendi */}
        <MessageModal />
      </div>
    </div>
  );
}