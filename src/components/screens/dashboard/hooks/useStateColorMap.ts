import { useEffect, useState } from 'react'
import { USEcon } from '@prisma/client'
import { FeatureCollectionType } from '@/types/GeoJson'
import { EconData, createColorMap, createColorScale } from '../calculations'
export const useStateColorMap = (
  geoData: FeatureCollectionType,
  econData: USEcon[] | undefined,
  econIndicator: string
) => {
  const [stateColorMap, setStateColorMap] = useState(
    createColorMap(geoData.features)
  )

  useEffect(() => {
    if (econData) {
      const colorScale = createColorScale(econData, econIndicator)
      const updatedColorMap = new Map(stateColorMap)
      geoData.features.forEach((feature) => {
        const state = feature.properties.NAME
        const econDataItem = econData.find((item) => item.name === state)
        if (econDataItem) {
          const value = econDataItem[econIndicator] ?? 0
          updatedColorMap.set(state, colorScale(value))
        }
      })
      setStateColorMap(updatedColorMap)
    }
  }, [econData, econIndicator])

  return stateColorMap
}
