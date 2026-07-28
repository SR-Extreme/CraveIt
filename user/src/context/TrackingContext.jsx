import { createContext, useState } from "react";

export const TrackingContext = createContext(null);

const TrackingContextProvider = (props) => {
    const [status, setStatus] = useState("Food Processing");
    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [eta, setEta] = useState(null);
    const [distance, setDistance] = useState(null);

    const contextValue = {
        status,
        setStatus,
        location,
        setLocation,
        destination,
        setDestination,
        eta,
        setEta,
        distance,
        setDistance,
    };

    return (
        <TrackingContext.Provider value={contextValue}>
            {props.children}
        </TrackingContext.Provider>
    );
};

export default TrackingContextProvider;
