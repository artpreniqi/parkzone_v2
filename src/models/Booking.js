import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  parkingName: { type: String, required: true },
  parkingId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  plate: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  fromTime: { type: String, required: true },
  toTime: { type: String, required: true },
  type: { type: String, default: "Vizitor" },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "I Konfirmuar" }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);