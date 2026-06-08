import Image from "next/image";
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/constants"

export default function Home() {
  return (
    <section>
        <h1 className="text-center">The Hub for Every Dev <br/> Event You Can't Miss!</h1>
        <p className="text-center mt-5">Hackathons, Meetups, Conferences, All in One Place</p>
        <ExploreBtn />

        <div className="mt-20 space-y-7">
            <h3>Featured Events</h3>
            <div className="events" id="events">
                {events.map((event) => (
                    <div key={event.title}>
                        <EventCard {...event} />
                    </div>
                ))}

            </div>
        </div>
    </section>
  );
}
