import { FeatureType } from '@/types/GeoJson'
import { getRandomRGB } from '@/utils/colors'
import { lerp } from '@/utils/calculations'
import { FeatureCollectionType } from '@/types/GeoJson'
import { GeoJsonLayer } from 'deck.gl/typed'
import { Feature } from 'geojson'
type CreateEconGeoJsonLayerProps<T> = {
  data: FeatureCollectionType
  stateDataMap: Map<string, EconData<T>>
  colorScale: (value: number) => [number, number, number, number]
  onClick?: (info: any, event: any) => void
  onHover?: (info: any) => void
}

export const createEconGeoJsonLayer = <T extends Record<string, number>>({
  data,
  stateDataMap,
  colorScale,
  onClick,
  onHover,
}: CreateEconGeoJsonLayerProps<T>) => {
  return new GeoJsonLayer({
    id: 'econ-geojson-layer',
    data,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: (feature: Feature) => {
      const geoId = feature!.properties!.GEO_ID
      const econData = stateDataMap.get(geoId)
      if (econData) {
        const value = econData[1] ?? 0
        return colorScale(value)
      }
      return [0, 0, 0, 255] // Default color if no data is available for the state
    },
    getLineColor: [0, 0, 0, 255],
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 30,
    onClick,
    onHover,
  })
}

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
