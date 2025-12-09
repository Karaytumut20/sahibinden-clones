import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap pb-1">
      <Link href="/" className="hover:text-blue-600 flex items-center">
        <Home size={14} className="mr-1" />
        Anasayfa
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight size={14} className="mx-1 text-gray-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-blue-600 font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-gray-700">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}