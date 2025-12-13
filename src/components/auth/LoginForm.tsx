'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { authenticate } from '@/actions/authActions';

export default function LoginForm() {
  // useActionState: Form durumunu ve hata mesajlarını yönetir
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className='w-full shadow-xl border-t-4 border-t-[#ffd008]'>
      <CardHeader className='space-y-1 text-center pb-2'>
        <CardTitle className='text-2xl font-bold text-[#3b5062]'>Giriş Yap</CardTitle>
        <p className='text-sm text-gray-500'>
          Devam etmek için hesabına giriş yap
        </p>
      </CardHeader>
      <form action={dispatch}>
        <CardContent className='space-y-4 pt-4'>
          {/* E-posta Alanı */}
          <div className='space-y-2'>
            <Label className='text-sm font-semibold text-gray-700' htmlFor='email'>E-posta Adresi</Label>
            <div className='relative'>
              <Mail className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
              <Input 
                id='email' 
                name='email' 
                type='email' 
                placeholder='ornek@domain.com' 
                className='pl-9 focus-visible:ring-[#3b5062]' 
                required 
              />
            </div>
          </div>

          {/* Şifre Alanı */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label className='text-sm font-semibold text-gray-700' htmlFor='password'>Şifre</Label>
              <Link href='#' className='text-xs text-blue-600 hover:underline'>Şifremi Unuttum</Link>
            </div>
            <div className='relative'>
              <Lock className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
              <Input 
                id='password' 
                name='password' 
                type={showPassword ? 'text' : 'password'} 
                className='pl-9 pr-10 focus-visible:ring-[#3b5062]' 
                required 
                minLength={4}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Beni Hatırla */}
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" name="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
            >
              Beni hatırla
            </label>
          </div>
          
          {/* Hata Mesajı Alanı */}
          {errorMessage && (
            <div className='flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200 animate-in fade-in slide-in-from-top-1'>
              <AlertCircle size={16} />
              <p>{errorMessage}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className='flex flex-col gap-4 bg-gray-50 pt-6 pb-6 border-t'>
          <LoginButton />
          <div className='text-xs text-center text-gray-500 flex items-center justify-center gap-1'>
            Hesabın yok mu? 
            <Link href='/register' className='text-blue-600 hover:underline font-bold'>
              Hemen Üye Ol
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

// Buton bileşeni
function LoginButton() {
  const { pending } = useFormStatus();
 
  return (
    <Button 
      type='submit'
      disabled={pending}
      className='w-full bg-[#3b5062] hover:bg-[#2c3e4e] text-white font-semibold h-10 shadow-sm transition-all hover:shadow-md'
    >
      {pending ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Giriş Yapılıyor...
        </>
      ) : (
        'Giriş Yap'
      )}
    </Button>
  );
}