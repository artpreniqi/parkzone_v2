import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await dbConnect();
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Ky email ekziston!" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, role: "user" });

    res.status(201).json({ message: "Përdoruesi u krijua!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}