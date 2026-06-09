'use client';

import BookEvent from '@/components/BookEvent';

const CreateEventPanel = () => {
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

                        <BookEvent slugInput />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateEventPanel;
