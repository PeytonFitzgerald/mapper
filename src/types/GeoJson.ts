import { z } from 'zod'

const StatePropertiesSchema = z.object({
  LSAD: z.string(),
  NAME: z.string(),
  STATE: z.string(),
  GEO_ID: z.string(),
  CENSUSAREA: z.number(),
})

const GeometrySchema = z.object({
  type: z.enum([
    'Point',
    'LineString',
    'Polygon',
    'MultiPoint',
    'MultiLineString',
    'MultiPolygon',
  ]),
  coordinates: z.array(z.unknown()),
})

export const FeatureSchema = z.object({
  type: z.literal('Feature'),
  properties: StatePropertiesSchema,
  geometry: GeometrySchema,
})

export const StateRowSchema = z.object({
  id: z.number(),
  name: z.string(),
  properties: StatePropertiesSchema,
  geometry: z.string(),
})

export const StateResponseSchema = z.array(StateRowSchema)

export const FeatureCollectionSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(FeatureSchema),
})

export type FeatureCollectionType = z.infer<typeof FeatureCollectionSchema>
