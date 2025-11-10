'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { TESTIMONIALS, FAQS } from '@/lib/constants';
import UserCard from './UserCard';
import Testimonials from './Testimonials';
import FAQSection from './FAQSection';
import CTASection from './CTASection';

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWork, setSelectedWork] = useState<string[]>([]);
  const [allWorkTypes, setAllWorkTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 9;

  useEffect(() => {
    loadWorkTypes();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [currentPage, selectedWork, searchQuery]);

  async function loadWorkTypes() {
    try {
      const response = await fetch('/api/skills');
      const data = await response.json();
      if (data.success) {
        setAllWorkTypes(data.work || data.skills); // Support both for backward compatibility
      }
    } catch (error) {
      console.error('Error loading work types:', error);
    }
  }

  async function loadUsers() {
    setLoading(true);
    try {
      let url = `/api/users?page=${currentPage}&limit=${itemsPerPage}`;

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      if (selectedWork.length > 0) {
        url += `&work=${encodeURIComponent(selectedWork.join(','))}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleWorkToggle = (work: string) => {
    if (work === 'all') {
      setSelectedWork([]);
    } else {
      setSelectedWork(prev =>
        prev.includes(work)
          ? prev.filter(w => w !== work)
          : [...prev, work]
      );
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <>
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find Skilled Workers Near You
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Search and filter through our community of talented professionals
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, city, village, work type, or description..."
                className="w-full px-6 py-4 pr-12 text-base rounded-lg border-2 border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 transition-all duration-200 bg-white shadow-sm"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleWorkToggle('all')}
                className={`px-5 py-2.5 rounded-full border-2 font-medium text-sm transition-all ${
                  selectedWork.length === 0
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-900'
                }`}
              >
                All
              </button>
              {allWorkTypes.map((work) => (
                <button
                  key={work}
                  onClick={() => handleWorkToggle(work)}
                  className={`px-5 py-2.5 rounded-full border-2 font-medium text-sm transition-all ${
                    selectedWork.includes(work)
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-900'
                  }`}
                >
                  {work}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 text-center">
              {loading ? 'Loading...' : `Showing ${users.length} of ${total} workers`}
            </p>
          </div>

          {loading && (
            <div className="flex justify-center my-12">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No workers found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-300 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      <Testimonials testimonials={TESTIMONIALS} />
      <FAQSection faqs={FAQS} />
      <CTASection />
    </>
  );
}
