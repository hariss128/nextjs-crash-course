import Image from 'next/image';
import { notFound } from 'next/navigation';
import BookEvent from '@/components/BookEvent';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';

export const dynamic = 'force-dynamic';

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function EventPage({ params }: PageProps) {
    const { slug } = await params;

    await connectDB();
    const event = await Event.findOne({ slug: slug.toLowerCase() }).lean();

    if (!event) {
        notFound();
    }

    return (
        <section id="event">
            <div className="header">
                <h1 className="text-gradient">{event.title}</h1>
                <p>{event.description}</p>
                <div className="flex-row-gap-2 flex-wrap">
                    {event.tags.map((tag: string) => (
                        <span key={tag} className="pill">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="details">
                <div className="content">
                    <div className="wallpaper">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="wallpaper-image"
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            priority
                        />
                    </div>

                    <div className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{event.overview}</p>
                    </div>

                    <div className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <div className="flex-row-gap-2">
                            <Image src="/icons/pin.svg" alt="location" width={16} height={16} />
                            <p>
                                {event.venue}, {event.location}
                            </p>
                        </div>
                        <div className="flex-row-gap-2">
                            <Image src="/icons/clock.svg" alt="time" width={16} height={16} />
                            <p>
                                {event.date} at {event.time}
                            </p>
                        </div>
                        <div className="flex-row-gap-2">
                            <Image src="/icons/mode.svg" alt="mode" width={16} height={16} />
                            <p className="capitalize">{event.mode}</p>
                        </div>
                        <div className="flex-row-gap-2">
                            <Image src="/icons/audience.svg" alt="audience" width={16} height={16} />
                            <p>{event.audience}</p>
                        </div>
                    </div>

                    <div className="agenda">
                        <h2>Agenda</h2>
                        <ul>
                            {event.agenda.map((item: string) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{event.organizer}</p>
                    </div>
                </div>

                <div className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        <p>Reserve your seat for {event.title}</p>
                        <BookEvent eventId={String(event._id)} />
                    </div>
                </div>
            </div>
        </section>
    );
}
