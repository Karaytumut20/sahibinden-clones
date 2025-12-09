import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";

export default function MessageModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-10 border-[#3b5062] text-[#3b5062] hover:bg-blue-50 group">
          <MessageSquare size={16} className="mr-2 group-hover:text-blue-600" />
          Mesaj Gönder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#3b5062]">
            <MessageSquare size={20} />
            Satıcıya Mesaj Gönder
          </DialogTitle>
          <DialogDescription>
            İlan sahibi <strong>Ahmet Yılmaz</strong> kullanıcısına mesajınız iletilecektir.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-500 border">
            <strong>İpucu:</strong> Telefon numaranızı veya kişisel bilgilerinizi paylaşırken dikkatli olunuz.
          </div>
          <Textarea 
            placeholder="Merhaba, ilanınızla ilgileniyorum. Takas düşünüyor musunuz?" 
            className="min-h-[120px] resize-none focus-visible:ring-blue-600"
          />
        </div>

        <DialogFooter>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Send size={16} className="mr-2" />
            Gönder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}