/**
 * Generate sitemap.xml for SEO
 */

const baseUrl = 'https://www.follow-ai.com';

const routes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/dashboard', priority: 0.8, changefreq: 'daily' },
  { path: '/tasks', priority: 0.8, changefreq: 'daily' },
  { path: '/rankings', priority: 0.7, changefreq: 'weekly' },
  { path: '/leaderboard', priority: 0.7, changefreq: 'daily' },
  { path: '/xp-history', priority: 0.6, changefreq: 'weekly' },
  { path: '/wallet', priority: 0.7, changefreq: 'daily' },
  { path: '/hire', priority: 0.6, changefreq: 'weekly' },
  { path: '/profile', priority: 0.6, changefreq: 'weekly' },
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.4, changefreq: 'monthly' },
  { path: '/terms', priority: 0.4, changefreq: 'monthly' },
];

function generateSitemap(): string {
  const now = new Date().toISOString().split('T')[0];
  
  const urls = routes.map(route => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Generate and save sitemap
const sitemap = generateSitemap();
console.log(sitemap);

// Save to file
import { writeFileSync } from 'fs';
import { join } from 'path';

const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(sitemapPath, sitemap, 'utf-8');
console.log(`\n✅ Sitemap generated: ${sitemapPath}`);
