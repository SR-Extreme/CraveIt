import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../DeliveryTemplates.css";

const DeliveryCurrentOrders = () => {
  const [orders, setOrders] = useState([]);
  const url = "http://localhost:4000";
  const token = localStorage.getItem("delivery_token");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      const response = await axios.get(`${url}/api/delivery/my-deliveries`, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    };
    fetchOrders();
  }, [token]);

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
          <div className="delivery-card delivery-card--empty">No active orders right now.</div>
        ) : (
          activeOrders.map((order) => (
            <div className="delivery-card" key={order._id}>
              <h3 className="delivery-card__title">Active order</h3>
              <div className="delivery-rows">
                <div className="delivery-row">
                  <span className="delivery-row__label">Order ID</span>
                  <span className="delivery-row__value">{String(order.orderId?._id ?? "—")}</span>
                </div>
                <div className="delivery-row">
                  <span className="delivery-row__label">Status</span>
                  <span className="delivery-row__value">{order.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default DeliveryCurrentOrders;
