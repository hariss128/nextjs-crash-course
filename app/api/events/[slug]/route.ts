import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';

export const dynamic = 'force-dynamic';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type RouteParams = {
    params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;

        if (!slug || typeof slug !== 'string' || !slug.trim()) {
            return NextResponse.json(
                { message: 'Slug parameter is required' },
                { status: 400 }
            );
        }

        const normalizedSlug = slug.trim().toLowerCase();

        if (!SLUG_PATTERN.test(normalizedSlug)) {
            return NextResponse.json(
                { message: 'Invalid slug format' },
                { status: 400 }
            );
        }

        await connectDB();

        const event = await Event.findOne({ slug: normalizedSlug }).lean();

        if (!event) {
            return NextResponse.json(
                { message: `Event with slug "${normalizedSlug}" not found` },
                { status: 404 }
            );
        }

        return NextResponse.json({ event }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: 'Failed to fetch event',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
