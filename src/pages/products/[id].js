import dbConnect from "@/lib/mongodb";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function ProductDetails({ product: initialProduct }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState(initialProduct);
  const [liveAvailable, setLiveAvailable] = useState(initialProduct.availableSlots);
  const [vehicles, setVehicles] = useState([]);
  const [favorites, setFavorites] = useLocalStorage(`favorites_${session?.user?.id}`, []);
  
  // STATES PER PAGESEN
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [durationHours, setDurationHours] = useState(0);

  // STATE PER FUSHAT E KARTELES
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: ""
  });

  const [bookingData, setBookingData] = useState({
    startDate: "", endDate: "", fromTime: "08:00", toTime: "10:00",
    vehicle: "", manualPlate: "", type: "Vizitor"
  });

  // LLOGARITJA LIVE E CMIMIT
  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate && bookingData.fromTime && bookingData.toTime) {
        const start = new Date(`${bookingData.startDate}T${bookingData.fromTime}`);
        const end = new Date(`${bookingData.endDate}T${bookingData.toTime}`);
        
        const diffInMs = end - start;
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours > 0) {
            const roundedHours = Math.ceil(diffInHours);
            setDurationHours(roundedHours);
            setCalculatedPrice(roundedHours * initialProduct.price);
        } else {
            setCalculatedPrice(0);
            setDurationHours(0);
        }
    }
  }, [bookingData, initialProduct.price]);

  useEffect(() => {
    const syncLive = async () => {
      try {
        const res = await axios.get("/api/capacity");
        const freeCount = res.data[initialProduct._id];
        if (freeCount !== undefined) setLiveAvailable(freeCount);
      } catch (err) { console.log("Sync..."); }
    };
    if (session) axios.get("/api/vehicles").then(res => setVehicles(res.data));
    syncLive();
    const interval = setInterval(syncLive, 2000);
    return () => clearInterval(interval);
  }, [session, initialProduct._id]);

  const toggleFavorite = () => {
    if (!session) return alert("Kyçuni!");
    const isFavorite = favorites?.some(f => f._id === initialProduct._id);
    isFavorite ? setFavorites(favorites.filter(f => f._id !== initialProduct._id)) : setFavorites([...favorites, initialProduct]);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (calculatedPrice <= 0) return alert("Ju lutem zgjedhni një afat valid!");
    if (liveAvailable <= 0) return alert("Ky parking është i mbushur!");
    
    const plate = bookingData.vehicle === "other" ? bookingData.manualPlate : bookingData.vehicle;
    if (!plate) return alert("Zgjidhni mjetin!");

    setShowPaymentModal(true);
  };

  // KONTROLLI FINAL I REZERVIMIT DHE PAGESES
  const handleFinalBooking = async () => {
    // VALIDIMI I FUSHAVE TE KARTELES
    if (!cardData.number || cardData.number.length < 16) return alert("Shënoni numrin e saktë të kartelës (16 shifra)!");
    if (!cardData.expiry || cardData.expiry.length < 5) return alert("Shënoni datën e skadimit (MM/YY)!");
    if (!cardData.cvc || cardData.cvc.length < 3) return alert("Shënoni kodin CVC!");
    if (!cardData.name) return alert("Shënoni emrin e pronarit të kartelës!");

    const plate = bookingData.vehicle === "other" ? bookingData.manualPlate : bookingData.vehicle;
    try {
      await axios.post("/api/bookings", {
        ...bookingData,
        parkingName: initialProduct.name,
        parkingId: initialProduct._id,
        plate: plate,
        totalPrice: calculatedPrice
      });
      alert("✓ PAGESA U KRYE! REZERVIMI U KONFIRMUA.");
      router.push("/dashboard");
    } catch (err) {
      alert("Gabim gjatë procesimit!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-black font-black uppercase tracking-tighter">
      <Link href="/" className="text-blue-600 mb-6 inline-flex items-center text-[10px] tracking-widest italic text-black">← Ballina</Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-4">
        <div className="lg:col-span-7 space-y-6">
          <div className="relative group overflow-hidden rounded-[2rem] shadow-xl border-4 border-white bg-gray-100">
            <img src={initialProduct.image} className="w-full h-80 object-cover transition duration-1000 hover:scale-105" alt="P" />
            <button onClick={toggleFavorite} className="absolute top-6 right-6 p-4 rounded-2xl bg-white/90 text-red-500 shadow-xl">❤️</button>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl italic">{initialProduct.name}</h1>
                <div className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold italic tracking-widest uppercase">€{initialProduct.price}/HR</div>
            </div>
            <div className={`p-6 rounded-2xl border-2 mb-8 text-center transition-all ${liveAvailable > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-[10px] text-gray-400 tracking-widest mb-1 italic">Kapaciteti Tani</p>
                <p className={`text-4xl tracking-tighter ${liveAvailable > 0 ? 'text-green-700' : 'text-red-600 animate-pulse'}`}>{liveAvailable} / {initialProduct.totalSlots} LIRË</p>
            </div>
            <p className="text-black text-sm italic font-bold leading-relaxed border-l-4 border-gray-100 pl-4">"{initialProduct.description}"</p>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-7 rounded-[2.5rem] shadow-2xl border h-fit sticky top-20 font-black">
          {session ? (
            <form onSubmit={handleProceedToPayment} className="space-y-6 text-black">
              <h3 className="text-lg tracking-tighter mb-4 border-b-4 border-blue-600 w-fit pb-1 uppercase">Rezervimi</h3>
              <div className="grid grid-cols-2 gap-3 text-[8px] uppercase">
                <div><label className="mb-1 block">Nga Data</label><input type="date" required className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-black" onChange={e=>setBookingData({...bookingData, startDate: e.target.value})} /></div>
                <div><label className="mb-1 block">Deri më</label><input type="date" required className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-black" onChange={e=>setBookingData({...bookingData, endDate: e.target.value})} /></div>
                <div><label className="mb-1 block">Ora Hyrjes</label><input type="time" required className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-black" value={bookingData.fromTime} onChange={e=>setBookingData({...bookingData, fromTime: e.target.value})} /></div>
                <div><label className="mb-1 block">Ora Daljes</label><input type="time" required className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-black" value={bookingData.toTime} onChange={(e) => setBookingData({...bookingData, toTime: e.target.value})} /></div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] text-gray-400">DITË/ORË TË LLOGARITURA:</span>
                    <span className="text-xs font-black">{durationHours} HR</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-black">TOTALI PËR PAGESË:</span>
                    <span className="text-xl text-blue-700 font-black">€{calculatedPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={()=>setBookingData({...bookingData, type:"Vizitor"})} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black border-2 transition-all ${bookingData.type === "Vizitor" ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100"}`}>VIZITOR</button>
                <button type="button" onClick={()=>setBookingData({...bookingData, type:"Rezident"})} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black border-2 transition-all ${bookingData.type === "Rezident" ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100"}`}>REZIDENT</button>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] block">Zgjidh Mjetin</label>
                <select required className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-black text-sm" onChange={e=>setBookingData({...bookingData, vehicle: e.target.value})}>
                    <option value="">Zgjidhni...</option>
                    {vehicles.map(v => <option key={v._id} value={v.plate}>{v.model.toUpperCase()} — {v.plate}</option>)}
                    <option value="other">Tjetër (Manual)</option>
                </select>
                {bookingData.vehicle === "other" && (
                    <input placeholder="SHËNO TARGAT..." className="w-full p-4 border-2 border-blue-600 rounded-xl font-black uppercase text-sm outline-none animate-in fade-in" onChange={e=>setBookingData({...bookingData, manualPlate: e.target.value})} required />
                )}
              </div>
              
              <button disabled={liveAvailable <= 0 || calculatedPrice <= 0} className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${liveAvailable <= 0 || calculatedPrice <= 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-700 text-white hover:bg-black'}`}>
                Vazhdo te Pagesa
              </button>
            </form>
          ) : <div className="text-center py-10 text-[10px] text-gray-400 italic font-black uppercase">Ju lutem kyçuni për të rezervuar</div>}
        </div>
      </div>

      {/* --- MODAL I PAGESES ME VALIDIM --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-[3rem] max-w-md w-full p-10 shadow-2xl border-4 border-blue-600 text-black">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Pagesa e Sigurt</h2>
                    <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest">Plotësoni të dhënat e kartelës</p>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl flex justify-between items-center mb-8 border-2 border-blue-100 font-black">
                    <span className="text-[10px] uppercase opacity-60">Shuma:</span>
                    <span className="text-2xl text-blue-700 italic">€{calculatedPrice.toFixed(2)}</span>
                </div>

                <div className="space-y-4 font-black">
                    <input 
                      className="w-full p-4 border-2 border-gray-100 rounded-xl text-sm outline-none focus:border-blue-600" 
                      placeholder="NUMRI I KARTELËS (16 SHIFRA)" 
                      maxLength="16" 
                      onChange={(e) => setCardData({...cardData, number: e.target.value})}
                      required 
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                          className="w-full p-4 border-2 border-gray-100 rounded-xl text-sm outline-none focus:border-blue-600" 
                          placeholder="MM / YY" 
                          maxLength="5" 
                          onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                          required 
                        />
                        <input 
                          className="w-full p-4 border-2 border-gray-100 rounded-xl text-sm outline-none focus:border-blue-600" 
                          placeholder="CVC" 
                          maxLength="3" 
                          onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                          required 
                        />
                    </div>
                    <input 
                      className="w-full p-4 border-2 border-gray-100 rounded-xl text-sm uppercase outline-none focus:border-blue-600" 
                      placeholder="EMRI DHE MBIEMRI NË KARTELË" 
                      onChange={(e) => setCardData({...cardData, name: e.target.value})}
                      required 
                    />
                </div>

                <button 
                  onClick={handleFinalBooking} 
                  className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all mt-8 active:scale-95"
                >
                    KONFIRMO PAGESËN DHE REZERVO
                </button>
                <button onClick={()=>setShowPaymentModal(false)} className="w-full text-[9px] text-gray-300 uppercase mt-4 hover:text-black transition-all italic font-black">Anulo dhe kthehu</button>
            </div>
        </div>
      )}
    </div>
  );
}

// SERVER LOGIC
export async function getStaticPaths() {
  try {
    await dbConnect();
    const ProductModel = (await import("@/models/Product")).default;
    const res = await ProductModel.find({}, { _id: 1 });
    return { paths: res.map(p => ({ params: { id: p._id.toString() } })), fallback: true };
  } catch (e) { return { paths: [], fallback: true }; }
}

export async function getStaticProps({ params }) {
  try {
    await dbConnect();
    const ProductModel = (await import("@/models/Product")).default;
    const res = await ProductModel.findById(params.id);
    return { props: { product: JSON.parse(JSON.stringify(res)) }, revalidate: 1 };
  } catch (error) { return { notFound: true }; }
}