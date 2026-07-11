export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-black font-black uppercase tracking-tighter">
      <h1 className="text-6xl italic mb-4 border-b-8 border-yellow-400 w-fit">Kushtet e Përdorimit</h1>
      <p className="text-gray-400 text-xs mt-4 mb-16 tracking-[0.3em]">Versioni 1.0 — ParkZone System</p>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl text-blue-700 mb-4 italic">1. Rregullat e Rezervimit</h2>
          <p className="text-sm leading-relaxed opacity-70">
            Përdoruesi obligohet që të respektojë orarin e hyrjes dhe daljes saktësisht siç është specifikuar në faturën e rezervimit. Çdo vonesë mund të rezultojë në gjoba shtesë nga operatori i parkingut.
          </p>
        </section>

        <section>
          <h2 className="text-2xl text-blue-700 mb-4 italic">2. Përgjegjësia</h2>
          <p className="text-sm leading-relaxed opacity-70">
            ParkZone nuk mban përgjegjësi për dëmtimet e mundshme të mjeteve brenda lokacioneve të parkingut. Siguria e mjetit mbetet në përgjegjësinë e pronarit të parkingut dhe monitorimit 24/7.
          </p>
        </section>

        <section>
          <h2 className="text-2xl text-blue-700 mb-4 italic">3. Privatësia e të Dhënave</h2>
          <p className="text-sm leading-relaxed opacity-70">
            Të dhënat tuaja personale, numri i telefonit dhe targat e veturës përdoren vetëm për qëllime të identifikimit dhe sigurisë brenda rrjetit ParkZone.
          </p>
        </section>
      </div>
      
      <div className="mt-20 p-10 bg-gray-50 rounded-[3rem] border-2 border-gray-100 text-center text-[10px] text-gray-300">
        © {new Date().getFullYear()} ParkZone - Të gjitha të drejtat janë të mbrojtura ligjërisht.
      </div>
    </div>
  );
}