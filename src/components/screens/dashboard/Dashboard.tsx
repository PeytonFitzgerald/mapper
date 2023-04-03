import { useState } from 'react';
import dynamic from 'next/dynamic';
import { GeoJsonLayer} from 'deck.gl/typed'
import { Map } from "~/components/common/charts/Map"
import * as data from '~/server/temp_data/data.json'


const DashboardScreen = () => {
    const [selectedCounty, selectCounty] = useState(null);

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
            getFillColor: [160, 160, 180, 200],
            getLineColor: [0, 0, 0, 255],
            getRadius: 100,
            getLineWidth: 1,
            getElevation: 30,
        }),
    ];

    return (
        <div className="h-screen w-screen">
            <Map layers={layers} darkStyle="DARK_MATTER" lightStyle="POSTIRON" />
        </div>
    );
};

export default DashboardScreen;