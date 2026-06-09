'use client';

import { FormEvent, useState } from 'react';
import {
    getErrorMessage,
    useCreateBookingMutation,
    useLazyGetEventBySlugQuery,
} from '@/store/eventsApi';

type Props = {
    eventId?: string;
    slugInput?: boolean;
};

const BookEvent = ({ eventId, slugInput = false }: Props) => {
    const [email, setEmail] = useState('');
    const [eventSlug, setEventSlug] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const [createBooking, { isLoading }] = useCreateBookingMutation();
    const [fetchEvent] = useLazyGetEventBySlugQuery();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        try {
            let id = eventId;

            if (!id && slugInput) {
                const slug = eventSlug.trim().toLowerCase().replace(/\s+/g, '-');
                const data = await fetchEvent(slug).unwrap();
                id = data.event._id;
            }

            if (!id) {
                setMessage('Event is required.');
                setIsError(true);
                return;
            }

            await createBooking({ eventId: id, email: email.trim() }).unwrap();

            setMessage('Event has been booked!');
            setIsError(false);
            setEmail('');
            setEventSlug('');
        } catch (error) {
            setMessage(getErrorMessage(error));
            setIsError(true);
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
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Booking...' : 'Book Event'}
                </button>
                <button type="button" onClick={handleClear}>
                    Clear
                </button>
            </form>
        </div>
    );
};

export default BookEvent;
