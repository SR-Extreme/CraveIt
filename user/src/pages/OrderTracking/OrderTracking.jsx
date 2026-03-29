import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./OrderTracking.css";
import Map from "../../components/Map/Map";

import { TrackingContext } from "../../context/TrackingContext";
import {
    joinOrderRoom,
    listenOrderStatus,
    listenLocation,
    removeSocketListeners,
} from "../../services/socketService";

import OrderStatus from "../../components/OrderStatus/OrderStatus";

const OrderTracking = () => {
    const { orderId } = useParams();
    const { setStatus, setLocation, setEta, location, eta } = useContext(TrackingContext);

    useEffect(() => {
        if (!orderId) return;

        joinOrderRoom(orderId);

        listenOrderStatus((data) => {
            if (data.orderId === orderId) {
                setStatus(data.status);
            }
        });

        listenLocation((data) => {
            setLocation({
                lat: data.lat,
                lng: data.lng,
            });

            if (data.eta !== undefined) {
                setEta(data.eta);
            }
        });

        return () => {
            removeSocketListeners();
        };
    }, [orderId, setStatus, setLocation, setEta]);

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
                            <p><strong>Latitude:</strong> {location.lat}</p>
                            <p><strong>Longitude:</strong> {location.lng}</p>
                            <p><strong>ETA:</strong> {eta !== null ? `${eta} mins` : "Calculating..."}</p>
                        </div>
                    ) : (
                        <p className="waiting-text">Waiting for live location updates...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;