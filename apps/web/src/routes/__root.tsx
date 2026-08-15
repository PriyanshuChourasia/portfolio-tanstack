import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Toaster } from '@/components/ui/sonner'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL, buildMeta } from '@/lib/seo'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  // Fallback meta only — every indexable route below sets its own head()
  // which overrides these by name/property. No `links` (canonical) here:
  // it's not deduped across route matches by TanStack Router, so setting
  // one at the root would sit alongside every child route's own canonical.
  head: () => ({
    meta: buildMeta({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      url: SITE_URL,
    }).meta,
  }),
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <ScrollToTop />
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
