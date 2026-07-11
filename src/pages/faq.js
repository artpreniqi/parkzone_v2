export default function FAQ() {
  const faqs = [
    { q: "Si mund të bëj një rezervim?", a: "Zgjidhni parkingun në ballinë, caktoni datën dhe orën, dhe klikoni 'Rezervo Tani'." },
    { q: "A mund të anuloj rezervimin?", a: "Po, shkoni te Paneli i Kontrollit dhe klikoni butonin 'Liro' për rezervimin përkatës." },
    { q: "A janë parkingjet e sigurta?", a: "Po, të gjitha lokacionet tona monitorohen 24/7 me kamera dhe roje fizike." },
    { q: "Si bëhet pagesa?", a: "Pagesa bëhet direkt në lokacion ose përmes faturës që gjeneron sistemi ynë." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-black">
      <h1 className="text-6xl font-black uppercase tracking-tighter italic mb-4">Pyetjet e Shpeshta</h1>
      <div className="h-2 w-24 bg-blue-700 mb-16"></div>
      
      <div className="space-y-6">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border-2 border-gray-50 shadow-sm hover:border-blue-600 transition-all">
            <h3 className="text-lg font-black uppercase mb-3 text-blue-700 tracking-tight leading-none">{f.q}</h3>
            <p className="text-gray-400 font-bold text-sm uppercase leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}