import dbConnect from "../../lib/mongodb";
import Product from "../../models/Product";

export default async function handler(req, res) {
  try {
    await dbConnect();

    // Pastrojmë databazën që mos të kemi duplikate
    await Product.deleteMany({});


    const sampleProducts = [
      {
        name: "Parking Prishtina Center",
        description: "Vendi më i sigurt në qendër të qytetit, monitorim 24/7.",
        price: 1.50,
        location: "Qendër, Prishtinë",
        image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1000&auto=format&fit=crop",
        category: "VIP"
      },
      {
        name: "Dardania Spot A1",
        description: "Parking i hapur me qasje të lehtë në rrugën kryesore.",
        price: 0.80,
        location: "Dardani, Prishtinë",
        image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=1000&auto=format&fit=crop",
        category: "Standard"
      },
      {
        name: "Ulpiana Underground",
        description: "Parking nëntokësor, i mbrojtur nga të gjitha kushtet atmosferike.",
        price: 1.20,
        location: "Ulpianë, Prishtinë",
        image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=1000&auto=format&fit=crop",
        category: "Standard"
      }
    ];

    await Product.insertMany(sampleProducts);

    res.status(200).json({ message: "Databaza u mbush me sukses!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}