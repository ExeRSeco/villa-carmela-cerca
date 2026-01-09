import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { businesses } from '../src/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const BASE_URL = 'https://villacarmelacerca.com'; // TODO: Update with real domain

const staticRoutes = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
];

function generateSitemap() {
    console.log('Generating sitemap...');

    const routes = [...staticRoutes];

    // NOTE: Removed dynamic and client-side routes to ensure only server-backed URLs are indexed.

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `
    <url>
        <loc>${BASE_URL}${route.url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`).join('')}
</urlset>`;

    const publicDir = path.join(__dirname, '../public');

    // Ensure public dir exists
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
    console.log(`Sitemap generated at ${path.join(publicDir, 'sitemap.xml')} with ${routes.length} URLs.`);
}

generateSitemap();
