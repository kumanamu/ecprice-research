import Header from "./Header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        {children}
      </main>
    </>
  );
}
