import React, { useContext, useEffect, useState } from 'react'
import "../DeliveryTemplates.css"
import "./DeliveryPanel.css"
import { StoreContext } from '../../context/StoreContext'
import { sendLocation } from '../../services/socketService.js';
import axios from 'axios';
import { toast } from 'react-toastify'

const DeliveryPanel = () => {

    const { url, token } = useContext(StoreContext);
    const [deliveries, setDeliveries] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchMyDeliveries = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${url}/api/delivery/my-deliveries`, {
                headers: { token }
            });

            if (response.data.success) {
                const orders = response.data.data.filter(order => order.status !== "Delivered");
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
                if (status === "Delivered") {
                    try {
                        const availResponse = await axios.post(`${url}/api/delivery/update-available`, { available: true }, { headers: { token: token } });
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
        if (!navigator.geolocation) {
            alert("Geolocation is not supported in this browser.");
            return;
        }

        navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                sendLocation({ orderId, lat, lng });
            },
            (error) => {
                console.log("Location error:", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000,
            }
        );
    };

    useEffect(() => {
        fetchMyDeliveries();
    }, [token]);

    return (
        <div className="delivery-panel-page">
            <div className="delivery-panel-card">
                <h1 className="delivery-heading">Delivery Panel</h1>
                {!errorMessage ? (
                    <p className="delivery-panel-subtitle">Manage your active assignment — one delivery at a time.</p>
                ) : null}
                {errorMessage ? <p className="no-deliveries">{errorMessage}</p> : null}

                {!errorMessage && deliveries.length === 0 ? (
                    <p className="no-deliveries">No assigned deliveries yet.</p>
                ) : (
                    deliveries.map((delivery) => (
                        <div className="delivery-order-card" key={delivery._id}>
                            <h3 className="delivery-order-card__title">Active delivery</h3>
                            <div className="delivery-rows delivery-rows--panel">
                                <div className="delivery-row">
                                    <span className="delivery-row__label">Order ID</span>
                                    <span className="delivery-row__value">{String(delivery.orderId?._id ?? "—")}</span>
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
                            </div>

                            <div className="delivery-actions">
                                <button type="button" onClick={() => updateStatus(delivery.orderId?._id, "Picked")}>
                                    Picked Up
                                </button>

                                <button type="button" onClick={() => updateStatus(delivery.orderId?._id, "Out for Delivery")}>
                                    Out for Delivery
                                </button>

                                <button type="button" onClick={() => updateStatus(delivery.orderId?._id, "Delivered")}>
                                    Delivered
                                </button>

                                <button type="button" onClick={() => startLiveTracking(delivery.orderId?._id)}>
                                    Start Live Tracking
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DeliveryPanel;
