import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plate: { type: String, required: true },
  model: { type: String, required: true },
  ownerName: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);