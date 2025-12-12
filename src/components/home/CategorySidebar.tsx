import Link from 'next/link';
import { getCategories } from '@/lib/data';
import { ChevronRight } from 'lucide-react';

export default async function CategorySidebar() {
  const categories = await getCategories();

  return (
    <aside className='w-full md:w-56 flex-shrink-0 hidden md:block'>
      <div className='bg-white border rounded-lg shadow-sm overflow-hidden sticky top-24'>
        <div className='bg-gray-50 p-3 border-b'>
            <h2 className='font-bold text-gray-700 text-sm'>Kategoriler</h2>
        </div>
        <ul className='divide-y divide-gray-100'>
          {categories.map((cat) => (
            <li key={cat.id} className='group'>
              <Link 
                href={`/search?category=${cat.slug}`}
                className='flex items-center justify-between p-3 hover:bg-blue-50 hover:text-blue-600 transition-colors'
              >
                <div className='flex items-center gap-2 text-sm text-gray-700 group-hover:text-blue-600'>
                    <span className='truncate max-w-[140px]'>{cat.name}</span>
                </div>
                {cat.children.length > 0 && <ChevronRight size={14} className='text-gray-300' />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}