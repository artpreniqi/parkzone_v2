import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Pa autorizim" });

  try {
    // Kërkojmë përdoruesin direkt në DB përmes ID-së së sesionit
    const user = await User.findById(session.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}