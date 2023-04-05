import React, {
  useState,
  useMemo,
  useContext,
  createContext,
  useReducer,
  useEffect,
} from 'react'
import { GeoJsonLayer } from 'deck.gl/typed'
import { Map as MapComponent } from '@/components/common/charts/Map'
import * as data from '@/server/temp_data/data.json'
import { api } from '@/utils/api'
import { EmptyStateWrapper } from '@/components/common/EmptyStateWrapper'
import { MainHeading } from '@/components/common/MainHeading'
import { FeatureCollectionType } from '@/types/GeoJson'
import { EconData } from './calculations'
import { createColorMap } from './calculations'
import { useToast } from '@/hooks/use-toast'
import { Feature } from 'maplibre-gl'
import { USEconSelector } from '@/types/Econ'
import { createColorScale } from './calculations'
interface StateType {
  year: number
  econ_indicator: USEconSelector
}
type ActionType =
  | { type: 'SET_YEAR'; year: number }
  | { type: 'SET_INDICATOR'; econ_indicator: USEconSelector }
const initialState: StateType = {
  year: 2022,
  econ_indicator: 'real_gdp',
}
const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case 'SET_YEAR':
      return { ...state, year: action.year }
    case 'SET_INDICATOR':
      return { ...state, econ_indicator: action.econ_indicator }
    default:
      return state
  }
}
export const EconContext = createContext<StateType | null>(null)
export const EconDispatchContext =
  React.createContext<React.Dispatch<ActionType> | null>(null)
/* Wrapper for first geographic data load */
const DashboardScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { data, isLoading } = api.stateRouter.getStateGeoData.useQuery()
  return (
    <div>
      {/*<MainHeading title="Mapper" />*/}
      <EconContext.Provider value={state}>
        <EconDispatchContext.Provider value={dispatch}>
          <EmptyStateWrapper
            isLoading={isLoading}
            data={data}
            EmptyComponent={<EmptyStateDashboard />}
            NonEmptyComponent={
              <Dashboard geoData={data as FeatureCollectionType} />
            }
          />
        </EconDispatchContext.Provider>
      </EconContext.Provider>
    </div>
  )
}

// Main dashboard hub
const Dashboard = ({ geoData }: { geoData: FeatureCollectionType }) => {
  const data = geoData
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [optionsVisible, toggleOptionsVisible] = useState(false)
  const [stateColorMap, setStateColorMap] = useState(
    createColorMap(data.features)
  )
  const econContext = useContext(EconContext)
  const econContextDispatch = useContext(EconDispatchContext)
  const { data: econData, isLoading: econDataIsLoading } =
    api.stateRouter.getAllEconDataByYear.useQuery({
      year: econContext?.year ?? 2021,
    })

  useEffect(() => {
    if (econData && econContext) {
      const colorScale = createColorScale(econData, econContext.econ_indicator)
      const updatedColorMap = new Map(stateColorMap)
      console.log(colorScale)
      geoData.features.forEach((feature) => {
        const state = feature.properties.NAME
        const econDataItem = econData.find((item) => item.name === state)
        if (econDataItem) {
          const value = econDataItem[econContext.econ_indicator] ?? 0
          updatedColorMap.set(state, colorScale(value))
        }
      })
      setStateColorMap(updatedColorMap)
      // stuff here...
    }
  }, [econData, econContext, econDataIsLoading])

  const hoverLayer = new GeoJsonLayer({
    id: 'hover-layer',
    data: hoveredFeature ? [hoveredFeature] : [],
    pickable: false,
    stroked: true,
    filled: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: () => [0, 0, 0, 0], // Set fill color to white
    getLineColor: [0, 0, 0, 255],
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 30,
  })
  const mapKey = useMemo(() => {
    return Math.random().toString(36).substring(2)
  }, [stateColorMap])

  const layers = useMemo(() => {
    return [
      new GeoJsonLayer({
        id: 'geojson-layer',
        data,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: true,
        lineWidthScale: 20,
        lineWidthMinPixels: 2,
        getFillColor: (feature: any) => {
          const state = feature.properties.NAME
          return stateColorMap.get(state)
        },
        getLineColor: [0, 0, 0, 255],
        getRadius: 100,
        getLineWidth: 5,
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
  }, [stateColorMap, hoverLayer, econData])

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
      <MapComponent
        key={mapKey}
        layers={layers}
        darkStyle="DARK_MATTER"
        lightStyle="POSTIRON"
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
