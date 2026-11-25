import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'

import '../styles.css'
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Resume Builder — Create a Free ATS-Friendly Resume Online',
      },
      {
        name: 'description',
        content:
          'Build a professional, ATS-friendly resume for free. Pick from multiple recruiter-tested templates, fill in your details, and export straight to PDF — no sign-up required.',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/resume_logo.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/resume_logo.png' },
      { rel: 'apple-touch-icon', href: '/resume_logo.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  )
}
