import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Toaster } from '@/components/ui/sonner'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL, buildMeta } from '@/lib/seo'
import '../global.css'

export const Route = createRootRoute({
  head: () => ({
    meta: buildMeta({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      url: SITE_URL,
    }).meta,
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Navbar />
      <Outlet />
      <Footer />
      <ScrollToTop />
      <Toaster richColors position="bottom-right" />
    </>
  )
}
