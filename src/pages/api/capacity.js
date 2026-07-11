import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Product from "@/models/Product";

export default async function handler(req, res) {
  try {
    await dbConnect();
    const now = new Date();

    const products = await Product.find({});
    const bookings = await Booking.find({});
    const capacityMap = {};

    for (const p of products) {
      const pId = p._id.toString();

      const occupiedCount = bookings.filter(b => {
        if (b.parkingId.toString() !== pId) return false;

        const [fh, fm] = b.fromTime.split(":").map(Number);
        const start = new Date(b.startDate);
        start.setHours(fh, fm, 0, 0); // lokale, jo UTC

        const [th, tm] = b.toTime.split(":").map(Number);
        const end = new Date(b.endDate);
        end.setHours(th, tm, 0, 0); // lokale, jo UTC

        return now >= start && now <= end;
      }).length;

      const liveAvailable = Math.max(0, p.totalSlots - occupiedCount);

      await Product.findByIdAndUpdate(pId, { availableSlots: liveAvailable });

      capacityMap[pId] = liveAvailable;
    }

    res.status(200).json(capacityMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}