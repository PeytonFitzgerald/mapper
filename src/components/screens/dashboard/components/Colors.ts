import { FeatureType } from '~/types/GeoJson'
import { getRandomRGB } from '~/utils/colors'

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
