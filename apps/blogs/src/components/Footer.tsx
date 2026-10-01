import { AUTHOR_NAME } from '@/lib/seo'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-neutral-500 sm:flex-row">
        <p>©2026 codymitra.com</p>
        <p>{AUTHOR_NAME}</p>
      </div>
    </footer>
  )
}
