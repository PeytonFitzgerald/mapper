import React, {
  useState,
  useMemo,
  useContext,
  createContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import { GeoJsonLayer } from 'deck.gl/typed'
import { Map as MapComponent } from '@/components/common/charts/Map'
import { api } from '@/utils/api'
import { EmptyStateWrapper } from '@/components/common/EmptyStateWrapper'
import { FeatureCollectionType } from '@/types/GeoJson'
import { createColorMap } from './calculations'
import { USEconSelector } from '@/types/Econ'
import { createColorScale } from './calculations'
import { geoCentroid } from 'd3-geo'
import { USEcon } from '@prisma/client'
import DropdownMenuComponent from './components/states/Dropdown'
import HoveredStateInfo from './components/states/Hover'
import ClickedStateInfo from './components/states/ClickedStateInfo'
import { useStateColorMap } from './hooks/useStateColorMap'
interface StateType {
  year: number
  econ_indicator: USEconSelector
}
type ActionType =
  | { type: 'SET_YEAR'; year: number }
  | { type: 'SET_INDICATOR'; econ_indicator: USEconSelector }
const initialState: StateType = {
  year: 2020,
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

export interface EconIndicatorLookup {
  name: string
  key: USEconSelector
}

const createLayers = (
  geoData: FeatureCollectionType,
  stateColorMap: Map<string, number[]>,
  hoverLayer: GeoJsonLayer,
  econData: USEcon[] | undefined,
  onFeatureClick: (info: any, event: any) => void,
  onFeatureHover: (info: any) => void
) => {
  return [
    new GeoJsonLayer({
      id: 'geojson-layer',
      data: geoData,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: (feature: any) => {
        const state = feature.properties.NAME
        const color = stateColorMap.get(state)
        if (color) {
          return color as [number, number, number, number]
        }
        return [0, 0, 0, 0]
      },
      getLineColor: [0, 0, 0, 255],
      getRadius: 100,
      getLineWidth: 5,
      getElevation: 30,
      onClick: onFeatureClick,
      onHover: onFeatureHover,
    }),
    hoverLayer,
  ]
}
// Main dashboard hub
const Dashboard = ({ geoData }: { geoData: FeatureCollectionType }) => {
  const econContext = useContext(EconContext)

  const econContextDispatch = useContext(EconDispatchContext)
  if (!econContext || !econContextDispatch) {
    return null
  }
  const data = geoData
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredStateInfo, setHoveredStateInfo] = useState<null | USEcon>(null)
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [stateColorMap, setStateColorMap] = useState(
    createColorMap(data.features)
  )
  const [clickedStateInfo, setClickedStateInfo] = useState<null | USEcon>(null)
  const [clickedStateCentroid, setClickedStateCentroid] = useState<
    [number, number] | null
  >(null)

  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null)

  const clickedStateDivRef = useRef<HTMLDivElement | null>(null)

  const handleChange = (indicatorLookup: EconIndicatorLookup) => {
    econContextDispatch({
      type: 'SET_INDICATOR',
      econ_indicator: indicatorLookup.key,
    })
  }

  const { data: econData, isLoading } =
    api.stateRouter.getAllEconDataByYear.useQuery({
      year: econContext.year ?? 2021,
    })

  useEffect(() => {
    if (econData) {
      const colorScale = createColorScale(econData, econContext.econ_indicator)
      const updatedColorMap = new Map(stateColorMap)
      geoData.features.forEach((feature) => {
        const state = feature.properties.NAME
        const econDataItem = econData.find((item) => item.name === state)
        if (econDataItem) {
          const value = econDataItem[econContext.econ_indicator] ?? 0
          updatedColorMap.set(state, colorScale(value))
        }
      })
      setStateColorMap(updatedColorMap)
    }
  }, [econData, econContext.econ_indicator])

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

  const handleCloseClick = () => {
    setClickedStateInfo(null)
  }

  const layers = useMemo(() => {
    return createLayers(
      geoData,
      stateColorMap,
      hoverLayer,
      econData,
      (info) => {
        if (info.object && econData) {
          const state = info.object.properties.NAME
          const econDataItem = econData.find((item) => item.name === state)
          if (econDataItem) {
            setClickedStateInfo(econDataItem)

            const centroid = geoCentroid(info.object)
            setClickedStateCentroid(centroid)
            if (
              mapInstance &&
              clickedStateCentroid &&
              clickedStateDivRef.current
            ) {
              const [lng, lat] = clickedStateCentroid
              const divCoords = mapInstance.project([lng, lat])

              clickedStateDivRef.current.style.left = `${divCoords.x}px`
              clickedStateDivRef.current.style.top = `${divCoords.y}px`
            }
          }
        } else {
          setClickedStateInfo(null)
          setClickedStateCentroid(null)
        }
      },
      (info) => {
        setHoveredFeature(info.object)
        if (info.object && econData) {
          setMousePosition({ x: info.x, y: info.y })
          const state = info.object.properties.NAME
          const econDataItem = econData.find((item) => item.name === state)
          if (econDataItem) {
            setHoveredStateInfo({ ...econDataItem })
          }
        } else {
          setHoveredStateInfo(null)
        }
      }
    )
  }, [stateColorMap, hoverLayer, econData])

  const DropdownMenu = () => {
    return (
      <div className="relative left-4 top-4">
        <DropdownMenuComponent
          econIndicators={econIndicators}
          handleChange={handleChange}
        />
      </div>
    )
  }
  return (
    <div className="h-screen w-screen">
      <DropdownMenu />

      <HoveredStateInfo
        hoveredStateInfo={hoveredStateInfo}
        mousePosition={mousePosition}
      />

      <ClickedStateInfo
        clickedStateInfo={clickedStateInfo}
        handleCloseClick={handleCloseClick}
      />
      <MapComponent
        key={mapKey}
        layers={layers}
        darkStyle="DARK_MATTER"
        lightStyle="POSTIRON"
        onMapLoad={(map: maplibregl.Map) => setMapInstance(map)}
      />
    </div>
  )
}

const econIndicators: EconIndicatorLookup[] = [
  { name: 'Real GDP', key: 'real_gdp' },
  { name: 'Real Personal Income', key: 'real_personal' },
  { name: 'Real PCE', key: 'real_pce' },
  { name: 'Current Dollar GDP', key: 'current_gdp' },
  { name: 'Current Dollar Personal Income', key: 'personal_income' },
  { name: 'Current Dollar Disposable Income', key: 'disposable_income' },
  {
    name: 'Current Dollar Personal Consumption',
    key: 'personal_consumption',
  },
  {
    name: 'Real Per Capita Personal Income',
    key: 'real_per_capita_personal_income',
  },
  { name: 'Real Per Capita PCE', key: 'real_per_capita_pce' },
  {
    name: 'Current Dollar Per Capita Personal Income',
    key: 'current_per_capita_personal_income',
  },
  {
    name: 'Current Dollar Per Capita Disposable Income',
    key: 'current_per_capita_disposable_income',
  },
  { name: 'RPP', key: 'rpp' },
  {
    name: 'Implicit Regional Price Deflator',
    key: 'implicit_regional_price_deflator',
  },
  { name: 'Employment', key: 'employment' },
]

/* What to load if geographic data for the US is not available for some reason */
const EmptyStateDashboard = () => {
  return (
    <div className="mx-auto flex w-1/3 flex-col items-center justify-center gap-8">
      <div className="text-2xl">Error loading data</div>
    </div>
  )
}

export default DashboardScreen
