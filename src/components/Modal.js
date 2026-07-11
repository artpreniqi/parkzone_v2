const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl border-4 border-blue-700 animate-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-4 italic">
          {title}
        </h2>
        <p className="text-gray-500 font-bold text-sm uppercase leading-relaxed mb-10">
          {message}
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-lg shadow-red-100"
          >
            Konfirmo
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-100 text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
          >
            Anulo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;