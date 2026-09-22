import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/photofolio')({
  component: PhotofolioLayout,
})

function PhotofolioLayout() {
  return <Outlet />
}
