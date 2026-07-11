import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Pa autorizim" });
  }

  try {
    const { id, role } = req.body;
    await User.findByIdAndUpdate(id, { role });
    res.status(200).json({ message: "Roli u përditësua" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}