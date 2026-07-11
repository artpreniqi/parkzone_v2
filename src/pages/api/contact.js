import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metoda nuk lejohet" });
  }

  try {
    await dbConnect();
    const { name, email, subject, message } = req.body;

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({ message: "Mesazhi u dërgua me sukses!", data: newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}