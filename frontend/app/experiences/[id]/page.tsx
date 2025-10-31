'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import Image from 'next/image';
import { getExperienceById } from '@/lib/api';
import { Experience, Slot } from '@/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ExperienceDetails() {
  const params = useParams();
  const router = useRouter();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchExperience(params.id as string);
    }
  }, [params.id]);

  const fetchExperience = async (id: string) => {
    try {
      setLoading(true);
      const response = await getExperienceById(id);
      setExperience(response.data);
    } catch (error) {
      console.error('Error fetching experience:', error);
      toast.error('Failed to load experience details');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDates = () => {
    if (!experience) return [];
    const dates = new Set<string>();
    experience.slots.forEach(slot => {
      const date = format(new Date(slot.date), 'yyyy-MM-dd');
      dates.add(date);
    });
    return Array.from(dates).sort();
  };

  const getSlotsForDate = (date: string) => {
    if (!experience) return [];
    return experience.slots.filter(slot => {
      const slotDate = format(new Date(slot.date), 'yyyy-MM-dd');
      return slotDate === date;
    });
  };

  const handleBookNow = () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    if (numberOfPeople < 1) {
      toast.error('Please select number of people');
      return;
    }

    if (numberOfPeople > selectedSlot.availableSeats) {
      toast.error(`Only ${selectedSlot.availableSeats} seats available`);
      return;
    }

    // Store booking details in sessionStorage and navigate to checkout
    const bookingData = {
      experienceId: experience?._id,
      experienceTitle: experience?.title,
      slotId: selectedSlot._id,
      date: selectedSlot.date,
      timeSlot: selectedSlot.timeSlot,
      numberOfPeople,
      pricePerPerson: selectedSlot.price,
      totalPrice: selectedSlot.price * numberOfPeople,
    };

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-96 rounded-xl bg-gray-300"></div>
          <div className="mt-8 space-y-4">
            <div className="h-8 rounded bg-gray-300"></div>
            <div className="h-4 rounded bg-gray-300"></div>
            <div className="h-4 w-2/3 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Experience not found</h1>
        <button
          onClick={() => router.push('/')}
          className="mt-4 rounded-full bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const availableDates = getAvailableDates();
  const slotsForSelectedDate = selectedDate ? getSlotsForDate(selectedDate) : [];

  const calculateSubtotal = () => {
    if (!selectedSlot) return 0;
    return selectedSlot.price * numberOfPeople;
  };

  const calculateTaxes = () => {
    const subtotal = calculateSubtotal();
    return Math.round(subtotal * 0.06); // 6% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes();
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => router.back()}
          className="flex text-sm items-center space-x-2 text-black hover:text-gray-900"
        >
          <ArrowLeft  size={20}/>
          <span className="font-medium">Details</span>
        </button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Left Side - Image and Content */}
            <div className="space-y-6">
              {/* Image */}
              <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
                <Image
                  src={experience.image}
                  alt={experience.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Title */}
              <h1 className="text-2xl text-gray-900">{experience.title}</h1>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{experience.description}</p>


              <div>
                <h2 className="text-gray-900 mb-4">Choose date</h2>
                <div className="flex flex-wrap gap-3">
                  {availableDates.slice(0, 5).map((date) => {
                    const dateObj = new Date(date);
                    const month = format(dateObj, 'MMM');
                    const day = format(dateObj, 'dd');
                    return (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedSlot(null);
                        }}
                        className={`px-4 py-2 rounded-md font-medium transition-all border border-gray-300 ${
                          selectedDate === date
                            ? 'bg-yellow-300 text-black'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {month} {day}
                      </button>
                    );
                  })}
                </div>
              </div>


              {selectedDate && slotsForSelectedDate.length > 0 && (
                <div>
                  <h2 className="text-xl  text-gray-900 mb-4">Choose time</h2>
                  <div className="flex flex-wrap gap-3">
                    {slotsForSelectedDate.map((slot) => (
                      <button
                        key={slot._id}
                        onClick={() => setSelectedSlot(slot)}
                        disabled={slot.availableSeats === 0}
                        className={`px-4 py-2 border border-gray-300 rounded-lg font-medium transition-all flex justify-center gap-2 items-center ${
                          selectedSlot?._id === slot._id
                            ? 'bg-yellow-300 text-gray-900'
                            : slot.availableSeats === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {slot.timeSlot} <span className='text-xs text-red-600'>{slot.availableSeats} seats left</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Booking Card */}
            <div>
              <div className="sticky top-24 rounded-2xl bg-gray-50 p-8">
                {/* Starts at */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">Starts at</span>
                  <span className=" text-gray-900">
                    ₹{selectedSlot ? selectedSlot.price.toLocaleString('en-IN') : experience.basePrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Quantity */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Quantity</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                        disabled={numberOfPeople <= 1}
                        className="w-4 h-4 flex items-center justify-center  border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-sm">−</span>
                      </button>
                      <span className="font-semibold w-8 text-center">{numberOfPeople}</span>
                      <button
                        onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                        disabled={!selectedSlot || numberOfPeople >= selectedSlot.availableSeats}
                        className="w-4 h-4 flex items-center justify-center  border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-sm">+</span>
                      </button>
                    </div>
                  </div>
                </div>



                {/* Subtotal */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className=" text-gray-900">
                    ₹{calculateSubtotal().toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Taxes */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900">
                    ₹{calculateTaxes().toLocaleString('en-IN')}
                  </span>
                </div>

                <hr className="my-2 border-gray-300" />

                {/* Total */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xl  text-gray-900">Total</span>
                  <span className="text-2xl  text-gray-900">
                    ₹{calculateTotal().toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleBookNow}
                  disabled={!selectedSlot}
                  className="w-full rounded-lg disabled:bg-gray-300 bg-yellow-400 px-6 py-2 text-lg font-semibold text-gray-700  transition-all hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
