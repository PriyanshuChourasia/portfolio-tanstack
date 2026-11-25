import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ThemeProvider } from './features/resume-builder/components/ThemeProvider'
import { SplashScreen } from './components/SplashScreen'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  let splashCompleted = false
  root.render(
    <>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
      <SplashScreen onComplete={() => { splashCompleted = true }} />
    </>
  )
  // Hide splash screen after router is ready
  router.getRoot().ready.then(() => {
    if (!splashCompleted) {
      splashCompleted = true
    }
  })
}
