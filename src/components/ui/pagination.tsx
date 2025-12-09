import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8 py-4">
      <Button 
        variant="outline" 
        size="icon" 
        disabled={currentPage <= 1}
        className="h-8 w-8"
      >
        <ChevronLeft size={16} />
      </Button>
      
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        // Basit mantık: Çok fazla sayfa varsa hepsini gösterme (Örnek: ilk 5)
        if (page > 5) return null;
        
        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className={`h-8 w-8 ${currentPage === page ? "bg-[#3b5062] hover:bg-[#2c3e4e]" : "text-gray-600"}`}
          >
            {page}
          </Button>
        );
      })}

      {totalPages > 5 && <span className="text-gray-400">...</span>}

      <Button 
        variant="outline" 
        size="icon" 
        disabled={currentPage >= totalPages}
        className="h-8 w-8"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}