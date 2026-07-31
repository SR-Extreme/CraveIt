import React, { useContext, useEffect } from "react";
import "./OrderStatus.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { TrackingContext } from "../../context/TrackingContext";

const steps = [
    { key: "Food Processing", label: "Order Placed" },
    { key: "Assigned", label: "Assigned" },
    { key: "Picked", label: "Picked Up" },
    { key: "Out for Delivery", label: "Out for Delivery" },
    { key: "Delivered", label: "Order Delivered" },
];

const OrderStatus = () => {
    const { orderId } = useParams();
    const { url } = useContext(StoreContext);
    const { status, setStatus } = useContext(TrackingContext);

    const matchedStepIndex = steps.findIndex((step) => step.key === status);
    const currentStepIndex = matchedStepIndex >= 0 ? matchedStepIndex : 0;
    const currentStatusLabel =
        status === "Delivered"
            ? "Order Delivered"
            : steps[matchedStepIndex]?.label || status || "Unknown";

    const updateTrackOrder = async () => {
        try {
            const response = await axios.post(`${url}/api/order/trackorder`, { orderId });
            if (response.data.success && response.data.data?.status) {
                setStatus(response.data.data.status);
            }
        } catch (error) {
            console.log("Error fetching order status:", error.message);
        }
    };

    useEffect(() => {
        updateTrackOrder();
    }, [orderId]);

    return (
        <div className="order-status-container">
            <h2 className="order-status-title">Order Status</h2>

            <div className="order-status-steps">
                {steps.map((step, index) => (
                    <div
                        key={step.key}
                        className={`status-step ${index <= currentStepIndex ? "active" : ""}`}
                    >
                        <div className="status-circle">{index + 1}</div>
                        <p className="status-label">{step.label}</p>
                    </div>
                ))}
            </div>

            <p className="current-status-text">
                Current Status: <span>{currentStatusLabel}</span>
            </p>
            <button type="button" onClick={updateTrackOrder}>
                Refresh Status
            </button>
        </div>
    );
};

export default OrderStatus;
