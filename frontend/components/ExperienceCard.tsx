'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Experience } from '@/types';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Link 
      href={`/experiences/${experience._id}`}
      className="group block overflow-hidden rounded-2xl bg-white  transition-all hover:shadow-md"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content Section */}
      <div className="p-2 bg-gray-100">
        {/* Title and Location Badge */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-black">
            {experience.title}
          </h3>
          <span className="shrink-0 rounded-md bg-gray-300 px-3 py-1 max-w-48 text-xs font-medium text-gray-700 text-wrap">
            {experience.location}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 text-xs text-gray-600 line-clamp-2">
          {experience.shortDescription}
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-500">From</span>
            <span className="text-lg font-semibold text-gray-900">
              ₹{experience.basePrice.toLocaleString('en-IN')}
            </span>
          </div>
          <button className="rounded-lg bg-yellow-300 px-4 py-1 text-xs font-semibold text-gray-900 hover:bg-yellow-500 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}
