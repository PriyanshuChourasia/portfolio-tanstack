import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

const SITE_URL = 'https://codymitra.com'
const DEFAULT_TITLE = 'Priyanshu Chourasia | Full Stack Developer Portfolio'
const DEFAULT_DESCRIPTION =
  'Portfolio of Priyanshu Chourasia, a Full Stack Developer building modern, performant web applications. Explore projects, blog posts, and experience.'
const DEFAULT_IMAGE = `${SITE_URL}/hero-person.png`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { title: DEFAULT_TITLE },
      { name: 'description', content: DEFAULT_DESCRIPTION },
      { property: 'og:title', content: DEFAULT_TITLE },
      { property: 'og:description', content: DEFAULT_DESCRIPTION },
      { property: 'og:image', content: DEFAULT_IMAGE },
      { property: 'og:url', content: SITE_URL },
      { name: 'twitter:title', content: DEFAULT_TITLE },
      { name: 'twitter:description', content: DEFAULT_DESCRIPTION },
      { name: 'twitter:image', content: DEFAULT_IMAGE },
    ],
    links: [{ rel: 'canonical', href: SITE_URL }],
  }),
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <Toaster richColors position="bottom-right" />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  ),
})
