import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="p-24">
      <h1 className="text-4xl font-bold mb-8">My Tools Collection</h1>
      <div className="space-y-4">
        <Link 
          href="/calculator"
          className="text-blue-500 hover:text-blue-700 text-xl block"
        >
          Calculator App
        </Link>
      </div>
    </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        footer
      </footer>
    </div>
  );
}
