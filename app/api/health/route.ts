import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import { getMongoUri } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET() {
    const uri = getMongoUri();

    if (!uri) {
        return NextResponse.json(
            {
                ok: false,
                error: 'MONGODB_URI is not set on this deployment',
                hint: 'Vercel → Settings → Environment Variables → MONGODB_URI → check Production → Redeploy (required after adding env vars)',
            },
            { status: 500 }
        );
    }

    try {
        await connectDB();
        const eventCount = await Event.countDocuments();

        return NextResponse.json({
            ok: true,
            database: getDatabaseName(uri),
            eventCount,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                ok: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                hint: 'Check Atlas Network Access (0.0.0.0/0) and connection string format: ...mongodb.net/devevent?retryWrites=true&w=majority',
            },
            { status: 500 }
        );
    }
}

function getDatabaseName(uri: string): string {
    const path = uri.split('?')[0].split('/').pop();
    return path && path.length > 0 ? path : 'test (default)';
}
