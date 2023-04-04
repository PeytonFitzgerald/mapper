import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { prisma } from '~/server/db'
import { StateResponseSchema, FeatureSchema } from '~/types/GeoJson'

export const geoRouter = createTRPCRouter({
  getStates: protectedProcedure.query(async ({ ctx }) => {
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
    return {
      type: 'FeatureCollection',
      features: formattedResults,
    }
  }),
})
