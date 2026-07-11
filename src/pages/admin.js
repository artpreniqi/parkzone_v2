import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("parking");
  const fileInputRef = useRef(null); 
  
  // Data States
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // UI States
  const [editingId, setEditingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Për Modal-in e klijentit
  const [formData, setFormData] = useState({ name: "", description: "", price: "", location: "", image: "", totalSlots: "", category: "Standard" });

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.role !== "admin")) {
      router.push("/");
    }
    loadAllData();
  }, [status, session]);

  const loadAllData = async () => {
    if (session?.user.role === "admin") {
      try {
        const [p, b, v, u, m] = await Promise.all([
            axios.get("/api/products"),
            axios.get("/api/bookings"),
            axios.get("/api/vehicles"),
            axios.get("/api/users"),
            axios.get("/api/messages")
        ]);
        setProducts(p.data);
        setBookings(b.data);
        setVehicles(v.data);
        setUsers(u.data);
        setMessages(m.data);
      } catch (err) { console.error("Error loading admin data"); }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

   // LOGJIKA E UPLOAD-IT TE FOTOS SE PARKINGUT
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1500000) { 
        alert("FOTOJA ESHTE SHUME E MADHE! MAKSIMUMI 1.5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveParking = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("JU LUTEM NGARKONI NJE FOTO!");

    try {
        const dataToSend = {
            ...formData,
            price: Number(formData.price),
            totalSlots: Number(formData.totalSlots),
            availableSlots: Number(formData.totalSlots) 
        };

        if (editingId) {
            await axios.put("/api/products", { ...dataToSend, id: editingId });
        } else {
            await axios.post("/api/products", dataToSend);
        }

        setEditingId(null);
        setFormData({ name: "", description: "", price: "", location: "", image: "", totalSlots: "", category: "Standard" });
        loadAllData();
        alert("SISTEMI U PËRDITËSUA ME SUKSES!");
    } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        alert("GABIM: " + errorMsg);
    }
  };

  const deleteItem = async (api, id) => {
    if (confirm("KONFIRMONI FSHIRJEN PERFUNDIMTARE?")) {
      await axios.delete(`${api}?id=${id}`);
      loadAllData();
    }
  };

  // --- FUNKSIONI I RI PER PROMOVIMIN E USERIT ---
  const promoteUser = async (id) => {
    try {
      await axios.put("/api/users/update", { id, role: "admin" });
      alert("PËRDORUESI U PROMOVUA NË ADMIN!");
      loadAllData(); // Rifreskon listën
      setSelectedUser(null); // Mbyll modalin
    } catch (error) {
      alert("GABIM GJATË PROMOVIMIT!");
    }
  };

  if (status === "loading") return <div className="py-40 text-center font-black text-2xl animate-pulse uppercase italic">Admin Hub Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-black uppercase text-black tracking-tighter">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-full md:w-80 bg-black text-white p-10 space-y-12 border-r-8 border-yellow-400 z-20">
        <div className="space-y-2">
            <h2 className="text-3xl italic tracking-tighter border-b-4 border-blue-600 pb-4 leading-none">Admin Hub</h2>
            <p className="text-[10px] text-blue-400 tracking-[0.3em] font-bold uppercase">Kontrolli i Sistemit</p>
        </div>
        <nav className="flex flex-col gap-4 text-xs tracking-widest">
          {[
            { id: "parking", label: "Parkingjet" },
            { id: "bookings", label: "Rezervimet" },
            { id: "vehicles", label: "Veturat" },
            { id: "users", label: "Klientët" },
            { id: "messages", label: "Inbox" }
          ].map(tab => (
            <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`text-left p-5 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? "bg-blue-600 shadow-xl shadow-blue-900 scale-105" : "hover:bg-white/5 opacity-50 hover:opacity-100"}`}
            >
                {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-8 md:p-16 overflow-y-auto">
        
        {/* TAB 1: PARKING MANAGEMENT */}
        {activeTab === "parking" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <h2 className="text-5xl italic border-l-[12px] border-blue-600 pl-8 leading-none tracking-tighter">Menaxhimi i Lokacioneve</h2>
            
            <form onSubmit={handleSaveParking} className="bg-white p-10 rounded-[3rem] shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 border-2 border-gray-100">
               <div className="md:col-span-2 flex justify-between items-center mb-4 border-b-2 border-gray-50 pb-4">
                    <h3 className="text-2xl text-blue-700 italic">{editingId ? "Edito Lokacionin" : "Shto Lokacion të Ri"}</h3> 
                    {editingId && <button onClick={()=>setEditingId(null)} className="bg-black text-white px-6 py-2 rounded-xl text-[10px]">ANULO</button>}
               </div>

               <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] tracking-widest ml-2">Foto e Lokacionit</label>
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="w-full h-48 border-4 border-dashed border-gray-100 rounded-3xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 transition-all overflow-hidden group"
                    >
                      {formData.image ? (
                        <div className="relative w-full h-full">
                           <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-black transition-opacity">NDRYSHO FOTON</div>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl text-gray-300 mb-2">+</div>
                          <p className="text-[9px] text-gray-400 tracking-[0.2em]">NGARKONI FOTON NGA MEDIA</p>
                        </>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
               </div>
               
               <div className="space-y-2">
                    <label className="text-[10px] tracking-widest ml-2">Titulli Zyrtar</label>
                    <input className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-black text-black outline-none focus:border-blue-600 focus:bg-white transition-all" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required />
               </div>
               
               <div className="space-y-2">
                    <label className="text-[10px] tracking-widest ml-2">Tarifa / Orë (€)</label>
                    <input type="number" step="0.01" className="w-full p-5 border-2 border-gray-100 rounded-2xl text-sm font-black text-black outline-none focus:border-blue-600" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} required />
               </div>

               <div className="space-y-2">
                    <label className="text-[10px] tracking-widest ml-2">Kategoria</label>
                    <input className="w-full p-5 border-2 border-gray-100 rounded-2xl text-sm font-black text-black outline-none focus:border-blue-600" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} required />
               </div>

               <div className="space-y-2">
                    <label className="text-[10px] tracking-widest ml-2">Numri i Vendeve</label>
                    <input type="number" className="w-full p-5 border-2 border-gray-100 rounded-2xl text-sm font-black text-black outline-none focus:border-blue-600" value={formData.totalSlots} onChange={e=>setFormData({...formData, totalSlots: e.target.value})} required />
               </div>

               <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] tracking-widest ml-2">Adresa e Plotë</label>
                    <input className="w-full p-5 border-2 border-gray-100 rounded-2xl text-sm font-black text-black outline-none focus:border-blue-600" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} required />
               </div>

               <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] tracking-widest ml-2">Përshkrimi i Lokacionit</label>
                    <textarea className="w-full p-5 border-2 border-gray-100 rounded-2xl text-sm font-black text-black outline-none focus:border-blue-600" rows="4" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} required />
               </div>

               <button className="md:col-span-2 bg-blue-700 text-white p-6 rounded-[2rem] hover:bg-black transition-all shadow-2xl text-lg tracking-widest">
                    {editingId ? "PERDITESO LOKACIONIN" : "PUBLIKO LOKACIONIN"}
               </button>
            </form>

            <div className="grid grid-cols-1 gap-6">
                {products.map(p => (
                    <div key={p._id} className="bg-white p-8 rounded-[2.5rem] flex justify-between items-center shadow-lg border border-gray-100 hover:border-blue-600 transition-all">
                        <div className="flex items-center gap-6">
                            <img src={p.image} className="w-24 h-24 rounded-3xl object-cover border-4 border-gray-50 shadow-md" alt="" />
                            <div>
                                <p className="text-2xl font-black italic leading-none mb-2">{p.name}</p>
                                <p className="text-xs text-blue-600 font-bold tracking-widest">{p.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-10">
                            <div className="text-center px-10 border-x border-gray-100">
                                <p className="text-[9px] text-gray-400 mb-1">KAPACITETI LIVE</p>
                                <p className="text-3xl font-black text-black">{p.availableSlots} / {p.totalSlots}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => {setEditingId(p._id); setFormData(p); window.scrollTo({top: 0, behavior: 'smooth'})}} className="bg-black text-white px-10 py-3 rounded-2xl text-[10px] hover:bg-blue-600 transition-all">EDITO</button>
                                <button onClick={() => deleteItem("/api/products", p._id)} className="bg-red-50 text-red-600 px-10 py-3 rounded-2xl text-[10px] hover:bg-red-600 hover:text-white transition-all">FSHIJ</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-5xl italic border-l-[12px] border-blue-600 pl-8 leading-none tracking-tighter uppercase">Të gjitha Rezervimet</h2>
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-2 border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-[14px] border-b-4 border-yellow-400">
                        <tr>
                            <th className="p-8">Klienti</th>
                            <th className="p-8">Parking</th>
                            <th className="p-8">Periudha</th>
                            <th className="p-8">Vetura</th>
                            <th className="p-8">Veprimet</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-black text-black">
                        {bookings.map(b => (
                            <tr key={b._id} className="border-t hover:bg-blue-50 transition-colors">
                                <td className="p-8">{b.userName}</td>
                                <td className="p-8 text-blue-700 italic">{b.parkingName}</td>
                                <td className="p-8">{formatDate(b.startDate)} <span className="opacity-40">|</span> {b.fromTime}-{b.toTime}</td>
                                <td className="p-8 tracking-widest">{b.plate}</td>
                                <td className="p-8"><button onClick={()=>deleteItem("/api/bookings", b._id)} className="text-red-600 hover:underline">FSHIJ</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}

        {/* TAB 3: VEHICLES */}
        {activeTab === "vehicles" && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-5xl italic border-l-[12px] border-blue-600 pl-8 leading-none tracking-tighter">Garazha Live</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-black">
                {vehicles.map(v => (
                    <div key={v._id} className="bg-white p-10 rounded-[3rem] shadow-xl border-t-[15px] border-black flex justify-between items-center hover:scale-[1.03] transition-all">
                        <div>
                            <p className="text-4xl italic tracking-tighter leading-none mb-2">{v.plate}</p>
                            <p className="text-xs text-blue-600 uppercase tracking-widest font-bold">MODELI: {v.model}</p>
                            <p className="text-[10px] text-gray-400 uppercase mt-1 tracking-widest italic">PRONARI: {v.ownerName}</p>
                        </div>
                        <button onClick={()=>deleteItem("/api/vehicles", v._id)} className="bg-red-50 text-red-600 p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all text-[10px]">LARGO</button>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: USERS */}
        {activeTab === "users" && (
          <div className="space-y-10 animate-in zoom-in-95 duration-500">
            <h2 className="text-5xl italic border-l-[12px] border-blue-600 pl-8 leading-none tracking-tighter uppercase">Regjistri i Klientëve</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map(u => (
                    <div key={u._id} className="bg-white p-8 rounded-[2.5rem] shadow-lg border-2 border-gray-100 flex flex-col gap-8 hover:border-blue-600 transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                {u.image ? <img src={u.image} className="w-12 h-12 rounded-2xl object-cover" /> : <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center font-black">{u.name.charAt(0)}</div>}
                                <div>
                                    <p className="text-xl leading-none font-black italic mb-1">{u.name}</p>
                                    <p className="text-[13px] text-gray-400 lowercase">{u.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setSelectedUser(u)} className="flex-1 bg-black text-white p-4 rounded-2xl text-[10px] hover:bg-blue-600 transition-all shadow-lg tracking-widest uppercase font-black">DETAJET</button>
                            {u.role !== 'admin' && <button onClick={()=>deleteItem("/api/users", u._id)} className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] hover:bg-red-600 hover:text-white transition-all">FSHI</button>}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: MESSAGES */}
        {activeTab === "messages" && (
            <div className="space-y-10 animate-in fade-in duration-500">
                <h2 className="text-5xl italic border-l-[12px] border-blue-600 pl-8 leading-none tracking-tighter uppercase"> Inbox</h2>
                <div className="space-y-6">
                    {messages.map(m => (
                        <div key={m._id} className="bg-white p-10 rounded-[3.5rem] shadow-2xl border-l-[20px] border-yellow-400 flex flex-col md:flex-row justify-between gap-10 hover:border-l-blue-600 transition-all">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="bg-black text-white text-[12px] px-6 py-1.5 rounded-full">{formatDate(m.createdAt)}</span>
                                    <p className="text-blue-700 font-black text-sm tracking-tight italic">{m.email}</p>
                                </div>
                                <h3 className="text-2xl font-black text-black leading-tight border-b-2 border-gray-50 pb-4">{m.subject}</h3>
                                <p className="text-xl text-black font-medium normal-case tracking-normal leading-relaxed italic">
                                    "{m.message}"
                                </p>
                            </div>
                            <button onClick={()=>deleteItem("/api/messages", m._id)} className="h-fit bg-red-50 text-red-600 px-10 py-5 rounded-2xl text-xs hover:bg-red-600 hover:text-white transition-all font-black uppercase tracking-widest">Arkivo</button>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>

      {/* USER DETAIL MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] max-w-2xl w-full overflow-hidden shadow-2xl border-4 border-blue-700 animate-in zoom-in-95 duration-300">
                <div className="bg-blue-700 p-12 text-white flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {selectedUser.image ? <img src={selectedUser.image} className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl object-cover" /> : <div className="w-24 h-24 bg-yellow-400 rounded-[2rem] border-4 border-white flex items-center justify-center text-4xl font-black text-blue-900 shadow-xl">{selectedUser.name.charAt(0)}</div>}
                        <div>
                            <h2 className="text-4xl font-black italic tracking-tighter leading-none">{selectedUser.name}</h2>
                            <p className="text-blue-200 font-bold text-sm tracking-widest mt-2 lowercase">{selectedUser.email}</p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="text-white hover:rotate-90 transition-all duration-500 text-3xl font-black">X</button>
                </div>
                <div className="p-12 space-y-10">
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-2 border-b-2 border-gray-50 pb-4"><p className="text-[10px] text-gray-400 tracking-widest">ID ZYRTARE</p><p className="text-lg font-black italic">#{selectedUser._id.toUpperCase()}</p></div>
                        <div className="space-y-2 border-b-2 border-gray-50 pb-4 text-right"><p className="text-[10px] text-gray-400 tracking-widest">ROLI AKTUAL</p><span className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-black">{selectedUser.role}</span></div>
                        <div className="space-y-2 border-b-2 border-gray-50 pb-4"><p className="text-[10px] text-gray-400 tracking-widest">TELEFONI</p><p className="text-lg font-black italic">{selectedUser.phone || "I PAPLOTESUAR"}</p></div>
                        <div className="space-y-2 border-b-2 border-gray-50 pb-4 text-right"><p className="text-[10px] text-gray-400 tracking-widest">ANËTARËSUAR</p><p className="text-lg font-black italic">{formatDate(selectedUser.createdAt)}</p></div>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-100">
                        <p className="text-[11px] font-black mb-4 tracking-widest text-center">MANIPULIMI I STATUSIT</p>
                        <div className="flex gap-4">
                            {/* LIDHJA ME FUNKSIONIN PROMOTEUSER */}
                            <button 
                                onClick={() => promoteUser(selectedUser._id)} 
                                className="flex-1 bg-blue-700 text-white py-4 rounded-2xl font-black text-xs hover:bg-black transition-all shadow-lg"
                            >
                                PROMOVONI NË ADMIN
                            </button>
                            <button onClick={() => setSelectedUser(null)} className="flex-1 bg-white text-black border-2 border-gray-200 py-4 rounded-2xl font-black text-xs hover:bg-gray-100 transition-all uppercase">Mbyll</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}