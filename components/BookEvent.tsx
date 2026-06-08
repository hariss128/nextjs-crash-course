'use client';

import { FormEvent, useState } from 'react';

type Props = {
    eventId?: string;
    slugInput?: boolean;
};

const BookEvent = ({ eventId, slugInput = false }: Props) => {
    const [email, setEmail] = useState('');
    const [eventSlug, setEventSlug] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            let id = eventId;

            if (!id && slugInput) {
                const slug = eventSlug.trim().toLowerCase().replace(/\s+/g, '-');
                const eventRes = await fetch(`/api/events/${slug}`);

                if (!eventRes.ok) {
                    setMessage('Event not found. Try the event slug (e.g. cloud-next-2026).');
                    setIsError(true);
                    return;
                }

                const data = await eventRes.json();
                id = data.event._id;
            }

            if (!id) {
                setMessage('Event is required.');
                setIsError(true);
                return;
            }

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: id, email: email.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message ?? 'Booking failed.');
                setIsError(true);
                return;
            }

            setMessage('Event has been booked!');
            setIsError(false);
            setEmail('');
            setEventSlug('');
        } catch {
            setMessage('Something went wrong. Please try again.');
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClear = () => {
        setEmail('');
        setEventSlug('');
        setMessage('');
        setIsError(false);
    };

    return (
        <div id="book-event">
            {message && (
                <p className={`text-sm ${isError ? 'text-red-400' : 'text-primary'}`}>{message}</p>
            )}
            <form onSubmit={handleSubmit}>
                {slugInput && (
                    <div>
                        <label htmlFor="event-slug">Which event do you want to book?</label>
                        <input
                            id="event-slug"
                            type="text"
                            placeholder="e.g. cloud-next-2026"
                            value={eventSlug}
                            onChange={(e) => setEventSlug(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Booking...' : 'Book Event'}
                </button>
                <button type="button" onClick={handleClear}>
                    Clear
                </button>
            </form>
        </div>
    );
};

export default BookEvent;
