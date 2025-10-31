'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home page with search query
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className='flex justify-center items-center gap-1'>
        <img src="/logo.png" alt="HD" className='sm:w-8 w-6 ml-32 '/>
        <h1 className='text-xs font-bold'>highway <br />delite</h1>
        </div>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex  flex-1 max-w-2xl mr-32 ">
          <div className="flex w-full items-center gap-2">
            <input
              type="text"
              placeholder="Search experiences"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="rounded-lg bg-yellow-300 text-sm  text-gray-900 hover:bg-yellow-500 transition-colors whitespace-nowrap"
              style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '10px', paddingBottom: '10px' }}
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
