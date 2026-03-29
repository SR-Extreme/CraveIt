import React, { useContext, useMemo } from 'react'
import { TrackingContext } from '../../context/TrackingContext';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "./Map.css";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
    width: "100%",
    height: "400px",
};

const Map = () => {

    const { location } = useContext(TrackingContext);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    const center = useMemo(() => {
        return location || { lat: 28.6139, lng: 77.2090 };
    }, [location]);

    if (!isLoaded) {
        return <div className='map-loading'>Loading Map...</div>;
    }

    return (
        <div className="map-wrapper">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
            >
                {location && <Marker position={location} />}
            </GoogleMap>
        </div>
    );
};

export default Map;