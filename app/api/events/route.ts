import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import { parseEventFormData } from '@/lib/parse-event-form';
import { isDuplicateKeyError } from '@/lib/booking-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ date: 1 }).lean();
        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: 'Failed to fetch events',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const contentType = req.headers.get('content-type') ?? '';
        if (!contentType.includes('multipart/form-data')) {
            return NextResponse.json(
                { message: 'Content-Type must be multipart/form-data' },
                { status: 400 }
            );
        }

        const formData = await req.formData();
        const event = parseEventFormData(formData);

        if (!event.title) {
            return NextResponse.json({ message: 'Title is required' }, { status: 400 });
        }

        const createdEvent = await Event.create(event);

        return NextResponse.json(
            { message: 'Event created successfully', event: createdEvent },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);

        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                { message: 'Validation failed', error: error.message },
                { status: 400 }
            );
        }

        if (isDuplicateKeyError(error)) {
            return NextResponse.json(
                {
                    message:
                        'An event with this title already exists. Use a different title or check GET /api/events.',
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                message: 'Event creation failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
