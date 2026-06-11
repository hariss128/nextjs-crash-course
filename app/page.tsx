import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { events as fallbackEvents } from "@/lib/constants";

export const dynamic = 'force-dynamic';

export default async function Home() {
    let events = fallbackEvents;

    try {
        await connectDB();
        const dbEvents = await Event.find().sort({ date: 1 }).lean();

        if (dbEvents.length > 0) {
            events = dbEvents.map((event) => ({
                image: event.image,
                title: event.title,
                slug: event.slug,
                location: event.location,
                date: event.date,
                time: event.time,
            }));
        }
    } catch (error) {
        console.error('Failed to load events from database:', error);
    }

    return (
        <section>
            <h1 className="text-center">
                The Hub for Every Dev <br /> Event You Can&apos;t Miss!
            </h1>
            <p className="text-center mt-5">Hackathons, Meetups, Conferences, All in One Place</p>
            <ExploreBtn />

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>
                <div className="events" id="events">
                    {events.map((event) => (
                        <div key={event.slug}>
                            <EventCard {...event} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
