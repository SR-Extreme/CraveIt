import React, { useEffect, useState } from "react";
import "./Assignment.css";
import axios from "axios";
import { toast } from "react-toastify";

const Assignment = ({ url }) => {
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);

  const token =
    sessionStorage.getItem("admin_token") ||
    localStorage.getItem("admin_token");

  const handleAssign = async () => {
    if (!selectedAgent || !selectedOrder) {
      toast.error("Select both order and agent IDs");
      return;
    }

    try {
      const response = await axios.post(
        url + "/api/delivery/assign",
        { orderId: selectedOrder, deliveryPartnerId: selectedAgent },
        { headers: { token } }
      );

      if (response.data.success) {
        const availResponse = await axios.post(
          url + "/api/delivery/update-available-false",
          {
            deliveryId: response.data.data.deliveryPartnerId,
            available: false,
          },
          { headers: { token } }
        );

        const updateResponse = await axios.post(
          url + "/api/order/status",
          { orderId: response.data.data.orderId, status: "Assigned" },
          { headers: { token } }
        );

        if (availResponse.data.success && updateResponse.data.success) {
          fetchData();
          toast.success(`${selectedOrder} has been assigned to ${selectedAgent}`);
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
      const userResponse = await axios.get(url + "/api/user/getallusers", {
        headers: { token },
      });

      if (userResponse.data.success) {
        const newUsers = userResponse.data.data.filter(
          (user) => user.role === "delivery" && user.available
        );
        setAgents(newUsers);
      }

      const orderResponse = await axios.get(url + "/api/order/list", {
        headers: { token },
      });

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
    <div className="container">
      <h1 className="heading">Assign Orders</h1>

      <div className="assignment-box">
        <input
          type="text"
          placeholder="Order ID"
          value={selectedOrder}
          readOnly
        />

        <span className="assign-text">assigned to</span>

        <input
          type="text"
          placeholder="Delivery Agent ID"
          value={selectedAgent}
          readOnly
        />

        <button className="assign-btn" onClick={handleAssign}>
          Assign
        </button>
      </div>

      <div className="lists-container">
        <div className="list">
          <h3>Orders</h3>
          <div className="scroll">
            {orders.length === 0 && (
              <p className="empty-message">No orders to be Assigned</p>
            )}
            {orders.map((order) => (
              <div
                key={order._id}
                className={`card ${selectedOrder === order._id ? "selected" : ""}`}
                onClick={() => setSelectedOrder(order._id)}
              >
                {order._id}
              </div>
            ))}
          </div>
        </div>

        <div className="list">
          <h3>Delivery Agents</h3>
          <div className="scroll">
            {agents.length === 0 && (
              <p className="empty-message">No available agents</p>
            )}
            {agents.map((agent) => (
              <div
                key={agent._id}
                className={`card ${selectedAgent === agent._id ? "selected" : ""}`}
                onClick={() => setSelectedAgent(agent._id)}
              >
                {agent._id}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;