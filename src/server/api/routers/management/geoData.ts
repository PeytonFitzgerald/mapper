import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { prisma } from '@/server/db'

export const managementRouter = createTRPCRouter({
  insertStates: protectedProcedure.query(async ({ ctx }) => {
    console.log('hello')
  }),
})
