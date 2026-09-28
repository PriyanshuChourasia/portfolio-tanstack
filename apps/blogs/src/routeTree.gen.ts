/* eslint-disable */
// @ts-nocheck

import { Route as rootRouteImport } from './routes/__root'
import { Route as indexRouteImport } from './routes/index'
import { Route as blogIdRouteImport } from './routes/blog/$id'
import { Route as blogIndexRouteImport } from './routes/blog'
import { Route as blogWriteRouteImport } from './routes/blog/write'

const indexRoute = indexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const blogIndexRoute = blogIndexRouteImport.update({
  id: '/blog',
  path: '/blog',
  getParentRoute: () => rootRouteImport,
} as any)
const blogIdRoute = blogIdRouteImport.update({
  id: '/blog/$id',
  path: '/blog/$id',
  getParentRoute: () => rootRouteImport,
} as any)
const blogWriteRoute = blogWriteRouteImport.update({
  id: '/blog/write',
  path: '/blog/write',
  getParentRoute: () => rootRouteImport,
} as any)

export const routeTree = rootRouteImport
  ._addFileChildren([indexRoute, blogIndexRoute, blogIdRoute, blogWriteRoute])
  ._addFileTypes()
