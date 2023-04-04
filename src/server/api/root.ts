import { createTRPCRouter } from '~/server/api/trpc'
import { exampleRouter } from '~/server/api/routers/example'
import { managementRouter } from './routers/management/geoData'
import { geoRouter } from './routers/geographic/geoRouter'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  management: managementRouter,
  geographic: geoRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
