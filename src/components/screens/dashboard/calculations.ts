import { FeatureType } from '@/types/GeoJson'
import { getRandomRGB } from '@/utils/colors'
import { lerp } from '@/utils/calculations'

export const createColorMap = (features: FeatureType[]) => {
  const colorMap = new Map()
  features.forEach((feature) => {
    const geoId = feature.properties.GEO_ID
    if (!colorMap.has(geoId)) {
      colorMap.set(geoId, getRandomRGB())
    }
  })
  return colorMap
}

/* 
 TODO: This type checking feels...bad. Should revisit, still kind of uncomfortable with generics.
*/
export const createColorScale = <T extends Record<string, number>>(
  data: EconData<T>[],
  key: keyof T
) => {
  const minVal = Math.min(...data.map((d) => d[key]))
  const maxVal = Math.max(...data.map((d) => d[key]))

  return (value: number): [number, number, number, number] => {
    const t = (value - minVal) / (maxVal - minVal)
    const r = lerp(255, 0, t)
    const g = lerp(0, 255, t)
    const b = 0

    return [r, g, b, 255]
  }
}

export type EconData<T> = {
  name: string
  fibs: string
} & T
