import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./OrderTracking.css";
import Map from "../../components/Map/Map";
import OrderStatus from "../../components/OrderStatus/OrderStatus";
import { TrackingContext } from "../../context/TrackingContext";
import { StoreContext } from "../../context/StoreContext";
import {
    joinOrderRoom,
    listenOrderStatus,
    listenLocation,
    removeSocketListeners,
} from "../../services/socketService";

const OrderTracking = () => {
    const { orderId } = useParams();
    const { url } = useContext(StoreContext);
    const {
        setStatus,
        setLocation,
        setDestination,
        setEta,
        setDistance,
        location,
        destination,
        eta,
        distance,
    } = useContext(TrackingContext);

    useEffect(() => {
        if (!orderId) return;

        let cancelled = false;

        // Clear previous order's marker so refresh never shows a stale/random pin
        setLocation(null);
        setDestination(null);
        setEta(null);
        setDistance(null);

        const loadSavedTracking = async () => {
            try {
                const response = await axios.get(`${url}/api/delivery/live/${orderId}`);
                if (cancelled || !response.data.success) return;

                const data = response.data.data;
                if (data.status) setStatus(data.status);
                if (data.location) setLocation(data.location);
                if (data.destination) setDestination(data.destination);
                if (data.eta != null) setEta(data.eta);
                if (data.distance != null) setDistance(data.distance);
            } catch (error) {
                console.log("Could not load saved tracking:", error.message);
            }
        };

        loadSavedTracking();
        joinOrderRoom(orderId);

        listenOrderStatus((data) => {
            if (String(data.orderId) === String(orderId)) {
                setStatus(data.status);
            }
        });

        listenLocation((data) => {
            if (data.orderId && String(data.orderId) !== String(orderId)) return;

            if (data.lat != null && data.lng != null) {
                setLocation({ lat: data.lat, lng: data.lng });
            }
            if (data.destination) setDestination(data.destination);
            if (data.eta !== undefined) setEta(data.eta);
            if (data.distance !== undefined) setDistance(data.distance);
        });

        return () => {
            cancelled = true;
            removeSocketListeners();
        };
    }, [
        orderId,
        url,
        setStatus,
        setLocation,
        setDestination,
        setEta,
        setDistance,
    ]);

    const addressText = destination
        ? "Customer delivery address (marked D on map)"
        : null;

    return (
        <div className="order-tracking-page">
            <div className="order-tracking-card">
                <h1 className="tracking-heading">Track Your Order</h1>
                <p className="tracking-order-id">Order ID: {orderId}</p>

                <OrderStatus />
                <Map />

                <div className="live-tracking-info">
                    <h3>Live Delivery Info</h3>

                    {location ? (
                        <div className="location-box">
                            <p>
                                <strong>Agent latitude:</strong> {Number(location.lat).toFixed(5)}
                            </p>
                            <p>
                                <strong>Agent longitude:</strong> {Number(location.lng).toFixed(5)}
                            </p>
                            <p>
                                <strong>Distance left:</strong>{" "}
                                {distance != null ? `${distance} km` : "Calculating..."}
                            </p>
                            <p>
                                <strong>ETA:</strong>{" "}
                                {eta != null ? `${eta} mins` : "Calculating..."}
                            </p>
                            {addressText ? <p className="destination-hint">{addressText}</p> : null}
                        </div>
                    ) : (
                        <p className="waiting-text">
                            Waiting for live location updates from the delivery agent...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
