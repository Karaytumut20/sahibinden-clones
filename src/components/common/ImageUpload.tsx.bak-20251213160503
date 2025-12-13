'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImagePlus, Trash } from 'lucide-react';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className='mb-4 flex items-center gap-4 overflow-x-auto pb-4'>
        {value.map((url) => (
          <div key={url} className='relative w-[200px] h-[150px] rounded-md overflow-hidden border border-gray-200 shadow-sm flex-shrink-0'>
            <div className='z-10 absolute top-2 right-2'>
              <Button type='button' onClick={() => onRemove(url)} variant='destructive' size='icon' className='h-8 w-8'>
                <Trash className='h-4 w-4' />
              </Button>
            </div>
            <Image fill className='object-cover' alt='Image' src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget 
        onSuccess={onUpload} 
        uploadPreset='sahibinden_clone_preset'
        options={{
            maxFiles: 10,
            resourceType: 'image'
        }}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <div 
                onClick={onClick}
                className='border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center text-gray-500 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all group'
            >
              <div className='p-4 bg-gray-100 rounded-full mb-3 group-hover:bg-white group-hover:shadow-md transition-all'>
                <ImagePlus className='h-8 w-8 text-gray-400 group-hover:text-blue-600' />
              </div>
              <span className='font-semibold text-gray-600'>Fotoğrafları Yükle</span>
              <span className='text-xs text-gray-400 mt-1'>veya sürükleyip bırakın</span>
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;