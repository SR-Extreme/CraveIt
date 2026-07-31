import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RatingStars from "../RatingStars/RatingStars";
import {
  joinOrderRoom,
  listenDeliveryOtp,
} from "../../services/socketService";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [otpByOrder, setOtpByOrder] = useState({});
  const [ratingByOrder, setRatingByOrder] = useState({});
  const [submittingRating, setSubmittingRating] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", {});

    if (response.data.success) {
      const orders = response.data.data || [];
      setData(orders);

      const otpMap = {};
      orders.forEach((order) => {
        if (order.deliveryOtp) {
          otpMap[order._id] = order.deliveryOtp;
        }
        joinOrderRoom(order._id);
      });
      setOtpByOrder((prev) => ({ ...prev, ...otpMap }));
    }
  };

  const updateTrackOrder = async (orderId) => {
    const response = await axios.post(url + "/api/order/trackorder", {
      orderId,
    });
    if (response.data.success) {
      const updatedOrders = data.map((order) =>
        order._id === orderId
          ? { ...order, status: response.data.data.status }
          : order
      );
      setData(updatedOrders);
      navigate(`/track-order/${orderId}`);
    } else {
      toast.error("Error");
    }
  };

  const handleRateOrder = async (orderId) => {
    const rating = ratingByOrder[orderId];
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingRating(orderId);
    try {
      const response = await axios.post(url + "/api/order/rate", {
        orderId,
        rating,
      });

      if (response.data.success) {
        toast.success("Thanks for your rating!");
        setData((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? { ...order, rated: true, rating }
              : order
          )
        );
      } else {
        toast.error(response.data.message || "Failed to submit rating");
      }
    } catch (error) {
      toast.error("Failed to submit rating");
    } finally {
      setSubmittingRating(null);
    }
  };

  const handleSkipRating = (orderId) => {
    setData((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, rated: true } : order
      )
    );
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  useEffect(() => {
    const unsubscribe = listenDeliveryOtp((payload) => {
      const orderId = payload?.orderId;
      if (!orderId) return;

      setOtpByOrder((prev) => ({
        ...prev,
        [orderId]: payload.deliveryOtp || null,
      }));

      if (!payload.deliveryOtp) {
        setData((prev) =>
          prev.map((order) =>
            String(order._id) === String(orderId)
              ? {
                ...order,
                status: "Delivered",
                deliveryOtp: null,
              }
              : order
          )
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {data.length === 0 ? (
        <div className="my-orders-empty">
          <div className="my-orders-empty-card">
            <h2>No orders yet</h2>
            <p>Looks like you haven&apos;t placed any orders.</p>
            <p className="my-orders-empty-subtitle">
              Browse the menu and enjoy your first meal with us.
            </p>
            <button className="my-orders-btn" onClick={() => navigate("/")}>
              Go to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="my-orders">
          <div className="my-orders-header">
            <h2>My Orders</h2>
            <p>Track deliveries, view OTPs, and rate your meals</p>
          </div>
          <div className="container">
            {data.map((order) => {
              const liveOtp = otpByOrder[order._id] || order.deliveryOtp;
              const showOtp =
                liveOtp &&
                order.status !== "Delivered" &&
                order.status !== "Food Processing";
              const showRating =
                order.status === "Delivered" && !order.rated;

              return (
                <div key={order._id} className="my-orders-order">
                  <div className="my-orders-main">
                    <img src={assets.parcel_icon} alt="" />
                    <p>
                      {order.items.map((item, index) => {
                        if (index === order.items.length - 1) {
                          return item.name + " x " + item.quantity;
                        }
                        return item.name + " x " + item.quantity + ", ";
                      })}
                    </p>
                    <p>₹{order.amount}.00</p>
                    <p>Items: {order.items.length}</p>
                    <p className="my-orders-status">
                      <span className="my-orders-status-dot">&#x25cf;</span>
                      <span className="my-orders-status-text">
                        {order.status}
                      </span>
                    </p>
                    <button
                      className="my-orders-btn my-orders-track-btn"
                      onClick={() => updateTrackOrder(order._id)}
                    >
                      Track Order
                    </button>
                  </div>

                  {showOtp && (
                    <div className="my-orders-otp">
                      <span>Delivery OTP</span>
                      <strong>{liveOtp}</strong>
                      <p>Share this OTP with the delivery agent</p>
                    </div>
                  )}

                  {showRating && (
                    <div className="my-orders-rating">
                      <p>Rate your order</p>
                      <RatingStars
                        value={ratingByOrder[order._id] || 0}
                        onChange={(value) =>
                          setRatingByOrder((prev) => ({
                            ...prev,
                            [order._id]: value,
                          }))
                        }
                      />
                      <div className="my-orders-rating-actions">
                        <button
                          type="button"
                          className="my-orders-btn"
                          disabled={submittingRating === order._id}
                          onClick={() => handleRateOrder(order._id)}
                        >
                          {submittingRating === order._id
                            ? "Submitting..."
                            : "Submit Rating"}
                        </button>
                        <button
                          type="button"
                          className="my-orders-skip-btn"
                          onClick={() => handleSkipRating(order._id)}
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  )}

                  {order.status === "Delivered" && order.rated && order.rating && (
                    <div className="my-orders-rated">
                      You rated this order {order.rating}/5
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;