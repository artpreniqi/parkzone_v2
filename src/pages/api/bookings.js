import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Pa autorizim" });

    const { parkingId, startDate, endDate, fromTime, toTime, ...rest } = req.body;
    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      const parking = await Product.findById(parkingId).session(dbSession);
      if (!parking) throw new Error("NOT_FOUND");

      // Numëro rezervimet ekzistuese që përputhen (overlap) me datat e kërkuara
      const overlappingBookings = await Booking.find({
        parkingId,
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) },
      }).session(dbSession);

      // Kontroll shtesë për orët nëse data është e njëjtë (opsionale por më e saktë)
      const conflictCount = overlappingBookings.length;

      if (conflictCount >= parking.totalSlots) {
        throw new Error("FULL");
      }

      const booking = await Booking.create([{
        ...rest,
        parkingId,
        startDate,
        endDate,
        fromTime,
        toTime,
        userId: session.user.id,
        userName: session.user.name,
      }], { session: dbSession });

      await dbSession.commitTransaction();
      res.status(201).json(booking[0]);
    } catch (error) {
      await dbSession.abortTransaction();
      if (error.message === "FULL") {
        return res.status(400).json({ message: "Më falni, ky parking është plot për periudhën e zgjedhur!" });
      }
      res.status(500).json({ error: error.message });
    } finally {
      dbSession.endSession();
    }
  }

  if (req.method === "DELETE") {
    try {
      await Booking.findByIdAndDelete(req.query.id);
      res.status(200).json({ message: "Rezervimi u fshi!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Pa autorizim" });
    const query = session.user.role === "admin" ? {} : { userId: session.user.id };
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  }
}