'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getExperiences, searchExperiences } from '@/lib/api';
import { Experience } from '@/types';
import ExperienceCard from '@/components/ExperienceCard';
import toast from 'react-hot-toast';

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    fetchExperiences();
  }, [searchQuery]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      let response;
      
      if (searchQuery) {
        response = await searchExperiences(searchQuery);
        if (response.count === 0) {
          toast.success(`No results found for "${searchQuery}"`);
        } else {
          toast.success(`Found ${response.count} result(s) for "${searchQuery}"`);
        }
      } else {
        response = await getExperiences();
      }
      
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiences = experiences;

  return (
    <div className="min-h-screen bg-white">
      {/* Experiences Section */}
      <section className="pt-20">
        <div className="container mx-auto mt-12">
          {/* Loading State */}
          {loading && (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-56 rounded-t-2xl bg-gray-200"></div>
                  <div className="space-y-3 rounded-b-2xl bg-white p-5">
                    <div className="h-4 rounded bg-gray-200"></div>
                    <div className="h-4 rounded bg-gray-200"></div>
                    <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Experiences Grid */}
          {!loading && filteredExperiences.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredExperiences.map((experience) => (
                <ExperienceCard key={experience._id} experience={experience} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredExperiences.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-600">
                No experiences found.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
