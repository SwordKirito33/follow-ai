// SEO Head Component for Follow-ai
// Manages meta tags, Open Graph, Twitter Cards, and structured data

import { useEffect } from 'react';

// ============================================
// Types
// ============================================

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  locale?: string;
  siteName?: string;
  twitterHandle?: string;
  structuredData?: Record<string, unknown>;
}

// ============================================
// Default Values
// ============================================

const defaults = {
  siteName: 'Follow-ai',
  title: 'Follow-ai - AI工具发现与测试平台',
  description: '发现、测试和评价最新的AI工具。完成任务赚取XP，提升等级，成为AI工具专家。',
  image: '/og-image.png',
  twitterHandle: '@followai',
  locale: 'zh_CN',
  type: 'website' as const,
};

// ============================================
// SEO Head Component
// ============================================

export function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = defaults.type,
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  noindex = false,
  nofollow = false,
  canonical,
  locale = defaults.locale,
  siteName = defaults.siteName,
  twitterHandle = defaults.twitterHandle,
  structuredData,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${siteName}` : defaults.title;
  const fullDescription = description || defaults.description;
  const fullImage = image || defaults.image;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    };

    // Helper to update or create link tag
    const setLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      
      link.href = href;
    };

    // Basic meta tags
    setMeta('description', fullDescription);
    if (keywords?.length) {
      setMeta('keywords', keywords.join(', '));
    }
    if (author) {
      setMeta('author', author);
    }

    // Robots
    const robotsContent = [
      noindex ? 'noindex' : 'index',
      nofollow ? 'nofollow' : 'follow',
    ].join(', ');
    setMeta('robots', robotsContent);

    // Canonical URL
    if (canonical) {
      setLink('canonical', canonical);
    }

    // Open Graph tags
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', fullDescription, true);
    setMeta('og:image', fullImage, true);
    setMeta('og:url', currentUrl, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', siteName, true);
    setMeta('og:locale', locale, true);

    if (type === 'article') {
      if (publishedTime) {
        setMeta('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        setMeta('article:modified_time', modifiedTime, true);
      }
      if (author) {
        setMeta('article:author', author, true);
      }
      if (section) {
        setMeta('article:section', section, true);
      }
      if (tags?.length) {
        tags.forEach((tag, index) => {
          setMeta(`article:tag:${index}`, tag, true);
        });
      }
    }

    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', fullDescription);
    setMeta('twitter:image', fullImage);
    if (twitterHandle) {
      setMeta('twitter:site', twitterHandle);
      setMeta('twitter:creator', twitterHandle);
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(structuredData);
    }
  }, [
    fullTitle,
    fullDescription,
    fullImage,
    currentUrl,
    type,
    author,
    publishedTime,
    modifiedTime,
    section,
    tags,
    noindex,
    nofollow,
    canonical,
    locale,
    siteName,
    twitterHandle,
    keywords,
    structuredData,
  ]);

  return null;
}

// ============================================
// Structured Data Generators
// ============================================

export function generateWebsiteSchema(siteName: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema(
  name: string,
  url: string,
  logo: string,
  socialLinks: string[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs: socialLinks,
  };
}

export function generateProductSchema(
  name: string,
  description: string,
  image: string,
  rating: number,
  reviewCount: number,
  price?: string,
  currency?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount,
    },
    ...(price && currency && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: currency,
      },
    }),
  };
}

export function generateArticleSchema(
  headline: string,
  description: string,
  image: string,
  author: string,
  publishedTime: string,
  modifiedTime?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: publishedTime,
    ...(modifiedTime && { dateModified: modifiedTime }),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ============================================
// Export
// ============================================

export default SEOHead;
