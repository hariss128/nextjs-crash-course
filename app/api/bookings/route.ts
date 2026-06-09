import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Booking from '@/database/booking.model';
import { isDuplicateKeyError } from '@/lib/booking-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { eventId, email } = body as { eventId?: string; email?: string };

        if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
            return NextResponse.json({ message: 'Valid event ID is required' }, { status: 400 });
        }

        if (!email || typeof email !== 'string' || !email.trim()) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingBooking = await Booking.findOne({ eventId, email: normalizedEmail });

        if (existingBooking) {
            return NextResponse.json(
                { message: 'You have already booked this event' },
                { status: 409 }
            );
        }

        const booking = await Booking.create({ eventId, email: normalizedEmail });

        return NextResponse.json(
            { message: 'Booking created successfully', booking },
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
                { message: 'You have already booked this event' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                message: 'Booking failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}