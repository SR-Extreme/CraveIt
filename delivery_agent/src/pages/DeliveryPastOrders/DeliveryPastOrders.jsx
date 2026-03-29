import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../DeliveryTemplates.css";

const DeliveryPastOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
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

  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === "Delivered"),
    [orders]
  );

  return (
    <section className="delivery-template">
      <h2>Past Orders History</h2>
      <p>Completed deliveries are shown here.</p>
      <div className="delivery-list delivery-list--history">
        {completedOrders.length === 0 ? (
          <div className="delivery-card delivery-card--empty">No completed deliveries yet.</div>
        ) : (
          completedOrders.map((order) => {
            const isOpen = expandedOrderId === order._id;
            const oid = order.orderId?._id;
            return (
              <div className="delivery-past-order-block" key={order._id}>
                <div className="delivery-card">
                  <h3 className="delivery-card__title">Order</h3>
                  <div className="delivery-rows">
                    <div className="delivery-row">
                      <span className="delivery-row__label">Order ID</span>
                      <span className="delivery-row__value">{String(oid ?? "—")}</span>
                    </div>
                    <div className="delivery-row">
                      <span className="delivery-row__label">Status</span>
                      <span className="delivery-row__value">{order.status}</span>
                    </div>
                    {isOpen && (
                      <>
                        <div className="delivery-row">
                          <span className="delivery-row__label">Address</span>
                          <span className="delivery-row__value">
                            {order.orderId?.address
                              ? `${order.orderId.address.street}, ${order.orderId.address.city}, ${order.orderId.address.state} - ${order.orderId.address.zipcode}, ${order.orderId.address.country}`
                              : "—"}
                          </span>
                        </div>
                        <div className="delivery-row">
                          <span className="delivery-row__label">Amount</span>
                          <span className="delivery-row__value">
                            {order.orderId?.amount != null ? `₹${order.orderId.amount}` : "—"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="delivery-card__footer">
                    <button
                      type="button"
                      className="delivery-btn delivery-btn--secondary"
                      onClick={() => setExpandedOrderId(isOpen ? null : order._id)}
                    >
                      {isOpen ? "Hide details" : "Show details"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default DeliveryPastOrders;
