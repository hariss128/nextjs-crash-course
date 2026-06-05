import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";

export async function POST(req: Request) {
    await connectDB();

    const body = await req.json();

    const booking = await Booking.create(body);

    return Response.json(booking);
}