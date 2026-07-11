import { useState, useEffect } from "react";
import dbConnect from "@/lib/mongodb";
import ProductCard from "@/components/ProductCard";
import axios from "axios";

export default function ProductsPage({ products }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [liveAvailableSlots, setLiveAvailableSlots] = useState({});

  useEffect(() => {
    const updateCapacity = async () => {
      try {
        const res = await axios.get("/api/capacity");
        setLiveAvailableSlots(res.data);
      } catch (err) { console.log("Sync..."); }
    };
    updateCapacity();
    const interval = setInterval(updateCapacity, 3000); 
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-black font-black uppercase">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 border-b-8 border-gray-50 pb-12">
        <div>
          <h1 className="text-6xl tracking-tighter italic leading-none">Lokacionet</h1>
          <p className="text-gray-400 font-bold text-[10px] tracking-[0.3em] mt-4">Eksploro rrjetin tonë live</p>
        </div>
        
        {/* Search bar*/}
        <div className="w-full max-w-md bg-gray-50 p-2 rounded-2xl border-2 border-gray-100 flex items-center px-4">
            <input 
                type="text" 
                placeholder="FILTRO LOKACIONET..." 
                className="w-full bg-transparent outline-none text-xs font-black p-2"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
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
  );
}

export async function getServerSideProps() {
  try {
    await dbConnect();
    const ProductModel = (await import("@/models/Product")).default;
    const res = await ProductModel.find({}).sort({ createdAt: -1 });
    return { props: { products: JSON.parse(JSON.stringify(res)) } };
  } catch (error) { return { props: { products: [] } }; }
}