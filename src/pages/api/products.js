import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  // Kontrolli i sigurisë për Admin
  if (req.method !== "GET") {
    if (!session || session.user.role !== "admin") {
      return res.status(403).json({ message: "Nuk keni qasje!" });
    }
  }

  if (req.method === "GET") {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (error) { res.status(400).json({ error: error.message }); }
  }

  if (req.method === "PUT") {
    try {
      const { id, ...updateData } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      res.status(200).json(updatedProduct);
    } catch (error) { res.status(400).json({ error: error.message }); }
  }

  if (req.method === "DELETE") {
    try {
      await Product.findByIdAndDelete(req.query.id);
      res.status(200).json({ message: "U fshi!" });
    } catch (error) { res.status(500).json({ error: error.message }); }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', 
    },
  },
};