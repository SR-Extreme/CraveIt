import React, { useContext, useEffect, useRef } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { TrackingContext } from "../../context/TrackingContext";
import "./Map.css";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
    width: "100%",
    height: "400px",
};

const Map = () => {
    const { location, destination } = useContext(TrackingContext);
    const mapRef = useRef(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    const hasAgent = location?.lat != null && location?.lng != null;
    const hasDestination = destination?.lat != null && destination?.lng != null;
    const center = hasAgent
        ? location
        : hasDestination
          ? destination
          : null;

    useEffect(() => {
        if (!mapRef.current || !hasAgent) return;
        mapRef.current.panTo(location);
    }, [location, hasAgent]);

    if (!isLoaded) {
        return <div className="map-loading">Loading Map...</div>;
    }

    if (!center) {
        return (
            <div className="map-loading">
                Waiting for delivery agent location...
            </div>
        );
    }

    return (
        <div className="map-wrapper">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
            >
                {hasAgent && (
                    <Marker
                        position={location}
                        title="Delivery agent"
                    />
                )}
                {hasDestination && (
                    <Marker
                        position={destination}
                        title="Delivery address"
                        label="D"
                    />
                )}
            </GoogleMap>
        </div>
    );
};

export default Map;
