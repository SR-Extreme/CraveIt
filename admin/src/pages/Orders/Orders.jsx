import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalItemsPurchased: 0,
    averageRevenuePerOrder: 0});


  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error(response.data.message || "Error");
      }
    } catch (error) {
      toast.error("Failed to load orders");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(url + "/api/order/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    fetchStats();
  }, []);

  return (
    <div className="order">
      <div className="order-header">
        <h2>Order Management</h2>
        <p>Track revenue and view order statuses</p>
      </div>

      <div className="order-stats">
        <div className="order-stat-card">
          <span>Total Revenue</span>
          <strong>₹{Number(stats.totalRevenue || 0).toFixed(2)}</strong>
        </div>
        <div className="order-stat-card">
          <span>Total Orders</span>
          <strong>{stats.totalOrders || 0}</strong>
        </div>
        <div className="order-stat-card">
          <span>Total Items Purchased</span>
          <strong>{stats.totalItemsPurchased || 0}</strong>
        </div>
        <div className="order-stat-card">
          <span>Avg Revenue / Order</span>
          <strong>
            ₹{Number(stats.averageRevenuePerOrder || 0).toFixed(2)}
          </strong>
        </div>
      </div>

      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  }
                  return item.name + " x " + item.quantity + ", ";
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>₹{order.amount}</p>
            <p className="order-item-status">{order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;