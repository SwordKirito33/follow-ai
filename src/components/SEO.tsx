import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Follow.ai - Earn rewards by testing and reviewing AI tools. Complete tasks, earn XP, level up, and get paid.',
  keywords = ['AI', 'testing', 'rewards', 'earn money', 'AI tools', 'reviews'],
  image = '/og-image.png',
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  noindex = false,
}) => {
  const siteName = 'Follow.ai';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullImageUrl = image.startsWith('http') ? image : `https://follow-ai.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@followai" />
      
      {/* Additional Meta */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'article' ? 'Article' : 'WebSite',
          name: fullTitle,
          description: description,
          url: canonicalUrl,
          image: fullImageUrl,
          ...(type === 'article' && {
            author: {
              '@type': 'Person',
              name: author,
            },
            datePublished: publishedTime,
            dateModified: modifiedTime || publishedTime,
          }),
          ...(type === 'website' && {
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://follow-ai.com/search?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
