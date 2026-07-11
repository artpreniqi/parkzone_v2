import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-black text-blue-700">404</h1>
      <p className="text-2xl font-black text-black uppercase tracking-tighter mt-4">Faqja nuk u gjet!</p>
      <p className="text-gray-400 font-bold mt-2 mb-8">Duket se keni humbur rrugën për në parking.</p>
      <Link href="/" className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition">
        Kthehu në Ballinë
      </Link>
    </div>
  );
}