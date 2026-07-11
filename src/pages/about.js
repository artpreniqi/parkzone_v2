export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8">Rreth ParkZone</h1>
      <div className="prose prose-lg text-gray-600">
        <p className="mb-6">
          ParkZone është një platformë inovative e krijuar për të zgjidhur problemin e parkingut në qytetet e mbingarkuara. 
          Misioni ynë është të lidhim pronarët e vendeve të parkingut me shoferët që kanë nevojë për një vend të sigurt dhe të shpejtë.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Siguria</h3>
            <p>Të gjitha lokacionet tona janë të monitoruara 24/7 me kamera dhe roje fizike.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Shpejtësia</h3>
            <p>Rezervoni vendin tuaj në më pak se 60 sekonda përmes aplikacionit tonë.</p>
          </div>
        </div>
      </div>
    </div>
  );
}