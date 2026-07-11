import Link from 'next/link';

const ProductCard = ({ product }) => {
  const isFull = product.availableSlots <= 0;

  return (
    <div className={`bg-white rounded-[2rem] shadow-xl overflow-hidden border-2 transition-all duration-300 ${isFull ? 'border-red-500' : 'border-gray-100 hover:border-blue-700 hover:shadow-2xl'}`}>
      
      <div className="relative h-64 w-full group overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg ${isFull ? 'bg-red-600 text-white' : 'bg-white text-black'}`}>
          {isFull ? 'I PLOTËSUAR' : product.location}
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-black uppercase tracking-tight">{product.name}</h3>
          <span className="text-blue-700 font-black text-base italic">€{product.price.toFixed(2)}</span>
        </div>

        {/* NUMERIMI QE NDYRYSHON LIVE CDO 3 SEKONDA */}
        <div className="mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center font-black uppercase">
            <p className="text-[10px] text-gray-400 tracking-widest mb-1 italic">Kapaciteti Tani</p>
            <p className={`text-3xl tracking-tighter ${isFull ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                {product.availableSlots} / {product.totalSlots}
            </p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isFull ? 'bg-red-600' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]'}`}
                  style={{ width: `${(product.availableSlots / product.totalSlots) * 100}%` }}
                ></div>
            </div>
        </div>

        <Link href={`/products/${product._id}`} 
          className={`block w-full text-center py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
            isFull ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-blue-700'
          }`}>
          {isFull ? 'LOKACIONI I PLOTË' : 'REZERVO TANI'}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;