import React, { useEffect, useState } from "react";
import "./Assignment.css";
import axios from "axios";
import { toast } from "react-toastify";

const formatAddress = (address = {}) => {
  const line1 = address.street || "";
  const line2 = [address.city, address.state, address.country, address.zipcode]
    .filter(Boolean)
    .join(", ");
  return [line1, line2].filter(Boolean).join(", ") || "Address unavailable";
};

const Assignment = ({ url }) => {
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);


  const selectedOrderData = orders.find((order) => order._id === selectedOrder);
  const selectedAgentData = agents.find((agent) => agent._id === selectedAgent);

  const handleAssign = async () => {
    if (!selectedAgent || !selectedOrder) {
      toast.error("Select both an order and a delivery agent");
      return;
    }

    try {
      const response = await axios.post(
        url + "/api/delivery/assign",
        { orderId: selectedOrder, deliveryPartnerId: selectedAgent }
      );

      if (response.data.success) {
        const availResponse = await axios.post(
          url + "/api/delivery/update-available-false",
          {
            deliveryId: response.data.data.deliveryPartnerId,
            available: false,
          }
        );

        const updateResponse = await axios.post(
          url + "/api/order/status",
          { orderId: response.data.data.orderId, status: "Assigned" }
        );

        if (availResponse.data.success && updateResponse.data.success) {
          const orderName = selectedOrderData
            ? `${selectedOrderData.address?.firstName || ""} ${selectedOrderData.address?.lastName || ""}`.trim()
            : selectedOrder;
          const agentName = selectedAgentData?.name || selectedAgent;
          fetchData();
          toast.success(`Order for ${orderName} assigned to ${agentName}`);
          setSelectedAgent("");
          setSelectedOrder("");
        }
      } else {
        toast.error(response.data.message || "Assignment failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error assigning order");
    }
  };

  const fetchData = async () => {
    try {
      const userResponse = await axios.get(url + "/api/user/getallusers");

      if (userResponse.data.success) {
        const newUsers = userResponse.data.data.filter(
          (user) => user.role === "delivery" && user.available
        );
        setAgents(newUsers);
      }

      const orderResponse = await axios.get(url + "/api/order/list");

      if (orderResponse.data.success) {
        const newOrders = orderResponse.data.data.filter(
          (order) => order.status === "Food Processing"
        );
        setOrders(newOrders);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading assignment data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="assignment-page">
      <div className="assignment-header">
        <h2>Assign Orders</h2>
        <p>Match pending orders with available delivery agents</p>
      </div>

      <div className="assignment-box">
        <div className="assignment-selected">
          <span className="assignment-selected-label">Order</span>
          <span className="assignment-selected-value">
            {selectedOrderData
              ? `${selectedOrderData.address?.firstName || ""} ${selectedOrderData.address?.lastName || ""}`.trim() ||
                selectedOrder
              : "Select an order"}
          </span>
        </div>

        <span className="assign-text">assigned to</span>

        <div className="assignment-selected">
          <span className="assignment-selected-label">Agent</span>
          <span className="assignment-selected-value">
            {selectedAgentData?.name || "Select an agent"}
          </span>
        </div>

        <button className="assign-btn" onClick={handleAssign}>
          Assign
        </button>
      </div>

      <div className="assignment-lists">
        <div className="assignment-list">
          <h3>Orders</h3>
          <div className="assignment-scroll">
            {orders.length === 0 && (
              <p className="assignment-empty">No orders to be Assigned</p>
            )}
            {orders.map((order) => {
              const customerName =
                `${order.address?.firstName || ""} ${order.address?.lastName || ""}`.trim() ||
                "Unknown customer";
              return (
                <div
                  key={order._id}
                  className={`assignment-card ${selectedOrder === order._id ? "selected" : ""}`}
                  onClick={() => setSelectedOrder(order._id)}
                >
                  <p className="assignment-card-id">
                    <span>Order ID</span>
                    {order._id}
                  </p>
                  <p className="assignment-card-name">{customerName}</p>
                  <p className="assignment-card-meta">{formatAddress(order.address)}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="assignment-list">
          <h3>Delivery Agents</h3>
          <div className="assignment-scroll">
            {agents.length === 0 && (
              <p className="assignment-empty">No available agents</p>
            )}
            {agents.map((agent) => (
              <div
                key={agent._id}
                className={`assignment-card ${selectedAgent === agent._id ? "selected" : ""}`}
                onClick={() => setSelectedAgent(agent._id)}
              >
                <p className="assignment-card-id">
                  <span>Agent ID</span>
                  {agent._id}
                </p>
                <p className="assignment-card-name">{agent.name}</p>
                <p className="assignment-card-meta">{agent.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
