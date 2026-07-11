import { useState, useEffect } from "react";
import dbConnect from "@/lib/mongodb";
import ProductCard from "@/components/ProductCard";
import axios from "axios";

export default function Home({ products }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [liveAvailableSlots, setLiveAvailableSlots] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateCapacity = async () => {
      try {
        const res = await axios.get("/api/capacity");
        setLiveAvailableSlots(res.data);
      } catch (err) {
        console.log("Syncing...");
      }
    };

    updateCapacity();
    const interval = setInterval(updateCapacity, 3000); 
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <div className="relative bg-blue-700 py-24 md:py-44 px-4 overflow-hidden border-b-8 border-yellow-400">
        
        {/* 1. CUBES PATTERN */}
        <div className="absolute inset-0 opacity-10">
          <img src="https://www.transparenttextures.com/patterns/cubes.png" alt="bg" className="w-full h-full object-cover" />
        </div>

        {/* 2. TEXTI GJIGANT NE BACKGROUND */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] select-none pointer-events-none">
            <h1 className="text-[12rem] md:text-[22rem] font-black italic text-white uppercase leading-none tracking-tighter">
                PARKZONE
            </h1>
        </div>

        {/* 3. CONTENTI KRYESOR */}
        <div className="relative max-w-7xl mx-auto text-center font-black uppercase text-white">
          <h1 className="text-5xl md:text-8xl tracking-tighter italic leading-none mb-6">
            GJEJ PARKING <span className="text-yellow-400 font-outline">KUDO</span>.
          </h1>
          
          <p className="max-w-3xl mx-auto text-sm md:text-lg font-bold tracking-widest text-blue-100 normal-case mb-12 opacity-90 leading-relaxed">
            Platforma #1 në Kosovë për rezervimin e vendparkimeve në kohë reale. <br className="hidden md:block" /> 
            Sigurt, shpejt dhe thjeshtë.
          </p>
          
          {/* SEARCH BAR I NGUSHTE (max-w-xl) */}
          <div className="max-w-xl mx-auto bg-white p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 border-4 border-blue-100">
            <input 
                type="text" 
                placeholder="KËRKO LOKACIONIN..." 
                className="flex-1 p-3 outline-none text-black text-sm px-6 font-black placeholder-gray-300" 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <button className="bg-blue-700 text-white px-10 py-3 rounded-2xl font-black text-xs hover:bg-black transition-all uppercase tracking-widest">
                KËRKO
            </button>
          </div>
        </div>
      </div>

      {/* LISTA LIVE */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl font-black text-black uppercase tracking-tighter italic border-l-8 border-blue-700 pl-6">
                Lokacionet e Disponueshme
            </h2>
            <div className="hidden md:flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Sistemi Online</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProducts.map((p) => {
            const currentAvailable = liveAvailableSlots[p._id] !== undefined ? liveAvailableSlots[p._id] : p.availableSlots;
            return (
              <ProductCard key={p._id} product={{ ...p, availableSlots: currentAvailable }} />
            );
          })}
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="bg-black py-32 text-center text-white italic font-black uppercase">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16">
            <div><p className="text-7xl text-yellow-400 mb-2">500+</p><p className="text-[10px] tracking-[0.4em] opacity-50 uppercase">Vende Parkingu</p></div>
            <div><p className="text-7xl text-yellow-400 mb-2">10k+</p><p className="text-[10px] tracking-[0.4em] opacity-50 uppercase">Përdorues Aktiv</p></div>
            <div><p className="text-7xl text-yellow-400 mb-2">100%</p><p className="text-[10px] tracking-[0.4em] opacity-50 uppercase">Siguri e Garantuar</p></div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    await dbConnect();
    const ProductModel = (await import("@/models/Product")).default;
    const res = await ProductModel.find({}).sort({ createdAt: -1 });
    return { props: { products: JSON.parse(JSON.stringify(res)) }, revalidate: 1 };
  } catch (error) { return { props: { products: [] } }; }
}