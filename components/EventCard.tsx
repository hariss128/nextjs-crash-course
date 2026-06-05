import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

const EventCard = ({ title, image, slug, time, date, location }: Props) => {
    return (
        <Link href={`/events/${slug}`} id="event-card">
            <Image src={image} alt={title} width={410} height={300} style={{ width: "auto", height: "auto" }} className="poster"/>
            <div className="flex flex-row w-100 gap-4">
                <Image src="/icons/pin.svg" alt="location" width={14} height={14} style={{ width: "auto", height: "auto" }}/>
                <p>{location}</p>
            </div>
            <p className="title">{title}</p>
            <div className="datetime">
                <div>
                    <Image src="/icons/calendar.svg" alt="date" width={14} height={14} style={{ width: "auto", height: "auto" }}/>
                        <p>{date}</p>
                </div>
                <div>
                    <Image src="/icons/calendar.svg" alt="time" width={14} height={14} style={{ width: "auto", height: "auto" }}/>
                        <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}
export default EventCard
