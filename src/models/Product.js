import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  totalSlots: { type: Number, required: true, default: 20 },
  availableSlots: { type: Number, required: true, default: 20 },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);