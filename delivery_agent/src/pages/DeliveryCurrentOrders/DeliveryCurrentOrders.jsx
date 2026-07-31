import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "../DeliveryTemplates.css";

const statusBadgeClass = (status) => {
  if (status === "Picked") return "delivery-status-badge delivery-status-badge--picked";
  if (status === "Out for Delivery") return "delivery-status-badge delivery-status-badge--out";
  if (status === "Delivered") return "delivery-status-badge delivery-status-badge--delivered";
  return "delivery-status-badge delivery-status-badge--assigned";
};

const DeliveryCurrentOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      const response = await axios.get(`${url}/api/delivery/my-deliveries`);
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    };
    fetchOrders();
  }, [token, url]);

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== "Delivered"),
    [orders]
  );

  return (
    <section className="delivery-template">
      <h2>Current Orders</h2>
      <p>Orders that are assigned and in progress.</p>
      <div className="delivery-list delivery-list--single">
        {activeOrders.length === 0 ? (
          <div className="delivery-card delivery-card--empty">
            No active orders right now.
          </div>
        ) : (
          activeOrders.map((order) => (
            <div className="delivery-card" key={order._id}>
              <div className="delivery-card__title">
                <span>Active order</span>
                <span className={statusBadgeClass(order.status)}>
                  {order.status}
                </span>
              </div>
              <div className="delivery-rows">
                <div className="delivery-row">
                  <span className="delivery-row__label">Order ID</span>
                  <span className="delivery-row__value">
                    {String(order.orderId?._id ?? "—")}
                  </span>
                </div>
                <div className="delivery-row">
                  <span className="delivery-row__label">Address</span>
                  <span className="delivery-row__value">
                    {order.orderId?.address
                      ? `${order.orderId.address.street}, ${order.orderId.address.city}`
                      : "—"}
                  </span>
                </div>
              </div>
              <div className="delivery-card__footer">
                <Link to="/delivery-panel" className="delivery-btn">
                  Manage delivery
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default DeliveryCurrentOrders;
