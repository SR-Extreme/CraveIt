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
    const [otpOrderId, setOtpOrderId] = useState(null);
    const [otpValue, setOtpValue] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
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
                toast.success("Status updated");
                fetchMyDeliveries();
            } else {
                toast.error(response.data.message || "Failed to update status");
            }
        } catch (error) {
            console.log("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const requestDeliveryOtp = async (orderId) => {
        setOtpLoading(true);
        try {
            const response = await axios.post(
                `${url}/api/delivery/request-otp`,
                { orderId },
                { headers: { token } }
            );

            if (response.data.success) {
                setOtpOrderId(String(orderId));
                setOtpValue("");
                toast.success(response.data.message || "OTP sent to customer");
            } else {
                toast.error(response.data.message || "Could not request OTP");
            }
        } catch (error) {
            toast.error("Could not request OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    const verifyDeliveryOtp = async (orderId) => {
        if (!otpValue.trim()) {
            toast.error("Enter the OTP from the customer");
            return;
        }

        setOtpLoading(true);
        try {
            const response = await axios.post(
                `${url}/api/delivery/verify-otp`,
                { orderId, otp: otpValue.trim() },
                { headers: { token } }
            );

            if (response.data.success) {
                stopLiveTracking();
                setOtpOrderId(null);
                setOtpValue("");
                toast.success("Delivery completed");

                try {
                    const availResponse = await axios.post(
                        `${url}/api/delivery/update-available-true`,
                        { available: true },
                        { headers: { token } }
                    );
                    if (availResponse.data.success) {
                        toast.success(availResponse.data.message);
                    }
                } catch (error) {
                    console.log(error);
                }

                fetchMyDeliveries();
            } else {
                toast.error(response.data.message || "Invalid OTP");
            }
        } catch (error) {
            toast.error("OTP verification failed");
        } finally {
            setOtpLoading(false);
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
                        const showOtpInput = otpOrderId === String(orderId);

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
                                            <span className="delivery-row__value">
                                                Live — sending location
                                            </span>
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
                                        disabled={otpLoading}
                                        onClick={() => requestDeliveryOtp(orderId)}
                                    >
                                        {otpLoading && showOtpInput
                                            ? "Please wait..."
                                            : "Mark Delivered (Request OTP)"}
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

                                {showOtpInput ? (
                                    <div className="delivery-otp-box">
                                        <p>Enter the OTP shown on the customer&apos;s order</p>
                                        <div className="delivery-otp-row">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                placeholder="6-digit OTP"
                                                value={otpValue}
                                                onChange={(e) => setOtpValue(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                disabled={otpLoading}
                                                onClick={() => verifyDeliveryOtp(orderId)}
                                            >
                                                Verify OTP
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DeliveryPanel;