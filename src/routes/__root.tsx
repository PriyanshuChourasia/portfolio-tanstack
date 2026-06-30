import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { LayoutDashboard, Package, Repeat, Scale } from 'lucide-react'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
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
    </SidebarProvider>
  ),
})

const navItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/',
    disabled: true,
  },
  {
    label: 'Unit Master',
    icon: Package,
    to: '/units',
  },
  {
    label: 'Unit Conversion',
    icon: Repeat,
    to: '/units/conversion',
  },
]

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Scale className="size-6 text-primary" />
          <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
            ERP Suite
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={false}
                    disabled={item.disabled}
                    tooltip={item.label}
                  >
                    {item.disabled ? (
                      <button disabled className="opacity-50 cursor-not-allowed">
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </button>
                    ) : (
                      <Link to={item.to}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
