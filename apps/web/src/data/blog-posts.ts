import blogData from '@/data/blog-data.json'

export interface BlogPost {
  id: number
  date: string
  author: string
  title: string
  category: string
  image: string
  desc: string
  intro: string
  content: string
  codeSnippet?: string
  footer?: string
  tags?: string[]
}

export interface BlogPostDraft {
  author: string
  title: string
  category: string
  image: string
  desc: string
  intro: string
  content: string
  codeSnippet: string
  footer: string
  tags: string
}

const STORAGE_KEY = 'portfolio-tanstack.blog-posts'

const seedPosts = blogData.posts as BlogPost[]

function hasWindow() {
  return typeof window !== 'undefined'
}

function formatPostDate(date: Date) {
  const formatted = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)

  return formatted.replace(/\b([a-z])([a-z]+)\b/gi, (_, firstLetter: string, rest: string) => {
    return `${firstLetter.toUpperCase()}${rest.toLowerCase()}`
  })
}

function normalizeTags(tags: string[] | undefined) {
  return (tags ?? [])
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function readStoredPosts(): BlogPost[] {
  if (!hasWindow()) {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)
    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue) as BlogPost[]
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((post): post is BlogPost => {
      return (
        typeof post?.id === 'number' &&
        typeof post?.date === 'string' &&
        typeof post?.author === 'string' &&
        typeof post?.title === 'string' &&
        typeof post?.category === 'string' &&
        typeof post?.image === 'string' &&
        typeof post?.desc === 'string' &&
        typeof post?.intro === 'string' &&
        typeof post?.content === 'string'
      )
    })
  } catch {
    return []
  }
}

function writeStoredPosts(posts: BlogPost[]) {
  if (!hasWindow()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export function getBlogPosts() {
  const storedPosts = readStoredPosts()
  const mergedPosts = [...storedPosts, ...seedPosts]

  return mergedPosts.sort((left, right) => right.id - left.id)
}

export function addBlogPost(draft: BlogPostDraft) {
  const post: BlogPost = {
    id: Date.now(),
    date: formatPostDate(new Date()),
    author: draft.author.trim() || 'Admin',
    title: draft.title.trim(),
    category: draft.category.trim() || 'General',
    image: draft.image.trim() || '',
    desc: draft.desc.trim(),
    intro: draft.intro.trim(),
    content: draft.content.trim(),
    codeSnippet: draft.codeSnippet.trim() || undefined,
    footer: draft.footer.trim() || undefined,
    tags: normalizeTags(draft.tags.split(',')),
  }

  const nextPosts = [post, ...readStoredPosts()]
  writeStoredPosts(nextPosts)

  return post
}
