// Testimonials Component for Follow.ai
// Displays user testimonials with carousel and grid layouts

import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating?: number;
}

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  layout?: 'carousel' | 'grid' | 'masonry';
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

// ============================================
// Star Rating Component
// ============================================

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            'w-5 h-5',
            star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-400'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ============================================
// Testimonial Card Component
// ============================================

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl',
        'bg-white dark:bg-gray-800',
        'border border-white/10 dark:border-gray-700',
        'shadow-sm hover:shadow-lg',
        'transition-all duration-300'
      )}
    >
      {/* Quote Icon */}
      <svg
        className="w-10 h-10 text-purple-200 dark:text-purple-900 mb-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      {/* Rating */}
      {testimonial.rating && (
        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
        </div>
      )}

      {/* Content */}
      <p className="text-gray-400 dark:text-gray-300 mb-6 leading-relaxed">
        "{testimonial.content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-semibold text-white dark:text-white">
            {testimonial.name}
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-300">
            {testimonial.role}
            {testimonial.company && ` @ ${testimonial.company}`}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Testimonials Component
// ============================================

export function Testimonials({
  title = '用户评价',
  subtitle,
  testimonials,
  layout = 'grid',
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play for carousel
  useEffect(() => {
    if (layout !== 'carousel' || !autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [layout, autoPlay, autoPlayInterval, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className={cn('py-20 bg-white/5 dark:bg-gray-900', className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          {subtitle && (
            <p className="text-sm font-semibold text-primary-purple dark:text-purple-400 uppercase tracking-wider mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white">
            {title}
          </h2>
        </div>

        {/* Carousel Layout */}
        {layout === 'carousel' && (
          <div className="relative max-w-3xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-white/5 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-white/5 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    index === currentIndex
                      ? 'w-8 bg-purple-600'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grid Layout */}
        {layout === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}

        {/* Masonry Layout */}
        {layout === 'masonry' && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="break-inside-avoid">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// Demo Testimonials Data
// ============================================

export const demoTestimonials: Testimonial[] = [
  {
    id: '1',
    name: '张明',
    role: '产品经理',
    company: '字节跳动',
    content: 'Follow.ai帮我发现了很多实用的AI工具，任务系统让学习变得有趣，已经升到15级了！',
    rating: 5,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'UX Designer',
    company: 'Figma',
    content: 'The best platform to discover AI tools. The XP system keeps me motivated to try new tools every day.',
    rating: 5,
  },
  {
    id: '3',
    name: '李华',
    role: '独立开发者',
    content: '通过Follow.ai找到了很多提升效率的AI工具，特别是Cursor和GitHub Copilot的组合，编程效率提升了3倍。',
    rating: 5,
  },
  {
    id: '4',
    name: 'Mike Johnson',
    role: 'Content Creator',
    company: 'YouTube',
    content: 'Found amazing AI tools for video editing and thumbnail creation. The community reviews are super helpful!',
    rating: 4,
  },
  {
    id: '5',
    name: '王芳',
    role: '市场营销',
    company: '阿里巴巴',
    content: '排行榜功能很棒，可以看到其他用户的工具推荐。每周的任务挑战也很有意思。',
    rating: 5,
  },
  {
    id: '6',
    name: 'David Kim',
    role: 'Data Scientist',
    company: 'Google',
    content: 'Great curation of AI tools. The detailed reviews and comparisons saved me hours of research.',
    rating: 4,
  },
];

// ============================================
// Export
// ============================================

export default Testimonials;
