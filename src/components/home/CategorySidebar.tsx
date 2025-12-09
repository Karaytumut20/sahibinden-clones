import Link from "next/link";
import { Car, Home, ShoppingBag, Briefcase, Wrench, MoreHorizontal, Monitor, Utensils } from "lucide-react";

const categories = [
  { name: "Emlak", icon: Home, count: "1205" },
  { name: "Vasıta", icon: Car, count: "5420" },
  { name: "Yedek Parça", icon: Wrench, count: "850" },
  { name: "Alışveriş", icon: ShoppingBag, count: "12300" },
  { name: "İş Makineleri", icon: Briefcase, count: "420" },
  { name: "Elektronik", icon: Monitor, count: "3500" },
  { name: "Ev Eşyaları", icon: Utensils, count: "980" },
  { name: "Hizmetler", icon: MoreHorizontal, count: "150" },
];

export default function CategorySidebar() {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 hidden md:block">
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden sticky top-24">
        <div className="bg-gray-50 p-3 border-b">
            <h2 className="font-bold text-gray-700 text-sm">Kategoriler</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {categories.map((cat) => (
            <li key={cat.name}>
              <Link 
                href={'/category/' + cat.name.toLowerCase()}
                className="flex items-center justify-between p-3 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
              >
                <div className="flex items-center gap-2 text-sm text-gray-700 group-hover:text-blue-600">
                    <cat.icon size={16} className="text-gray-400 group-hover:text-blue-600"/>
                    <span className="truncate max-w-[140px]">{cat.name}</span>
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full group-hover:bg-white group-hover:text-blue-600">
                    {cat.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}