import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Pa autorizim" });
  }

  if (req.method === "GET") {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  }

  if (req.method === "DELETE") {
    await Message.findByIdAndDelete(req.query.id);
    res.status(200).json({ message: "Mesazhi u fshi" });
  }
}   