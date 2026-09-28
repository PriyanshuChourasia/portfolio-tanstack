export const SITE_URL = 'https://codymitra.com'
export const SITE_NAME = 'Priyanshu Chourasia'
export const AUTHOR_NAME = 'Priyanshu Chourasia'
export const AUTHOR_EMAIL = 'priaynshuchourasia916@gmail.com'
export const TWITTER_HANDLE = '@CoderPriye'

export const SOCIAL_LINKS = {
  github: 'https://github.com/PriyanshuChourasia',
  linkedin: 'https://www.linkedin.com/in/priyanshu-chourasia-17833120a/',
  twitter: 'https://x.com/CoderPriye',
}

export const DEFAULT_TITLE =
  'Priyanshu Chourasia | Full Stack Developer Portfolio'
export const DEFAULT_DESCRIPTION =
  'Portfolio of Priyanshu Chourasia, a Full Stack Developer building modern, performant web applications. Explore projects, blog posts, and experience.'
export const DEFAULT_IMAGE = `${SITE_URL}/hero-person.png`

export function absoluteUrl(path: string) {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`
}

interface MetaOptions {
  title: string
  description: string
  url: string
  image?: string
  type?: 'website' | 'article'
}

/**
 * Builds a full, consistent OG/Twitter meta set for a route's head().
 * Centralized so og:type / twitter:card can't silently get dropped
 * on a per-route basis the way they were before this existed.
 */
export function buildMeta({
  title,
  description,
  url,
  image = DEFAULT_IMAGE,
  type = 'website',
}: MetaOptions) {
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: TWITTER_HANDLE },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
