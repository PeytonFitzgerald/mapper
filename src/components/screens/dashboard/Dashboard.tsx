import { useState } from 'react'
import { GeoJsonLayer } from 'deck.gl/typed'
import { Map } from '~/components/common/charts/Map'
import * as data from '~/server/temp_data/data.json'
import { api } from '~/utils/api'
import { EmptyStateWrapper } from '~/components/common/EmptyStateWrapper'
import { MainHeading } from '~/components/common/MainHeading'
import { FeatureCollectionType } from '~/types/GeoJson'
import { createColorMap } from './components/Colors'

// TODO: Type data
const Dashboard = ({ data }: { data: FeatureCollectionType }) => {
  // Hover State and layer
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const hoverLayer = new GeoJsonLayer({
    id: 'hover-layer',
    data: hoveredFeature ? [hoveredFeature] : [],
    pickable: false,
    stroked: true,
    filled: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: (feature) => {
      const geoId = feature.properties.GEO_ID
      const baseColor = stateColorMap.get(geoId)
      return [...baseColor, 200]
    },
    getLineColor: [0, 0, 0, 255],
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 30,
  })
  // State Color Map Generation
  const stateColorMap = createColorMap(data.features)
  // Main Geo Layer
  const layers = [
    new GeoJsonLayer({
      id: 'geojson-layer',
      data,
      pickable: true,
      stroked: false,
      filled: true,
      extruded: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: (feature) => {
        const geoId = feature.properties.GEO_ID
        return stateColorMap.get(geoId)
      },
      getLineColor: [0, 0, 0, 255],
      getRadius: 100,
      getLineWidth: 1,
      getElevation: 30,
      onClick: (info, event) => {
        console.log('Feature clicked:', info.object)
      },
      onHover: (info) => {
        setHoveredFeature(info.object)
      },
    }),
    hoverLayer,
  ]

  return (
    <div className="h-screen w-screen">
      <Map layers={layers} darkStyle="DARK_MATTER" lightStyle="POSTIRON" />
    </div>
  )
}

const DashboardScreen = () => {
  const { data, isLoading } = api.geographic.getStates.useQuery()
  return (
    <div>
      <MainHeading title="Mapper" />
      <EmptyStateWrapper
        isLoading={isLoading}
        data={data}
        EmptyComponent={<EmptyStateDashboard />}
        NonEmptyComponent={<Dashboard data={data as FeatureCollectionType} />}
      />
    </div>
  )
}

const EmptyStateDashboard = () => {
  return (
    <div className="mx-auto flex w-1/3 flex-col items-center justify-center gap-8">
      <div className="text-2xl">Error loading data</div>
    </div>
  )
}

export default DashboardScreen
