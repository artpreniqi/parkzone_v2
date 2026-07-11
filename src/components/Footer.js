import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-20 font-black uppercase">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left text-black">
        <div>
          <h3 className="text-2xl font-black text-blue-700 tracking-tighter mb-4 italic">PARKZONE</h3>
          <p className="text-gray-400 font-bold text-[10px] leading-relaxed tracking-widest italic">
            Platforma lider për menaxhimin e parkingjeve. Siguri 100% dhe transparencë totale në çdo rezervim.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-black text-black uppercase tracking-[0.3em] mb-6">Navigimi</h4>
          <ul className="space-y-3 text-[10px] tracking-widest text-gray-500">
            <li><Link href="/" className="hover:text-blue-700 transition">Ballina</Link></li>
            <li><Link href="/faq" className="hover:text-blue-700 transition">Pyetjet FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-blue-700 text-red-500 transition">Kushtet dhe Rregullat</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-black text-black uppercase tracking-[0.3em] mb-6">Mbështetja</h4>
          <p className="text-[10px] font-bold text-gray-500 mb-2 italic uppercase">Qendra e Thirrjeve: 0800 123 45</p>
          <p className="text-[10px] font-bold text-gray-500 italic uppercase">Email: info@parkzone.com</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-50 text-center">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">
          © {new Date().getFullYear()} ParkZone System - Të gjitha të drejtat e rezervuara.
        </p>
      </div>
    </footer>
  );
};

export default Footer;