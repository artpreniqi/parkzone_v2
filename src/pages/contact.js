import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

export default function Contact() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/contact", data);
      if (res.status === 201) {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      alert("Ndodhi një gabim gjatë dërgimit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-[3rem] border border-gray-100 overflow-hidden font-black">
        
        {/* Header-i i Formës */}
        <div className="bg-blue-700 py-10 text-center px-6 border-b-8 border-yellow-400">
          <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">
            Na <span className="text-yellow-400">Kontaktoni</span>
          </h2>
          <p className="text-blue-100 text-[10px] mt-2 font-black uppercase tracking-[0.3em] opacity-90">
            Qendra e Mbështetjes dhe Informimit
          </p>
        </div>

        <div className="p-8 md:p-12">
          {success && (
            <div className="mb-8 bg-green-600 p-5 rounded-2xl text-white font-black uppercase text-xs text-center animate-bounce shadow-xl">
              ✓ Mesazhi u ruajt me sukses në sistem!
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emri */}
              <div className="space-y-2">
                <label className="block text-[11px] text-black uppercase tracking-widest ml-2">Emri i Plotë</label>
                <input
                  {...register("name", { required: "Emri është i detyrueshëm" })}
                  placeholder="Emri dhe mbiemri juaj"
                  className={`w-full p-4 bg-gray-50 border-2 rounded-2xl text-black font-black text-sm outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-100 focus:border-blue-600 focus:bg-white'}`}
                />
                {errors.name && <p className="text-red-500 text-[9px] font-black uppercase ml-2">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[11px] text-black uppercase tracking-widest ml-2">Email Adresa</label>
                <input
                  {...register("email", { 
                    required: "Email-i është i detyrueshëm",
                    pattern: { value: /^\S+@\S+$/i, message: "Email-i nuk është valid" }
                  })}
                  placeholder="EMAIL@SHEMBULL.COM"
                  className={`w-full p-4 bg-gray-50 border-2 rounded-2xl text-black font-black text-sm outline-none transition-all uppercase ${errors.email ? 'border-red-500' : 'border-gray-100 focus:border-blue-600 focus:bg-white'}`}
                />
                {errors.email && <p className="text-red-500 text-[9px] font-black uppercase ml-2">{errors.email.message}</p>}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="block text-[11px] text-black uppercase tracking-widest ml-2">Subjekti i Mesazhit</label>
              <input
                {...register("subject", { required: "Ju lutem shënoni subjektin" })}
                placeholder="Pyetje rreth shërbimeve ose rezervimeve"
                className={`w-full p-4 bg-gray-50 border-2 rounded-2xl text-black font-black text-sm outline-none transition-all ${errors.subject ? 'border-red-500' : 'border-gray-100 focus:border-blue-600 focus:bg-white'}`}
              />
              {errors.subject && <p className="text-red-500 text-[9px] font-black uppercase ml-2">{errors.subject.message}</p>}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-[11px] text-black uppercase tracking-widest ml-2">Përmbajtja e Mesazhit</label>
              <textarea
                {...register("message", { 
                  required: "Mesazhi nuk mund të jetë i zbrazët",
                  minLength: { value: 10, message: "Së paku 10 karaktere" }
                })}
                rows="5"
                placeholder="Shkruani detajet këtu..."
                className={`w-full p-4 bg-gray-50 border-2 rounded-2xl text-black font-black text-sm outline-none transition-all ${errors.message ? 'border-red-500' : 'border-gray-100 focus:border-blue-600 focus:bg-white'}`}
              ></textarea>
              {errors.message && <p className="text-red-500 text-[9px] font-black uppercase ml-2">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-2xl active:scale-95 border-b-4 border-yellow-400"
            >
              {loading ? "DUKE U DËRGUAR..." : "DËRGO MESAZHIN TANI"}
            </button>
          </form>

          {/* Footer i brendshëm i formës */}
          <div className="mt-12 pt-8 border-t-2 border-gray-50 grid grid-cols-2 gap-6 text-center md:text-left">
            <div>
              <h4 className="text-[9px] text-gray-400 uppercase tracking-widest">Email Zyrtar</h4>
              <p className="text-xs text-black mt-1">INFO@PARKZONE.COM</p>
            </div>
            <div>
              <h4 className="text-[9px] text-gray-400 uppercase tracking-widest">Selia</h4>
              <p className="text-xs text-black mt-1">PRISHTINË, KOSOVË</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}