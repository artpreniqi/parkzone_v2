import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Modal from "@/components/Modal"; 

export default function MyVehicles() {
  const { data: session } = useSession();
  const [vehicles, setVehicles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ plate: "", model: "", ownerName: "" });
  
  // State për Modal-in
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  useEffect(() => {
    if (session) fetchVehicles();
  }, [session]);

  const fetchVehicles = async () => {
    const res = await axios.get("/api/vehicles");
    setVehicles(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put("/api/vehicles", { ...formData, id: editingId });
        setEditingId(null);
      } else {
        await axios.post("/api/vehicles", formData);
      }
      setFormData({ plate: "", model: "", ownerName: "" });
      fetchVehicles();
      alert("Operacioni u krye me sukses!");
    } catch (err) {
      alert("Gabim!");
    }
  };

  // Hapja e Modal-it në vend të confirm()
  const openDeleteModal = (id) => {
    setVehicleToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/vehicles?id=${vehicleToDelete}`);
      fetchVehicles();
      setIsModalOpen(false);
    } catch (err) {
      alert("Gabim gjatë fshirjes!");
    }
  };

  if (!session) return <p className="text-center py-20 font-black uppercase">Ju lutem kyçuni...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-black font-black uppercase">
      
      {/* KOMPONENTI MODAL (Pika 2) */}
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Fshirja e Mjetit"
        message="A jeni i sigurt që dëshironi ta fshini këtë veturë nga garazha juaj? Ky veprim nuk mund të kthehet mbrapsht."
      />

      <h1 className="text-4xl mb-10 tracking-tighter italic">Garazha Ime</h1>

      {/* FORMA E SHTIMIT / EDITIMIT */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-2 border-blue-50 mb-12">
        <h2 className="text-lg text-blue-700 mb-6 tracking-widest italic">
          {editingId ? "Modifiko Veturën" : "Shto Veturë të Re"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input 
            placeholder="TARGAT" 
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black focus:border-blue-500 outline-none uppercase"
            value={formData.plate}
            onChange={(e) => setFormData({...formData, plate: e.target.value})}
            required
          />
          <input 
            placeholder="MODELI" 
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black focus:border-blue-500 outline-none"
            value={formData.model}
            onChange={(e) => setFormData({...formData, model: e.target.value})}
            required
          />
          <input 
            placeholder="PRONARI" 
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black focus:border-blue-500 outline-none"
            value={formData.ownerName}
            onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
            required
          />
          <button className={`md:col-span-3 p-5 rounded-2xl transition shadow-lg ${editingId ? 'bg-yellow-400 text-blue-900' : 'bg-blue-700 text-white hover:bg-black'}`}>
            {editingId ? "Ruaj Ndryshimet" : "Regjistro Veturën"}
          </button>
        </form>
      </div>

      {/* LISTA E VETURAVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((v) => (
          <div key={v._id} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50 flex justify-between items-center hover:border-blue-500 transition">
            <div>
              <p className="text-[10px] text-blue-600 tracking-widest mb-1">Targat Zyrtare</p>
              <h3 className="text-3xl mb-2">{v.plate}</h3>
              <p className="text-sm text-gray-400">{v.model} — {v.ownerName}</p>
              
              <div className="flex gap-4 mt-6">
                <button onClick={() => { setEditingId(v._id); setFormData({ plate: v.plate, model: v.model, ownerName: v.ownerName }); }} className="text-[10px] text-blue-700 hover:underline italic">Edito</button>
                {/* 4. Thërrasim Modal-in */}
                <button onClick={() => openDeleteModal(v._id)} className="text-[10px] text-red-500 hover:underline italic">Fshij</button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl text-gray-200">
               <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}