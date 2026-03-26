import React, { useContext, useEffect, useState } from 'react'
import "./DeliveryPanel.css"
import { StoreContext } from '../../context/StoreContext'
import { sendLocation } from '../../services/socketService.js';
import axios from 'axios';

const DeliveryPanel = () => {

    const { url, token } = useContext(StoreContext);
    const [deliveries, setDeliveries] = useState([]);

    const fetchMyDeliveries = async () => {
        try {
            const response = await axios.get(`${url}/api/delivery/my-deliveries`, {
                headers: { token }
            });

            if (response.data.success) {
                setDeliveries(response.data.data);
            }
        } catch (error) {
            console.log("Error fetching deliveries:", error);
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
    }, []);

    return (
        <div className="delivery-panel-page">
            <div className="delivery-panel-card">
                <h1 className="delivery-heading">Delivery Panel</h1>

                {deliveries.length === 0 ? (
                    <p className="no-deliveries">No assigned deliveries yet.</p>
                ) : (
                    deliveries.map((delivery) => (
                        <div className="delivery-order-card" key={delivery._id}>
                            <h3>Order ID: {delivery.orderId?._id}</h3>
                            <p><strong>Status:</strong> {delivery.status}</p>
                            <p><strong>Customer Address:</strong> {delivery.orderId?.address?.street}, {delivery.orderId?.address?.city}</p>

                            <div className="delivery-actions">
                                <button onClick={() => updateStatus(delivery.orderId?._id, "picked")}>
                                    Picked Up
                                </button>

                                <button onClick={() => updateStatus(delivery.orderId?._id, "on_the_way")}>
                                    Out for Delivery
                                </button>

                                <button onClick={() => updateStatus(delivery.orderId?._id, "delivered")}>
                                    Delivered
                                </button>

                                <button onClick={() => startLiveTracking(delivery.orderId?._id)}>
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