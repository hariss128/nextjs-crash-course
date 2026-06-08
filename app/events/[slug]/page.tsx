import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import Booking from '@/database/booking.model';

type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ booked?: string }>;
};

async function bookEvent(eventId: string, slug: string, formData: FormData) {
    'use server';

    const email = formData.get('email');

    if (!email || typeof email !== 'string' || !email.trim()) {
        redirect(`/events/${slug}?error=email`);
    }

    await connectDB();
    await Booking.create({ eventId, email: email.trim() });
    redirect(`/events/${slug}?booked=true`);
}

export default async function EventPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { booked, error } = await searchParams;

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
                    {event.tags.map((tag) => (
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
                            {event.agenda.map((item) => (
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
                        <div id="book-event">
                            {booked && <p className="text-sm text-primary">You are booked! Check your email for confirmation.</p>}
                            {error && <p className="text-sm text-red-400">Please enter a valid email.</p>}
                            <form action={bookEvent.bind(null, String(event._id), slug)}>
                                <div>
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <button type="submit">Book Event</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
