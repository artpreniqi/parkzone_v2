import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Qasje e ndaluar" });
  }

  if (req.method === "GET") {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  }

  if (req.method === "DELETE") {
    await User.findByIdAndDelete(req.query.id);
    res.status(200).json({ message: "Përdoruesi u fshi" });
  }
}