import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";

export default function Profile() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({ bookings: 0, parkedCars: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({ 
    name: "", email: "", phone: "", image: "" 
  });

  useEffect(() => {
    const loadData = async () => {
      if (session) {
        try {
          // Marrim të dhënat e përdoruesit direkt nga DB
          const userRes = await axios.get("/api/user/me");
          setProfileData({
            name: userRes.data.name || "",
            email: userRes.data.email || "",
            phone: userRes.data.phone || "",
            image: userRes.data.image || ""
          });

          // Marrim rezervimet dhe kalkulojmë statusin "Live"
          const bookingsRes = await axios.get("/api/bookings");
          const allBookings = bookingsRes.data;

          const now = new Date();
          const activeParked = allBookings.filter(b => {
            // MBROJTJA: Nëse rezervimi nuk i ka fushat e reja, mos e llogarit dhe mos bëj crash
            if (!b.startDate || !b.endDate || !b.fromTime || !b.toTime) return false;

            try {
                const start = new Date(b.startDate);
                const end = new Date(b.endDate);
                
                // Përdorim vlerë rezervë (fallback) 
                const [hFrom, mFrom] = (b.fromTime || "00:00").split(":");
                const [hTo, mTo] = (b.toTime || "00:00").split(":");
                
                start.setHours(parseInt(hFrom), parseInt(mFrom), 0);
                end.setHours(parseInt(hTo), parseInt(mTo), 0);

                return now >= start && now <= end;
            } catch (e) {
                return false;
            }
          }).length;

          setStats({ 
            bookings: allBookings.length, 
            parkedCars: activeParked 
          });
          
          setLoading(false);
        } catch (err) {
          console.error("Gabim gjatë ngarkimit:", err);
          setLoading(false);
        }
      }
    };
    loadData();
  }, [session]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) {
        alert("Fotoja është shumë e madhe! Maksimumi 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put("/api/user/update", profileData);
      alert("Ndryshimet u ruajtën me sukses!");
      setIsEditing(false);
      window.location.reload(); 
    } catch (err) {
      alert("Gabim gjatë ruajtjes.");
    }
  };

  if (status === "loading" || loading) return (
    <div className="py-40 text-center font-black uppercase tracking-[0.3em] animate-pulse italic">
      Duke sinkronizuar profilin...
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-50 overflow-hidden">
        
        {/* BANNER */}
        <div className="h-48 bg-gradient-to-r from-blue-700 to-blue-900 relative flex items-center px-12 uppercase">
            <h2 className="text-white/10 text-8xl font-black absolute right-10 select-none tracking-widest italic">USER</h2>
        </div>

        <div className="px-12 pb-12 relative">
          
          {/* AVATAR SECTION */}
          <div className="absolute -top-20 left-12 group">
            <div className="relative">
                {profileData.image ? (
                    <img src={profileData.image} className="w-40 h-40 rounded-[2.5rem] border-[6px] border-white shadow-2xl object-cover bg-white" alt="Avatar" />
                ) : (
                    <div className="w-40 h-40 bg-yellow-400 border-[6px] border-white rounded-[2.5rem] flex items-center justify-center text-6xl font-black text-blue-900 shadow-2xl uppercase">
                        {profileData.name.charAt(0)}
                    </div>
                )}
                
                {isEditing && (
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        <span className="text-[10px] font-black uppercase">Upload</span>
                    </button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>

          <div className="pt-28 flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1 w-full">
              {!isEditing ? (
                <>
                  <h1 className="text-5xl font-black text-black uppercase tracking-tighter leading-none">{profileData.name}</h1>
                  <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs italic">{profileData.email}</p>
                </>
              ) : (
                <div className="space-y-4 w-full max-w-lg">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Emri i Plotë</label>
                            <input className="w-full p-4 bg-gray-50 border-2 rounded-2xl font-black text-black outline-none focus:border-blue-600 transition-all" value={profileData.name} onChange={e=>setProfileData({...profileData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Email Adresa</label>
                            <input className="w-full p-4 bg-gray-50 border-2 rounded-2xl font-black text-black outline-none focus:border-blue-600 transition-all" value={profileData.email} onChange={e=>setProfileData({...profileData, email: e.target.value})} />
                        </div>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Numri i Telefonit</label>
                      <input className="w-full p-4 bg-gray-50 border-2 rounded-2xl font-black text-black outline-none focus:border-blue-600 transition-all" value={profileData.phone} onChange={e=>setProfileData({...profileData, phone: e.target.value})} placeholder="+383 49 000 000" />
                   </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {isEditing ? (
                <button onClick={handleSave} className="bg-green-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-green-700 active:scale-95 transition-all">Ruaj</button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="bg-blue-700 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black active:scale-95 transition-all">Edito Profilin</button>
              )}
            </div>
          </div>

          {/* STATISTIKAT REALE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-gray-100">
              <p className="text-4xl font-black text-black">{stats.bookings}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rezervime Totale</p>
            </div>
            
            <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${stats.parkedCars > 0 ? 'bg-green-50 border-green-200 shadow-lg' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-4xl font-black ${stats.parkedCars > 0 ? 'text-green-600 animate-pulse' : 'text-black'}`}>
                {stats.parkedCars}
              </p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Veturat e parkuara tani</p>
            </div>

            <div className="bg-blue-50 p-8 rounded-[2.5rem] border-2 border-blue-100">
                <p className="text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest">Anëtarësimi</p>
                <p className="font-black text-blue-900 uppercase">ParkZone Member</p>
            </div>
          </div>

          {/* CERTIFIKATA E LLOGARISË */}
          <div className="mt-16 border-t pt-12 space-y-10">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-black uppercase tracking-[0.3em]">Detajet e Verifikuara</h3>
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-4 py-1 rounded-full border border-green-100 uppercase italic">Llogari e Verifikuar ✓</span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
                <div className="border-b-2 border-gray-50 pb-4">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">ID e Përdoruesit</p>
                    <p className="font-black text-black uppercase tracking-tighter text-lg">#{session?.user?.id?.toUpperCase()}</p>
                </div>
                <div className="border-b-2 border-gray-50 pb-4">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Numri i Telefonit</p>
                    <p className={`text-lg font-black uppercase ${profileData.phone ? 'text-black' : 'text-gray-200 italic'}`}>
                        {profileData.phone || "I paplotësuar"}
                    </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}