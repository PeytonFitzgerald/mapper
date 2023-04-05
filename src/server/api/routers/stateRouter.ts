import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { prisma } from '@/server/db'
import {
  StateResponseSchema,
  FeatureSchema,
  FeatureCollectionSchema,
} from '@/types/GeoJson'
import { PrismaClient } from '@prisma/client'
import { usEconSelector } from '@/types/Econ'

/**
 * Returns the requested econ data for a given year for all states.
 *
 * @param {string} selectField: The column of the USEcon table to be returned
 * @param {number} year - The end value.
 * @param {PrismaClient} prismaSession - The authorized prisma session
 */
const getEconDataByYear = (
  selectField: string,
  year: number,
  prismaSession: PrismaClient
) => {
  return prismaSession.uSEcon.findMany({
    select: {
      [selectField]: true,
      name: true,
      fibs: true,
    },
    where: {
      year: {
        equals: year,
      },
    },
  })
}

/**
 * Returns the requested econ data for all years for all states.
 *
 * @param {string} selectField: The column of the USEcon table to be returned
 * @param {PrismaClient} prismaSession - The authorized prisma session
 */
const getEconDataAllYears = (
  selectField: string,
  prismaSession: PrismaClient
) => {
  return prismaSession.uSEcon.findMany({
    select: {
      [selectField]: true,
      name: true,
      fibs: true,
    },
  })
}

/**
 * Returns the requested econ data for years within a specified range for all states.
 *
 * @param {string} selectField: The column of the USEcon table to be returned
 * @param {number} start_year - The starting year for the range
 * @param {number} end_year - The ending year for the range
 * @param {PrismaClient} prismaSession - The authorized prisma session
 */
const getEconDataWithinRange = (
  selectField: string,
  start_year: number,
  end_year: number,
  prismaSession: PrismaClient
) => {
  return prismaSession.uSEcon.findMany({
    select: {
      [selectField]: true,
      name: true,
      fibs: true,
    },
    where: {
      OR: [
        {
          year: {
            gt: start_year,
          },
        },
        {
          year: {
            lt: end_year,
          },
        },
      ],
    },
  })
}

/**
 * Returns the requested econ data for a given year for a specific state
 *
 * @param {string} state: The name of the state
 * @param {string} selectField: The column of the USEcon table to be returned
 * @param {number} year - The end value.
 * @param {PrismaClient} prismaSession - The authorized prisma session
 */
const getStateSpecificEconDataByYear = (
  state: string,
  selectField: string,
  year: number,
  prismaSession: PrismaClient
) => {
  return prismaSession.uSEcon.findMany({
    select: {
      [selectField]: true,
      name: true,
      fibs: true,
    },
    where: {
      AND: [
        {
          year: {
            equals: year,
          },
        },
        {
          name: state,
        },
      ],
    },
  })
}

/**
 * Returns all economic data for a given year for a specific state
 *
 * @param {string} state: The name of the state
 * @param {number} year - The end value.
 * @param {PrismaClient} prismaSession - The authorized prisma session
 */
const getAllStateEconDataByYear = (
  state: string,
  year: number,
  prismaSession: PrismaClient
) => {
  return prismaSession.uSEcon.findMany({
    where: {
      AND: [
        {
          year: {
            equals: year,
          },
        },
        {
          name: state,
        },
      ],
    },
  })
}

export const stateRouter = createTRPCRouter({
  /* Grabs all rows from USState table */
  getStateGeoData: protectedProcedure.query(async ({ ctx }) => {
    const result = await prisma.$queryRaw`
      SELECT id, name, properties, ST_AsGeoJSON(geometry) AS geometry
      FROM "USState";
    `
    // Prisma can't handle the geometry type, so have to use zod for parsing here
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
  /*
   * Grabs a specific USEcon table column value for all states for a given year.
   */
  getSpecificEconDataByYear: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        type: usEconSelector,
      })
    )
    .query(async ({ ctx, input }) => {
      return getEconDataByYear(input.type, input.year, ctx.prisma)
    }),
  /*
   * Grabs a specific USEcon table column value for all states for all years within the specified range
   */
  getSpecificEconDataWithinRange: protectedProcedure
    .input(
      z.object({
        start_year: z.number(),
        end_year: z.number(),
        type: usEconSelector,
      })
    )
    .query(async ({ ctx, input }) => {
      return getEconDataWithinRange(
        input.type,
        input.start_year,
        input.end_year,
        ctx.prisma
      )
    }),
})
