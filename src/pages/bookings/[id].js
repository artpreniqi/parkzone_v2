import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function BookingSummary() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get("/api/bookings")
        .then(res => {
          const found = res.data.find(b => b._id === id);
          setBooking(found);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return (
    <div className="py-40 text-center font-black uppercase tracking-widest animate-pulse">
      Duke gjeneruar faturën...
    </div>
  );

  if (!booking) return (
    <div className="py-40 text-center">
        <p className="font-black text-red-600 uppercase">Rezervimi nuk u gjet!</p>
        <Link href="/dashboard" className="text-blue-600 font-bold underline mt-4 inline-block">Kthehu te Rezervimet</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* KARTELA E FATURËS */}
      <div className="bg-white rounded-[3.5rem] shadow-2xl border-t-[12px] border-blue-700 overflow-hidden">
        
        {/* HEADER I FATURËS */}
        <div className="bg-gray-50 p-10 text-center border-b-2 border-dashed border-gray-100">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Konfirmim Zyrtar
            </div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tighter">Detajet e Rezervimit</h1>
            <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-widest">Transaksioni ID: {booking._id}</p>
        </div>

        <div className="p-10 space-y-10">
            {/* LOKACIONI */}
            <div className="text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Lokacioni i Përzgjedhur</p>
                <h2 className="text-4xl font-black text-black uppercase tracking-tighter leading-none">{booking.parkingName}</h2>
            </div>

            {/* PERIUDHA (DATA DHE ORA) */}
            <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border-2 border-blue-50">
                <p className="text-center text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6">Periudha e Qëndrimit</p>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Hyrja</p>
                        <p className="text-lg font-black text-black uppercase">{new Date(booking.startDate).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p className="text-3xl font-black text-blue-700 leading-none">{booking.fromTime}</p>
                    </div>

                    <div className="hidden md:block">
                        <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>

                    <div className="text-center md:text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Dalja</p>
                        <p className="text-lg font-black text-black uppercase">{new Date(booking.endDate).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p className="text-3xl font-black text-blue-700 leading-none">{booking.toTime}</p>
                    </div>
                </div>
            </div>

            {/* MJETI DHE INFO SHTESË */}
            <div className="grid grid-cols-2 gap-8 px-4">
                <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Mjeti / Targat</p>
                    <p className="text-xl font-black text-black uppercase tracking-tight">{booking.plate}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Kategoria</p>
                    <p className="text-xl font-black text-black uppercase tracking-tight">{booking.type}</p>
                </div>
            </div>

            {/* STATUSI FINAL */}
            <div className="pt-8 border-t-2 border-gray-50">
                <div className="bg-green-600 p-5 rounded-2xl flex items-center justify-between shadow-xl shadow-green-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">✓</div>
                        <p className="font-black text-white uppercase text-sm tracking-widest">Rezervim i Konfirmuar</p>
                    </div>
                    <p className="text-[10px] font-black text-green-100 uppercase tracking-tighter">Sistemi ParkZone</p>
                </div>
            </div>

            {/* BUTONI KTHYES */}
            <div className="pt-4 text-center">
                <Link href="/dashboard" className="inline-block w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                    Kthehu te Paneli
                </Link>
                <p className="text-[9px] font-bold text-gray-300 uppercase mt-6 tracking-[0.3em]">
                    Kjo faturë është gjeneruar automatikisht dhe shërben si dëshmi për parking.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}