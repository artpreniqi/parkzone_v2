import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ message: "Metoda nuk lejohet" });

  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Duhet të kyçeni!" });

  try {
    const { name, email, phone, image } = req.body;

    // Përditësojmë përdoruesin në MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { name, email, phone, image },
      { new: true } // Kthe përdoruesin e përditësuar
    );

    res.status(200).json({ message: "Profili u përditësua me sukses!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}