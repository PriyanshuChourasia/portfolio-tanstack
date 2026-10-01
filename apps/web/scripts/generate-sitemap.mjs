// Regenerates public/sitemap.xml from the project data so the sitemap
// never lists project ids that don't exist. Runs before `vite build`.
import { readFileSync, writeFileSync } from 'node:fs'
import { URL, fileURLToPath } from 'node:url'

const SITE_URL = 'https://codymitra.com'

const root = fileURLToPath(new URL('..', import.meta.url))
const works = JSON.parse(readFileSync(`${root}src/data/works-data.json`, 'utf8'))
const today = new Date().toISOString().slice(0, 10)

const urls = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/projects', changefreq: 'weekly', priority: '0.8' },
  // Project detail routes are 1-based indexes into works-data items
  ...works.items.map((_, i) => ({
    path: `/projects/${i + 1}`,
    changefreq: 'monthly',
    priority: '0.6',
  })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

writeFileSync(`${root}public/sitemap.xml`, xml)
console.log(`sitemap.xml: ${urls.length} urls`)
