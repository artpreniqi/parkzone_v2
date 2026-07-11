import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [favorites] = useLocalStorage(`favorites_${session?.user?.id}`, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/bookings");
      setBookings(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    if (session) fetchBookings();
  }, [session]);

  // LOGJIKA QE KONTROLLON STATUSIN LIVE
  const getStatus = (endDate, toTime) => {
    const tani = new Date();
    const mbarimi = new Date(`${endDate.split('T')[0]}T${toTime}`);
    return tani > mbarimi ? "Përfunduar" : "Aktiv";
  };

  if (!session) return <div className="py-40 text-center font-black uppercase">Ju lutem kyçuni...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-black">
      <h1 className="text-5xl font-black mb-16 uppercase tracking-tighter italic">Paneli i Kontrollit</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* REZERVIMET (MAJTAS) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black uppercase border-b-4 border-blue-600 w-fit pb-1 mb-8 italic">Rezervimet e fundit</h2>
          {bookings.map((b) => {
            const status = getStatus(b.endDate, b.toTime);
            return (
              <div key={b._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-blue-600 transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-4 h-4 rounded-full ${status === "Aktiv" ? "bg-green-500 animate-ping" : "bg-red-500 shadow-inner"}`}></div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">{b.parkingName}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase">{new Date(b.startDate).toLocaleDateString()} | {b.fromTime} - {b.toTime}</p>
                  </div>
                </div>

                <div className="text-center px-10 border-x border-gray-50">
                    <p className="text-[9px] font-black text-gray-300 uppercase mb-1">Statusi</p>
                    <p className={`font-black text-xs uppercase ${status === "Aktiv" ? "text-green-600" : "text-red-500"}`}>{status}</p>
                </div>

                <Link href={`/bookings/${b._id}`} className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase hover:bg-blue-700 transition shadow-lg shadow-blue-100">Fatura</Link>
              </div>
            );
          })}
          {bookings.length === 0 && <p className="py-20 text-center font-bold text-gray-300 uppercase italic">Nuk keni asnjë rezervim aktiv.</p>}
        </div>

        {/* SIDEBAR (DJATHTAS) */}
        <div className="space-y-6">
          <div className="bg-blue-600 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Të Preferuarat</p>
             <p className="text-7xl font-black italic">{favorites?.length || 0}</p>
             <Link href="/favorites" className="inline-block mt-8 bg-yellow-400 text-blue-900 px-6 py-2 rounded-xl font-black text-[10px] uppercase">Hap Listën</Link>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
          </div>

          <div className="bg-black p-10 rounded-[3rem] shadow-xl text-white">
             <p className="text-[10px] font-black uppercase opacity-60 mb-2">Përdoruesi</p>
             <p className="font-black text-xl uppercase tracking-tighter mb-6 leading-none">{session.user.name}</p>
             <Link href="/profile" className="text-xs font-black text-yellow-400 uppercase hover:underline">Menaxho Profilin →</Link>
          </div>
        </div>

      </div>
    </div>
  );
}