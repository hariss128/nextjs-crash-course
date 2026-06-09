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
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {slugInput && (
                    <div className="flex flex-col gap-2">
                        <label htmlFor="event-slug" className="text-sm text-light-100">
                            Which event do you want to book?
                        </label>
                        <input
                            id="event-slug"
                            type="text"
                            placeholder="e.g. react-summit-us-2025"
                            value={eventSlug}
                            onChange={(e) => setEventSlug(e.target.value)}
                            required
                            className="rounded-[6px] bg-dark-200 px-5 py-2.5 text-white outline-none"
                        />
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm text-light-100">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-[6px] bg-dark-200 px-5 py-2.5 text-white outline-none"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer rounded-[6px] bg-primary px-4 py-2.5 text-lg font-semibold text-black hover:bg-primary/90 disabled:opacity-70"
                >
                    {isLoading ? 'Booking...' : 'Book Event'}
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="w-full cursor-pointer rounded-[6px] border border-dark-200 bg-dark-200 px-4 py-2.5 text-lg font-semibold text-light-100 hover:bg-dark-200/80"
                >
                    Clear
                </button>
            </form>
        </div>
    );
};

export default BookEvent;
