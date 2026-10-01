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

  // Fallback UI gjatë prerender / fallback
  if (router.isFallback) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-black font-black uppercase tracking-tighter">
        <p className="text-xl animate-pulse">Duke u ngarkuar të dhënat e parkimit...</p>
      </div>
    );
  }

  // Siguro objekt të paracaktuar për të shmangur access errors
  const safeInitial = initialProduct ?? {};
  const [product, setProduct] = useState(safeInitial);
  const [liveAvailable, setLiveAvailable] = useState(safeInitial.availableSlots ?? 0);
  const [vehicles, setVehicles] = useState([]);

  // Stabilizo çelësin e localStorage për SSR/CSR
  const defaultFavKey = 'favorites_anon';
  const [favKey, setFavKey] = useState(defaultFavKey);
  const [favorites, setFavorites] = useLocalStorage(favKey, []);

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

  // Migrim favorites kur session bëhet i disponueshëm (client-side)
  useEffect(() => {
    if (!session) return;
    const userKey = `favorites_${session.user.id}`;
    if (userKey === favKey) return;
    try {
      const existing = JSON.parse(localStorage.getItem(favKey) || '[]');
      localStorage.setItem(userKey, JSON.stringify(existing));
      setFavKey(userKey);
      setFavorites(JSON.parse(localStorage.getItem(userKey) || '[]'));
    } catch (err) {
      // Nëse migrimi dështon, thjesht vendos çelësin e ri
      setFavKey(userKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // LLOGARITJA LIVE E CMIMIT
  useEffect(() => {
    if (!product) return;
    if (bookingData.startDate && bookingData.endDate && bookingData.fromTime && bookingData.toTime) {
        const start = new Date(`${bookingData.startDate}T${bookingData.fromTime}`);
        const end = new Date(`${bookingData.endDate}T${bookingData.toTime}`);
        const diffInMs = end - start;
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours > 0) {
            const roundedHours = Math.ceil(diffInHours);
            setDurationHours(roundedHours);
            setCalculatedPrice(roundedHours * (product?.price ?? 0));
        } else {
            setCalculatedPrice(0);
            setDurationHours(0);
        }
    }
  }, [bookingData, product]);

  // Sync live capacity dhe vehicles (client-side)
  useEffect(() => {
    if (!product?._id) return;
    const syncLive = async () => {
      try {
        const res = await axios.get("/api/capacity");
        const freeCount = res.data?.[product._id];
        if (freeCount !== undefined && freeCount !== null) setLiveAvailable(freeCount);
      } catch (err) { console.log("Sync error", err); }
    };
    if (session) {
      axios.get("/api/vehicles")
        .then(res => setVehicles(res.data || []))
        .catch(() => setVehicles([]));
    }
    syncLive();
    const interval = setInterval(syncLive, 2000);
    return () => clearInterval(interval);
  }, [session, product?._id]);

  const toggleFavorite = () => {
    if (!session) return alert("Kyçuni!");
    if (!product?._id) return;
    const isFavorite = favorites?.some(f => f._id === product._id);
    isFavorite ? setFavorites(favorites.filter(f => f._id !== product._id)) : setFavorites([...favorites, product]);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (calculatedPrice <= 0) return alert("Ju lutem zgjedhni një afat valid!");
    if ((liveAvailable ?? 0) <= 0) return alert("Ky parking është i mbushur!");
    
    const plate = bookingData.vehicle === "other" ? bookingData.manualPlate : bookingData.vehicle;
    if (!plate) return alert("Zgjidhni mjetin!");

    setShowPaymentModal(true);
  };

  const handleFinalBooking = async () => {
    if (!product?._id) return alert("Produkt i pavlefshëm.");
    if (!cardData.number || cardData.number.length < 16) return alert("Shënoni numrin e saktë të kartelës (16 shifra)!");
    if (!cardData.expiry || cardData.expiry.length < 5) return alert("Shënoni datën e skadimit (MM/YY)!");
    if (!cardData.cvc || cardData.cvc.length < 3) return alert("Shënoni kodin CVC!");
    if (!cardData.name) return alert("Shënoni emrin e pronarit të kartelës!");

    const plate = bookingData.vehicle === "other" ? bookingData.manualPlate : bookingData.vehicle;
    if (!plate) return alert("Zgjidhni mjetin!");

    try {
      await axios.post("/api/bookings", {
        ...bookingData,
        parkingName: product?.name ?? '',
        parkingId: product._id,
        plate,
        totalPrice: calculatedPrice
      });
      alert("✓ PAGESA U KRYE! REZERVIMI U KONFIRMUA.");
      router.push("/dashboard");
    } catch (err) {
      console.error('Booking error', err);
      alert("Gabim gjatë procesimit!");
    }
  };

  // RENDITJA E UI me product (jo initialProduct)
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-black font-black uppercase tracking-tighter">
      <Link href="/" className="text-blue-600 mb-6 inline-flex items-center text-[10px] tracking-widest italic text-black">← Ballina</Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-4">
        <div className="lg:col-span-7 space-y-6">
          <div className="relative group overflow-hidden rounded-[2rem] shadow-xl border-4 border-white bg-gray-100">
            <img
              src={product?.image ?? '/placeholder.jpg'}
              className="w-full h-80 object-cover transition duration-1000 hover:scale-105"
              alt={product?.name ?? 'Produkt'}
            />
            <button onClick={toggleFavorite} className="absolute top-6 right-6 p-4 rounded-2xl bg-white/90 text-red-500 shadow-xl">❤️</button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl italic">{product?.name ?? 'Produkt i panjohur'}</h1>
                <div className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold italic tracking-widest uppercase">€{(product?.price ?? 0)}/HR</div>
            </div>

            <div className={`p-6 rounded-2xl border-2 mb-8 text-center transition-all ${liveAvailable > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-[10px] text-gray-400 tracking-widest mb-1 italic">Kapaciteti Tani</p>
                <p className={`text-4xl tracking-tighter ${liveAvailable > 0 ? 'text-green-700' : 'text-red-600 animate-pulse'}`}>
                  {liveAvailable} / {product?.totalSlots ?? 0} VENDE
                </p>
            </div>

            <p className="text-black text-sm italic font-bold leading-relaxed border-l-4 border-gray-100 pl-4">"{product?.description ?? 'Pa përshkrim'}"</p>
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
                    <span className="text-xl text-blue-700 font-black">€{(Number.isFinite(calculatedPrice) ? calculatedPrice.toFixed(2) : '0.00')}</span>
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
                    {vehicles.map(v => <option key={v._id} value={v.plate}>{v.model?.toUpperCase() ?? ''} — {v.plate}</option>)}
                    <option value="other">Tjetër (Manual)</option>
                </select>
                {bookingData.vehicle === "other" && (
                    <input placeholder="SHËNO TARGAT..." className="w-full p-4 border-2 border-blue-600 rounded-xl font-black uppercase text-sm outline-none animate-in fade-in" onChange={e=>setBookingData({...bookingData, manualPlate: e.target.value})} required />
                )}
              </div>
              
              <button disabled={(liveAvailable ?? 0) <= 0 || calculatedPrice <= 0} className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${((liveAvailable ?? 0) <= 0 || calculatedPrice <= 0) ? 'bg-gray-200 text-gray-400' : 'bg-blue-700 text-white hover:bg-black'}`}>
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
                    <span className="text-2xl text-blue-700 italic">€{(Number.isFinite(calculatedPrice) ? calculatedPrice.toFixed(2) : '0.00')}</span>
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
    return { 
      paths: res.map(p => ({ params: { id: p._id.toString() } })), 
      fallback: "blocking" 
    };
  } catch (e) { 
    console.error('getStaticPaths error', e);
    return { paths: [], fallback: "blocking" }; 
  }
}

export async function getStaticProps({ params }) {
  try {
    await dbConnect();
    const ProductModel = (await import("@/models/Product")).default;
    const res = await ProductModel.findById(params.id);
    if (!res) return { notFound: true };

    const product = JSON.parse(JSON.stringify(res));
    const safeProduct = {
      ...product,
      availableSlots: product.availableSlots ?? 0,
      totalSlots: product.totalSlots ?? 0,
      price: product.price ?? 0,
      image: product.image ?? '/placeholder.jpg',
      name: product.name ?? null,
      description: product.description ?? null,
    };

    return { props: { product: safeProduct }, revalidate: 1 };
  } catch (error) { 
    console.error('getStaticProps error', error);
    return { notFound: true }; 
  }
}
