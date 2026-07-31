import React, { useContext, useEffect, useRef, useState } from "react";
import "../DeliveryTemplates.css";
import "./DeliveryPanel.css";
import { StoreContext } from "../../context/StoreContext";
import { joinOrderRoom, sendLocation } from "../../services/socketService.js";
import axios from "axios";
import { toast } from "react-toastify";
import { validators } from "../../utils/validation";

const STATUS_STEPS = ["Assigned", "Picked", "Out for Delivery", "Delivered"];

const NEXT_STATUS = {
  Assigned: { status: "Picked", label: "Mark as Picked Up" },
  Picked: { status: "Out for Delivery", label: "Mark Out for Delivery" },
};

const statusBadgeClass = (status) => {
  if (status === "Picked") return "delivery-status-badge delivery-status-badge--picked";
  if (status === "Out for Delivery") return "delivery-status-badge delivery-status-badge--out";
  if (status === "Delivered") return "delivery-status-badge delivery-status-badge--delivered";
  return "delivery-status-badge delivery-status-badge--assigned";
};

const DeliveryPanel = () => {
  const { url, token } = useContext(StoreContext);
  const [deliveries, setDeliveries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [otpOrderId, setOtpOrderId] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
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
      const response = await axios.get(`${url}/api/delivery/my-deliveries`);

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

  const updateStatus = async (orderId, currentStatus, nextStatus) => {
    const expected = NEXT_STATUS[currentStatus];
    if (!expected || expected.status !== nextStatus) {
      toast.error("You can only advance to the next status.");
      return;
    }

    setUpdating(true);
    try {
      const response = await axios.post(
        `${url}/api/delivery/update-status`,
        { orderId, status: nextStatus }
      );

      if (response.data.success) {
        if (nextStatus === "Out for Delivery") {
          startLiveTracking(orderId);
        }
        toast.success(`Status updated to ${nextStatus}`);
        fetchMyDeliveries();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.log("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const requestDeliveryOtp = async (orderId, currentStatus) => {
    if (currentStatus !== "Out for Delivery") {
      toast.error("Complete prior steps before requesting OTP.");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/delivery/request-otp`,
        { orderId }
      );

      if (response.data.success) {
        setOtpOrderId(String(orderId));
        setOtpValue("");
        setOtpError("");
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
    const error = validators.otp(otpValue);
    setOtpError(error);
    if (error) {
      toast.error(error);
      return;
    }

    setOtpLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/delivery/verify-otp`,
        { orderId, otp: otpValue.trim() }
      );

      if (response.data.success) {
        stopLiveTracking();
        setOtpOrderId(null);
        setOtpValue("");
        setOtpError("");
        toast.success("Delivery completed");

        try {
          const availResponse = await axios.post(
            `${url}/api/delivery/update-available-true`,
            { available: true }
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

  const stepIndex = (status) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="delivery-panel-page">
      <div className="delivery-panel-card">
        <h1 className="delivery-heading">Delivery Panel</h1>
        {!errorMessage ? (
          <p className="delivery-panel-subtitle">
            Advance one step at a time — status moves forward only and cannot be
            undone.
          </p>
        ) : null}
        {errorMessage ? <p className="no-deliveries">{errorMessage}</p> : null}

        {!errorMessage && deliveries.length === 0 ? (
          <p className="no-deliveries">No assigned deliveries yet.</p>
        ) : (
          deliveries.map((delivery) => {
            const orderId = delivery.orderId?._id;
            const currentStatus = delivery.status;
            const isTracking = trackingOrderId === String(orderId);
            const showOtpInput = otpOrderId === String(orderId);
            const nextAction = NEXT_STATUS[currentStatus];
            const canRequestOtp = currentStatus === "Out for Delivery";
            const activeStep = stepIndex(currentStatus);

            return (
              <div className="delivery-order-card" key={delivery._id}>
                <div className="delivery-order-card__title">
                  <span>Active delivery</span>
                  <span className={statusBadgeClass(currentStatus)}>
                    {currentStatus}
                  </span>
                </div>

                <ol className="delivery-status-steps" aria-label="Delivery progress">
                  {STATUS_STEPS.map((step, index) => {
                    let state = "upcoming";
                    if (index < activeStep) state = "done";
                    else if (index === activeStep) state = "current";
                    return (
                      <li
                        key={step}
                        className={`delivery-status-step delivery-status-step--${state}`}
                      >
                        <span className="delivery-status-step__dot" />
                        <span className="delivery-status-step__label">{step}</span>
                      </li>
                    );
                  })}
                </ol>

                <div className="delivery-rows delivery-rows--panel">
                  <div className="delivery-row">
                    <span className="delivery-row__label">Order ID</span>
                    <span className="delivery-row__value">
                      {String(orderId ?? "—")}
                    </span>
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
                  {nextAction ? (
                    <button
                      type="button"
                      className="delivery-action-primary"
                      disabled={updating}
                      onClick={() =>
                        updateStatus(orderId, currentStatus, nextAction.status)
                      }
                    >
                      {updating ? "Updating..." : nextAction.label}
                    </button>
                  ) : null}

                  {canRequestOtp ? (
                    <button
                      type="button"
                      className="delivery-action-primary"
                      disabled={otpLoading}
                      onClick={() => requestDeliveryOtp(orderId, currentStatus)}
                    >
                      {otpLoading && showOtpInput
                        ? "Please wait..."
                        : "Mark Delivered (Request OTP)"}
                    </button>
                  ) : null}

                  {canRequestOtp ? (
                    <button
                      type="button"
                      className="delivery-action-secondary"
                      onClick={() =>
                        isTracking
                          ? stopLiveTracking()
                          : startLiveTracking(orderId)
                      }
                    >
                      {isTracking ? "Stop Live Tracking" : "Start Live Tracking"}
                    </button>
                  ) : null}
                </div>

                {showOtpInput ? (
                  <div className="delivery-otp-box">
                    <p>Enter the OTP shown on the customer&apos;s order</p>
                    <div className="delivery-otp-row">
                      <div className="form-field">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="6-digit OTP"
                          value={otpValue}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                            setOtpValue(value);
                            if (otpError) setOtpError(validators.otp(value));
                          }}
                          onBlur={(e) => setOtpError(validators.otp(e.target.value))}
                          className={otpError ? "field-invalid" : ""}
                        />
                        {otpError ? <p className="field-error">{otpError}</p> : null}
                      </div>
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
