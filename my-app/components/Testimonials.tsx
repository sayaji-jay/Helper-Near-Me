'use client';

import { Testimonial } from '@/types';
import { useEffect } from 'react';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  useEffect(() => {
    // Initialize Swiper after component mounts
    if (typeof window !== 'undefined' && (window as any).Swiper) {
      new (window as any).Swiper('.mySwiper', {
        slidesPerView: 2,
        spaceBetween: 28,
        loop: true,
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 28,
          },
        },
      });
    }
  }, []);

  return (
    <section id="testimonials-section" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center gap-y-8 flex-wrap lg:flex-nowrap lg:justify-between lg:gap-x-8 max-w-full mx-auto">
          <div className="w-full lg:w-2/5">
            <span className="text-sm text-gray-500 font-medium mb-4 block">Testimonial</span>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-8">
              23k+ Customers gave their{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
                Feedback
              </span>
            </h2>
          </div>
          <div className="w-full lg:w-3/5">
            <div className="swiper mySwiper">
              <div className="swiper-wrapper">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="swiper-slide group bg-white border border-gray-300 rounded-2xl p-5 hover:border-indigo-600 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <img className="w-10 h-10 rounded-full" src={testimonial.avatar} alt={testimonial.name} />
                      <div>
                        <h5 className="text-gray-900 font-medium text-sm">{testimonial.name}</h5>
                        <span className="text-xs text-gray-500">{testimonial.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center mb-4 gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" viewBox="0 0 18 17" fill="currentColor">
                          <path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 leading-5">&quot;{testimonial.quote}&quot;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
