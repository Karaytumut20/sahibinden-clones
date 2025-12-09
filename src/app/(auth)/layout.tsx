export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 bg-gray-50/50">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}