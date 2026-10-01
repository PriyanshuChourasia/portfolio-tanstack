import { AUTHOR_NAME } from '@/lib/seo'

type NavItem = { label: string; id: string }

const navItems: Array<NavItem> = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
]

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Navbar() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className="cursor-pointer text-sm font-semibold tracking-tight text-neutral-900"
        >
          {AUTHOR_NAME}
        </button>

        <ul className="flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="cursor-pointer text-sm text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}