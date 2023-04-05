import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { prisma } from '@/server/db'
import {
  StateResponseSchema,
  FeatureSchema,
  FeatureCollectionSchema,
} from '@/types/GeoJson'

export const stateRouter = createTRPCRouter({
  /* Grabs all rows from USState table */
  getStateGeoData: protectedProcedure.query(async ({ ctx }) => {
    const result = await prisma.$queryRaw`
      SELECT id, name, properties, ST_AsGeoJSON(geometry) AS geometry
      FROM "USState";
    `
    // validate response
    const validatedResult = StateResponseSchema.parse(result)
    // transform geometric string
    const formattedResults = validatedResult.map((state) => {
      const newResponse = {
        type: 'Feature',
        properties: state.properties,
        geometry: JSON.parse(state.geometry),
      }
      FeatureSchema.parse(newResponse)
      return newResponse
    })
    const collection = {
      type: 'FeatureCollection',
      features: formattedResults,
    }
    const validatedCollection = FeatureCollectionSchema.parse(collection)
    return validatedCollection
  }),
  getAllEconDataByYear: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  /* Grabs all rows from USEcon table for a specific USState relation */
  getSpecificStateEconData: protectedProcedure
    .input(z.object({ state: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSState.findUnique({
        where: {
          name: input.state,
        },
        include: {
          USEcon: true,
        },
      })
    }),
  getRealGDP: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          real_gdp: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getRealGDPWithinRange: protectedProcedure
    .input(z.object({ start_year: z.number(), end_year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          real_gdp: true,
          name: true,
          fibs: true,
        },
        where: {
          OR: [
            {
              year: {
                gt: input.start_year,
              },
            },
            {
              year: {
                lt: input.end_year,
              },
            },
          ],
        },
      })
    }),
  getRealPersonal: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          real_personal: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getRealPCE: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          real_pce: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getCurrentGDP: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          current_gdp: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getPersonalIncome: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          personal_income: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getDisposableIncome: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          disposable_income: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getPersonalConsumption: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          personal_consumption: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getRealPerCapitaPersonalIncome: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          real_per_capita_personal_income: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getRealPerCapitaPCE: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          real_per_capita_pce: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getCurrentPerCapitaPersonalIncome: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          current_per_capita_personal_income: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getCurrentPerCapitaDisposableIncome: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          current_per_capita_disposable_income: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getRPP: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          rpp: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getPriceDeflator: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          implicit_regional_price_deflator: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),
  getEmployment: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.uSEcon.findMany({
        select: {
          employment: true,
          name: true,
          fibs: true,
        },
        where: {
          year: {
            equals: input.year,
          },
        },
      })
    }),

  /* Grabs all rows from USEcon table for a specific USState relation */
})
