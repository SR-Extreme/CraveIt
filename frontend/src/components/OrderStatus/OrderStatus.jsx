import React, { useContext } from 'react'
import "./OrderStatus.css";
import { TrackingContext } from '../../context/TrackingContext';

const OrderStatus = () => {
    const { status } = useContext(TrackingContext);

    const steps = [
        { key: "Food Processing", label: "Order Placed" },
        { key: "Assigned", label: "Assigned" },
        { key: "Picked", label: "Picked Up" },
        { key: "Out for Delivery", label: "On The Way" },
        { key: "Delivered", label: "Delivered" },
    ];

    const currentStepIndex = steps.findIndex((step) => step.key === status);

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
                Current Status: <span>{steps[currentStepIndex]?.label || "Unknown"}</span>
            </p>
        </div>
    );
}

export default OrderStatus