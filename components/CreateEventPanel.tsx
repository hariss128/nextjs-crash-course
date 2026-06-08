'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';

const WALLPAPER =
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=2340';

const CreateEventPanel = () => {
    const [eventName, setEventName] = useState('');
    const [email, setEmail] = useState('');
    const [booked, setBooked] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBooked(true);
    };

    const handleClear = () => {
        setEventName('');
        setEmail('');
        setBooked(false);
    };

    return (
        <section
            id="create-event"
            className="flex w-full flex-1 items-center justify-center"
        >
            <div className="details mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-10 px-5 sm:gap-12 lg:flex-row lg:items-center">
                <div className="input w-full lg:flex-1">
                    <h1 className="text-center">
                        The Hub for Every Dev <br /> Event You Can&apos;t Miss!
                    </h1>
                    <p className="text-center mt-5">
                        Hackathons, Meetups, Conferences, All in One Place
                    </p>
                </div>

                <div className="booking w-full lg:flex-1 lg:max-w-md">
                    <div className="flex w-full flex-col gap-6 rounded-[10px] border border-dark-200 bg-dark-100 px-5 py-6 shadow-[0px_4px_40px_0px_#00000066]">
                        <h2 className="text-2xl font-bold text-white">Book Your Spot</h2>
                        <p className="text-sm text-light-200">Find the event you want to attend</p>

                        <div id="book-event">
                            {booked && (
                                <p className="text-sm text-primary">Event has been booked!</p>
                            )}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="event-name" className="text-sm text-light-100">
                                        Which event do you want to book?
                                    </label>
                                    <input
                                        id="event-name"
                                        type="text"
                                        placeholder="Enter event name"
                                        value={eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                        className="rounded-[6px] bg-dark-200 px-5 py-2.5 text-white outline-none"
                                    />
                                </div>
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
                                        className="rounded-[6px] bg-dark-200 px-5 py-2.5 text-white outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full cursor-pointer rounded-[6px] bg-primary px-4 py-2.5 text-lg font-semibold text-black hover:bg-primary/90"
                                >
                                    Book Event
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
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateEventPanel;
