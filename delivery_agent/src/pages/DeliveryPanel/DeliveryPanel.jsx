import React, { useContext, useEffect, useRef, useState } from "react";
import "../DeliveryTemplates.css";
import "./DeliveryPanel.css";
import { StoreContext } from "../../context/StoreContext";
import { joinOrderRoom, sendLocation } from "../../services/socketService.js";
import axios from "axios";
import { toast } from "react-toastify";

const DeliveryPanel = () => {
    const { url, token } = useContext(StoreContext);
    const [deliveries, setDeliveries] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [trackingOrderId, setTrackingOrderId] = useState(null);
    const watchIdRef = useRef(null);

    const stopLiveTracking = () => {
        if (watchIdRef.current != null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setTrackingOrderId(null);
    };

    const fetchMyDeliveries = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${url}/api/delivery/my-deliveries`, {
                headers: { token },
            });

            if (response.data.success) {
                const orders = response.data.data.filter(
                    (order) => order.status !== "Delivered"
                );
                setDeliveries(orders);
                setErrorMessage("");
            } else {
                setErrorMessage(response.data.message || "Could not fetch deliveries.");
            }
        } catch (error) {
            console.log("Error fetching deliveries:", error);
            setErrorMessage("Network/server error while fetching deliveries.");
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            const response = await axios.post(
                `${url}/api/delivery/update-status`,
                { orderId, status },
                { headers: { token } }
            );

            if (response.data.success) {
                if (status === "Out for Delivery") {
                    startLiveTracking(orderId);
                }

                if (status === "Delivered") {
                    stopLiveTracking();
                    try {
                        const availResponse = await axios.post(
                            `${url}/api/delivery/update-available-true`,
                            { available: true },
                            { headers: { token } }
                        );
                        if (availResponse.data.success) {
                            toast.success(availResponse.data.message);
                        } else {
                            toast.error(availResponse.data.message);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                fetchMyDeliveries();
            }
        } catch (error) {
            console.log("Error updating status:", error);
        }
    };

    const startLiveTracking = (orderId) => {
        if (!orderId) return;

        if (!navigator.geolocation) {
            alert("Geolocation is not supported in this browser.");
            return;
        }

        stopLiveTracking();
        joinOrderRoom(orderId);
        setTrackingOrderId(String(orderId));

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                sendLocation({
                    orderId,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.log("[Location] Geolocation error:", error.message);
                toast.error("Could not get your location. Allow location access.");
            },
            {
                enableHighAccuracy: true,
                maximumAge: 2000,
                timeout: 10000,
            }
        );

        toast.success("Live tracking started");
    };

    useEffect(() => {
        fetchMyDeliveries();
        return () => stopLiveTracking();
    }, [token]);

    return (
        <div className="delivery-panel-page">
            <div className="delivery-panel-card">
                <h1 className="delivery-heading">Delivery Panel</h1>
                {!errorMessage ? (
                    <p className="delivery-panel-subtitle">
                        Manage your active assignment — one delivery at a time.
                    </p>
                ) : null}
                {errorMessage ? <p className="no-deliveries">{errorMessage}</p> : null}

                {!errorMessage && deliveries.length === 0 ? (
                    <p className="no-deliveries">No assigned deliveries yet.</p>
                ) : (
                    deliveries.map((delivery) => {
                        const orderId = delivery.orderId?._id;
                        const isTracking = trackingOrderId === String(orderId);

                        return (
                            <div className="delivery-order-card" key={delivery._id}>
                                <h3 className="delivery-order-card__title">Active delivery</h3>
                                <div className="delivery-rows delivery-rows--panel">
                                    <div className="delivery-row">
                                        <span className="delivery-row__label">Order ID</span>
                                        <span className="delivery-row__value">
                                            {String(orderId ?? "—")}
                                        </span>
                                    </div>
                                    <div className="delivery-row">
                                        <span className="delivery-row__label">Status</span>
                                        <span className="delivery-row__value">{delivery.status}</span>
                                    </div>
                                    <div className="delivery-row">
                                        <span className="delivery-row__label">Customer address</span>
                                        <span className="delivery-row__value">
                                            {delivery.orderId?.address
                                                ? `${delivery.orderId.address.street}, ${delivery.orderId.address.city}`
                                                : "—"}
                                        </span>
                                    </div>
                                    {isTracking ? (
                                        <div className="delivery-row">
                                            <span className="delivery-row__label">Tracking</span>
                                            <span className="delivery-row__value">Live — sending location</span>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="delivery-actions">
                                    <button
                                        type="button"
                                        onClick={() => updateStatus(orderId, "Picked")}
                                    >
                                        Picked Up
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateStatus(orderId, "Out for Delivery")}
                                    >
                                        Out for Delivery
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateStatus(orderId, "Delivered")}
                                    >
                                        Delivered
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            isTracking
                                                ? stopLiveTracking()
                                                : startLiveTracking(orderId)
                                        }
                                    >
                                        {isTracking ? "Stop Live Tracking" : "Start Live Tracking"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DeliveryPanel;
