import { createFileRoute } from '@tanstack/react-router'
import { LayoutDashboard } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <LayoutDashboard className="size-8 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome to the ERP Suite. Use the sidebar to navigate between modules.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">Unit Master</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage units of measurement
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">Unit Conversion</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Define conversion factors between units
          </p>
        </div>
      </div>
    </div>
  )
}
