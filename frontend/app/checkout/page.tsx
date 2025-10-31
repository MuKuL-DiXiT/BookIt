'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking, validatePromoCode } from '@/lib/api';
import { PromoCode } from '@/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem('bookingData');
    if (!storedData) {
      toast.error('No booking data found');
      router.push('/');
      return;
    }
    setBookingData(JSON.parse(storedData));
  }, [router]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    if (!bookingData) return;

    try {
      setPromoLoading(true);
      const response = await validatePromoCode(promoCode, bookingData.totalPrice);
      setAppliedPromo(response.data);
      toast.success('Promo code applied successfully!');
    } catch (error: any) {
      console.error('Error validating promo code:', error);
      toast.error(error.response?.data?.message || 'Invalid promo code');
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.success('Promo code removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!agreeToTerms) {
      toast.error('Please agree to the terms and safety policy');
      return;
    }

    try {
      setLoading(true);

      const finalPrice = appliedPromo ? appliedPromo.finalPrice : bookingData.totalPrice;
      const discount = appliedPromo ? appliedPromo.discount : 0;

      const booking = {
        experienceId: bookingData.experienceId,
        slotId: bookingData.slotId,
        customerInfo: {
          name,
          email,
          phone,
          numberOfPeople: bookingData.numberOfPeople,
        },
        pricing: {
          basePrice: bookingData.pricePerPerson,
          totalPrice: finalPrice,
          discount,
          promoCode: appliedPromo?.code || null,
        },
      };

      const response = await createBooking(booking);
      
      toast.success('Booking confirmed!');
      
      // Clear booking data and navigate to result page
      sessionStorage.removeItem('bookingData');
      router.push(`/result?reference=${response.data.bookingReference}`);
      
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const subtotal = bookingData.totalPrice;
  const taxRate = 0.06; // 6% tax
  const taxes = Math.round(subtotal * taxRate);
  const finalPrice = appliedPromo ? appliedPromo.finalPrice + taxes : subtotal + taxes;
  const discount = appliedPromo ? appliedPromo.discount : 0;

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header with Back Button */}
          <div className="mb-8 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center transition-colors text-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className=" font-semibold ">Checkout</h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Left Column - Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="rounded-2xl bg-gray-100 p-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg bg-gray-200 px-4 py-3 text-gray-800 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg bg-gray-200 px-4 py-3 text-gray-800 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                        placeholder="Your email"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg bg-gray-200 px-4 py-3 text-gray-800 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                        placeholder="+91 1234567890"
                        required
                      />
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mt-6">
                    
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1 rounded-lg bg-gray-200 px-4 py-3 text-gray-800 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                        placeholder="Promo code"
                        disabled={!!appliedPromo}
                      />
                      {!appliedPromo ? (
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={promoLoading}
                          className="rounded-lg bg-black px-8 py-3 font-medium text-white transition-all hover:bg-gray-800 disabled:bg-gray-400"
                        >
                          {promoLoading ? '...' : 'Apply'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-all hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {appliedPromo && (
                      <div className="mt-2 text-sm text-green-600">
                        ✓ {appliedPromo.code} applied! You saved ₹{discount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mt-6 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-black"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the terms and safety policy
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="rounded-2xl bg-gray-100 p-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium text-gray-900">
                      {bookingData.experienceTitle}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-gray-900">
                      {format(new Date(bookingData.date), 'yyyy-MM-dd')}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium text-gray-900">
                      {bookingData.timeSlot}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Qty</span>
                    <span className="font-medium text-gray-900">
                      {bookingData.numberOfPeople}
                    </span>
                  </div>



                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ₹{(appliedPromo ? appliedPromo.finalPrice : subtotal).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium text-gray-900">
                      ₹{taxes}
                    </span>
                  </div>

                  <div className="my-4 border-t border-gray-300"></div>

                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{finalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Pay and Confirm Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-6 w-full rounded-lg bg-yellow-400 px-8 py-4 text-base font-semibold text-gray-900 transition-all hover:bg-yellow-500 disabled:bg-gray-300"
                  >
                    {loading ? 'Processing...' : 'Pay and Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
