// Hero Section Component for Follow.ai Landing Page
// Modern, animated hero section with gradient background

import React from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryCTA?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  image?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  className?: string;
}

// ============================================
// Hero Section Component
// ============================================

export function HeroSection({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  image,
  stats,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative min-h-[90vh] flex items-center overflow-hidden',
        'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800',
        className
      )}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            {subtitle && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/90">{subtitle}</span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title.split(' ').map((word, index) => (
                <span
                  key={index}
                  className={cn(
                    'inline-block',
                    index % 3 === 0 && 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400'
                  )}
                >
                  {word}{' '}
                </span>
              ))}
            </h1>

            {description && (
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
                {description}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {primaryCTA && (
                <a
                  href={primaryCTA.href}
                  onClick={primaryCTA.onClick}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl',
                    'bg-white text-purple-900 font-semibold',
                    'hover:bg-white/10 transition-all duration-300',
                    'shadow-lg hover:shadow-xl hover:-translate-y-1'
                  )}
                >
                  {primaryCTA.text}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              )}
              {secondaryCTA && (
                <a
                  href={secondaryCTA.href}
                  onClick={secondaryCTA.onClick}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl',
                    'bg-white/10 text-white font-semibold backdrop-blur-sm',
                    'border border-white/20 hover:bg-white/20',
                    'transition-all duration-300'
                  )}
                >
                  {secondaryCTA.text}
                </a>
              )}
            </div>

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image/Illustration */}
          {image && (
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <img
                  src={image}
                  alt="Hero illustration"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl -z-10 opacity-50" />
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl -z-20 opacity-30" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            className="dark:fill-gray-900"
          />
        </svg>
      </div>
    </section>
  );
}

// ============================================
// Feature Section Component
// ============================================

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureSectionProps {
  title: string;
  subtitle?: string;
  features: Feature[];
  className?: string;
}

export function FeatureSection({
  title,
  subtitle,
  features,
  className,
}: FeatureSectionProps) {
  return (
    <section className={cn('py-20 bg-white dark:bg-gray-900', className)}>
      <div className="container mx-auto px-4">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'group p-8 rounded-2xl',
                'bg-white/5 dark:bg-gray-800',
                'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500',
                'transition-all duration-300',
                'hover:shadow-xl hover:-translate-y-2'
              )}
            >
              <div className="w-14 h-14 rounded-xl bg-primary-purple/20 dark:bg-purple-900/50 group-hover:bg-white/20 flex items-center justify-center mb-6 transition-colors">
                <div className="text-primary-purple dark:text-purple-400 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white dark:text-white group-hover:text-white mb-3 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 dark:text-gray-400 group-hover:text-white/80 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA Section Component
// ============================================

interface CTASectionProps {
  title: string;
  description?: string;
  primaryCTA: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryCTA?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

export function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        'py-20 bg-gradient-to-r from-purple-600 to-pink-600',
        className
      )}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={primaryCTA.href}
            onClick={primaryCTA.onClick}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl',
              'bg-white text-primary-purple font-semibold',
              'hover:bg-white/10 transition-all duration-300',
              'shadow-lg hover:shadow-xl'
            )}
          >
            {primaryCTA.text}
          </a>
          {secondaryCTA && (
            <a
              href={secondaryCTA.href}
              onClick={secondaryCTA.onClick}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl',
                'bg-white/10 text-white font-semibold backdrop-blur-sm',
                'border border-white/20 hover:bg-white/20',
                'transition-all duration-300'
              )}
            >
              {secondaryCTA.text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Export
// ============================================

export default {
  HeroSection,
  FeatureSection,
  CTASection,
};
