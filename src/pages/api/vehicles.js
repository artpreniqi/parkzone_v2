import dbConnect from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();
  
  // Mënyra e saktë për të marrë sesionin në API
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Duhet të kyçeni për këtë veprim!" });
  }

  if (req.method === "GET") {
    // Nëse është admin sheh gjithçka, nëse është user sheh vetëm të vetat
    const query = session.user.role === "admin" ? {} : { userId: session.user.id };
    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    return res.status(200).json(vehicles);
}

  if (req.method === "POST") {
    try {
      const { plate, model, ownerName } = req.body;
      const vehicle = await Vehicle.create({
        userId: session.user.id, // Përdorim ID-në nga sesioni i sigurt
        plate,
        model,
        ownerName
      });
      return res.status(201).json(vehicle);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    const { id, plate, model, ownerName } = req.body;
    const updated = await Vehicle.findByIdAndUpdate(id, { plate, model, ownerName }, { new: true });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await Vehicle.findByIdAndDelete(req.query.id);
    return res.status(200).json({ message: "U fshi!" });
  }
}