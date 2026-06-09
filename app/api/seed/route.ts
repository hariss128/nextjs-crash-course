import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import { getSeedEvents } from '@/lib/seed-events';

export async function POST() {
    try {
        await connectDB();

        const slugs: string[] = [];

        for (const data of getSeedEvents()) {
            await Event.findOneAndUpdate({ slug: data.slug }, data, {
                upsert: true,
                new: true,
                runValidators: true,
            });
            slugs.push(data.slug);
        }

        return NextResponse.json({
            message: 'Seeded featured events from constants',
            count: slugs.length,
            slugs,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: 'Seed failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
