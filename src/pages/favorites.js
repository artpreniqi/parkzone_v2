import { useSession } from "next-auth/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function FavoritesPage() {
  const { data: session } = useSession();
  
  // RREGULLIMI: Çelësi dinamik
  const favKey = session ? `favorites_${session.user.id}` : "favorites_guest";
  const [favorites] = useLocalStorage(favKey, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-black">
      <div className="flex justify-between items-end mb-16 border-b-8 border-gray-50 pb-10">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Të Preferuarat</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">Lista juaj personale e lokacioneve</p>
        </div>
        <p className="text-3xl font-black text-red-500 italic opacity-20">{favorites.length}</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {favorites.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-32 bg-gray-50 rounded-[4rem] text-center border-4 border-dashed border-gray-100">
          <p className="text-2xl font-black text-gray-300 uppercase tracking-tighter mb-8">Nuk keni asnjë pëlqim ende</p>
          <Link href="/" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition shadow-xl">Ballina</Link>
        </div>
      )}
    </div>
  );
}