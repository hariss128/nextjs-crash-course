import connectDB  from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(req: Request) {
    await connectDB();

    const body = await req.json();

    const event = await Event.create(body);

    return Response.json(event);
}

export async function GET() {
    await connectDB();

    const events = await Event.find().sort({ date: 1 });

    return Response.json(events);
}