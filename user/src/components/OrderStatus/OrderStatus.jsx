import React, { useContext } from 'react'
import "./OrderStatus.css";
import { useParams } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const OrderStatus = () => {
    const [status, setStatus] = useState("Food Processing");
    const { orderId } = useParams();
    const { url } = useContext(StoreContext);
    const [currentStepIndex, setcurrentStepIndex] = useState(0);

    const steps = [
        { key: "Food Processing", label: "Order Placed" },
        { key: "Assigned", label: "Assigned" },
        { key: "Picked", label: "Picked Up" },
        { key: "Out for Delivery", label: "Out for Delivery" },
        { key: "Delivered", label: "Delivered" },
    ];

    const updateTrackOrder = async () => {
        const response = await axios.post(url + "/api/order/trackorder", { orderId });
        if (response.data.success) {
            const latestStatus = response.data.data.status;
            setStatus(latestStatus);
            setcurrentStepIndex(steps.findIndex((step) => step.key === latestStatus));
        } else {
            toast.error("Error");
        }
    }

    useEffect(() => {
        updateTrackOrder();
    }, [])

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
            <button onClick={() => updateTrackOrder()}>Refresh Status</button>
        </div>
    );
}

export default OrderStatus