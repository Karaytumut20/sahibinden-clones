import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex h-full w-full items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}