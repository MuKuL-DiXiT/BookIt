'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBookingByReference } from '@/lib/api';
import { Booking } from '@/types';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { format } from 'date-fns';

function ResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const reference = searchParams.get('reference');
        if (!reference) {
            setError(true);
            setLoading(false);
            return;
        }

        fetchBooking(reference);
    }, [searchParams]);

    const fetchBooking = async (reference: string) => {
        try {
            setLoading(true);
            const response = await getBookingByReference(reference);
            setBooking(response.data);
        } catch (error) {
            console.error('Error fetching booking:', error);
            setError(true);
            toast.error('Failed to load booking details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                                <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="mb-4 text-3xl font-bold text-gray-900">
                            Booking Not Found
                        </h1>
                        <p className="mb-8 text-lg text-gray-600">
                            We couldn't find the booking you're looking for. Please check your booking reference or contact support.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="rounded-full bg-orange-500 px-8 py-3 font-semibold text-white transition-all hover:bg-orange-600"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-48">
            <div className="mb-8 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-600">
                        <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h1 className="mb-4 text-4xl font-semibold text-gray-900">
                    Booking Confirmed
                </h1>
                <h1 className='text-gray-500'>Ref Id: {booking.bookingReference}</h1>
                <Link href="/"><button className='bg-gray-200 text-black px-4 py-2'>Back to Home</button></Link>
            </div>
        </div>
    );
}

export default function Result() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ResultContent />
        </Suspense>
    );
}
