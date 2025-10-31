export interface Experience {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  location: string;
  duration: string;
  category: string;
  rating: number;
  reviewCount: number;
  basePrice: number;
  highlights: string[];
  includes: string[];
  excludes: string[];
  slots: Slot[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  _id: string;
  date: string;
  timeSlot: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
}

export interface Booking {
  _id: string;
  experienceId: string;
  experienceTitle: string;
  slotId: string;
  date: string;
  timeSlot: string;
  customerInfo: CustomerInfo;
  pricing: Pricing;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  numberOfPeople: number;
}

export interface Pricing {
  basePrice: number;
  totalPrice: number;
  discount: number;
  promoCode: string | null;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  discount: number;
  finalPrice: number;
}
