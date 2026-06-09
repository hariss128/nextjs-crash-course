import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type EventResponse = {
    event: {
        _id: string;
        title: string;
        slug: string;
    };
};

type BookingBody = {
    eventId: string;
    email: string;
};

type BookingResponse = {
    message: string;
    booking: unknown;
};

type ApiError = {
    message?: string;
};

export const eventsApi = createApi({
    reducerPath: 'eventsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Event', 'Booking'],
    endpoints: (builder) => ({
        getEvents: builder.query<EventResponse['event'][], void>({
            query: () => '/events',
            transformResponse: (response: { events: EventResponse['event'][] }) => response.events,
            providesTags: ['Event'],
        }),
        getEventBySlug: builder.query<EventResponse, string>({
            query: (slug) => `/events/${slug}`,
            providesTags: (_result, _err, slug) => [{ type: 'Event', id: slug }],
        }),
        createBooking: builder.mutation<BookingResponse, BookingBody>({
            query: (body) => ({
                url: '/bookings',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Booking'],
        }),
    }),
});

export const {
    useGetEventsQuery,
    useGetEventBySlugQuery,
    useLazyGetEventBySlugQuery,
    useCreateBookingMutation,
} = eventsApi;

export function getErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'status' in error && error.status === 409) {
        return 'You have already booked this event';
    }

    if (
        error &&
        typeof error === 'object' &&
        'data' in error &&
        error.data &&
        typeof error.data === 'object' &&
        'message' in error.data
    ) {
        return String((error.data as ApiError).message);
    }

    return 'Something went wrong. Please try again.';
}
