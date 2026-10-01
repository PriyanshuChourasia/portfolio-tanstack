import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/write')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white">
      <p className="p-6 text-sm text-neutral-400">Write</p>
    </div>
  )
}
