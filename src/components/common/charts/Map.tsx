import React from 'react'
import StaticMap from 'react-map-gl'
import DeckGL, { GeoJsonLayer } from 'deck.gl/typed'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useTheme } from 'next-themes'

const INITIAL_VIEW_STATE = {
  latitude: 39.82,
  longitude: -98,
  zoom: 4,
  bearing: 0,
  //pitch: 70
}

interface MapProps {
  layers: GeoJsonLayer[]
  updateTriggers: any
  key: string
  darkStyle: 'POSTIRON' | 'DARK_MATTER' | 'VOYAGER'
  lightStyle: 'POSTIRON' | 'DARK_MATTER' | 'VOYAGER'
}

export const Map = ({ layers, darkStyle, lightStyle }: MapProps) => {
  const { theme } = useTheme()
  return (
    <>
      <div className="border-3 h-[100%] w-[100%] border-black">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
          style={{ position: 'relative' }}
        >
          <StaticMap
            initialViewState={INITIAL_VIEW_STATE}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            mapLib={maplibregl}
            style={{
              width: 'fit-content',
              height: 'fit-content',
              position: 'relative',
            }}
          />
        </DeckGL>
      </div>
    </>
  )
}
