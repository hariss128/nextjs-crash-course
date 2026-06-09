import { events, type EventItem } from '@/lib/constants';

export function toFullEvent(item: EventItem) {
    const city = item.location.split(',')[0]?.trim() ?? item.location;

    return {
        title: item.title,
        slug: item.slug,
        description: `${item.title} brings developers together for talks, workshops, and networking.`,
        overview: `Join us in ${item.location} for ${item.title}. Learn from industry leaders and connect with the community.`,
        image: item.image,
        venue: `${city} Convention Center`,
        location: item.location,
        date: item.date,
        time: item.time,
        mode: 'hybrid',
        audience: 'Developers, engineers, and tech leaders',
        agenda: [
            `${item.time} - Registration & Welcome`,
            '10:00 AM - Keynote & Main Sessions',
            '02:00 PM - Workshops & Networking',
        ],
        organizer: `${item.title} is organized by the global React community.`,
        tags: ['React', 'JavaScript', 'Frontend'],
    };
}

export function getSeedEvents() {
    return events.map(toFullEvent);
}
