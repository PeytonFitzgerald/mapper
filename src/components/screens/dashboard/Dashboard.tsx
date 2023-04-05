import { useState, useMemo } from 'react'
import { GeoJsonLayer } from 'deck.gl/typed'
import { Map } from '@/components/common/charts/Map'
import * as data from '@/server/temp_data/data.json'
import { api } from '@/utils/api'
import { EmptyStateWrapper } from '@/components/common/EmptyStateWrapper'
import { MainHeading } from '@/components/common/MainHeading'
import { FeatureCollectionType } from '@/types/GeoJson'
import { EconData } from './calculations'
import { createColorMap } from './calculations'
import { useToast } from '@/hooks/use-toast'
import { Feature } from 'maplibre-gl'
// Main dashboard hub
const Dashboard = ({ data }: { data: FeatureCollectionType }) => {
  const [currentYear, setCurrentYear] = useState(2018)
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [optionsVisible, toggleOptionsVisible] = useState(false)
  const [currentEconKey, setCurrentEconKey] = useState('real_gdp')
  const [activeColorScale, setActiveColorScale] = useState<
    (value: number) => [number, number, number, number] | null
  >(() => null)
  // const [stateDataMap, setStateDataMap] = useState<
  //   Map<string, EconData<Record<string, number | null>>>
  // >(new (Map as MapConstructor)())

  const { data: econData, isLoading } =
    api.stateRouter.getAllEconDataByYear.useQuery({ year: currentYear })

  // useMemo(() => {
  //   // Fetch the state data for the active economic key and create a color scale
  //   api.stateRouter.getEconData(currentEconKey).then((econData) => {
  //     const newStateDataMap = createStateDataMap(econData)
  //     const newColorScale = createColorScale(econData, currentEconKey)

  //     setStateDataMap(newStateDataMap)
  //     setActiveColorScale(() => newColorScale)
  //   })
  // }, [currentEconKey])

  /*
  const { toast } = useToast()
  // State Color Map Generation
  const stateColorMap = createColorMap(data.features)
  // Hover State and layer
  const [currentEconKey, setCurrentEconKey] = useState('real_gdp')

  */
  const stateColorMap = econData
    ? createColorMap(data.features)
    : createColorMap(data.features)
  const hoverLayer = new GeoJsonLayer({
    id: 'hover-layer',
    data: hoveredFeature ? [hoveredFeature] : [],
    pickable: false,
    stroked: true,
    filled: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: () => [255, 255, 255, 255], // Set fill color to white
    getLineColor: [0, 0, 0, 255],
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 30,
  })
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
      getFillColor: (feature: any) => {
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
      <button
        onClick={() => {
          toggleOptionsVisible(!optionsVisible)
        }}
        className="absolute left-4 top-4 z-10"
      >
        Toggle Layer
      </button>
      {optionsVisible ? (
        <div className="absolute left-16 top-4 z-10 border border-black bg-white p-4">
          <h3>Layer options:</h3>
          {/* <button onClick={toggleLayerVisibility}>Toggle Fill Colors Layer</button> */}
        </div>
      ) : null}
      <Map layers={layers} darkStyle="DARK_MATTER" lightStyle="POSTIRON" />
    </div>
  )
}

/* Wrapper for first geographic data load */
const DashboardScreen = () => {
  const { data, isLoading } = api.stateRouter.getStateGeoData.useQuery()
  return (
    <div>
      {/*<MainHeading title="Mapper" />*/}
      <EmptyStateWrapper
        isLoading={isLoading}
        data={data}
        EmptyComponent={<EmptyStateDashboard />}
        NonEmptyComponent={<Dashboard data={data as FeatureCollectionType} />}
      />
    </div>
  )
}

/* What to load if geographic data for the US is not available for some reason */
const EmptyStateDashboard = () => {
  return (
    <div className="mx-auto flex w-1/3 flex-col items-center justify-center gap-8">
      <div className="text-2xl">Error loading data</div>
    </div>
  )
}

export default DashboardScreen
