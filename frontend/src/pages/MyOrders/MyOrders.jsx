import React from 'react'
import './MyOrders.css'
import axios from 'axios';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {

  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
    setData(response.data.data);
  }

  //for the button to update trackOrder
  const updateTrackOrder = async (orderId) => {
    const response = await axios.post(url + "/api/order/trackorder", { orderId });
    if (response.data.success) {
      const updatedOrders = data.map((order) => order._id === orderId ?
        { ...order, status: response.data.data.status } : order);
      setData(updatedOrders);
    } else {
      toast.error("Error");
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token])

  return (
    <>
      {data.length === 0 ? (
        <div className="my-orders-empty">
          <div className="my-orders-empty-card">
            <h2>No orders yet</h2>
            <p>Looks like you haven&apos;t placed any orders.</p>
            <p className="my-orders-empty-subtitle">Browse the menu and enjoy your first meal with us.</p>
            <button className="my-orders-btn" onClick={() => navigate("/")}>
              Go to Home
            </button>
          </div>
        </div>
      ) : (
        <div className='my-orders'>
          <h2>My Orders</h2>
          <div className="container">
            {data.map((order, index) => {
              return (
                <div key={index} className="my-orders-order">
                  <img src={assets.parcel_icon} alt="" />
                  <p>{order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ", ";
                    }
                  })}</p>
                  <p>₹{order.amount}.00</p>
                  <p>Items: {order.items.length}</p>
                  <p className="my-orders-status">
                    <span className="my-orders-status-dot">&#x25cf;</span>
                    <span className="my-orders-status-text">{order.status}</span>
                  </p>
                  <button className="my-orders-btn my-orders-track-btn" onClick={() => updateTrackOrder(order._id)}>
                    Track Order
                  </button>
                </div>
              )
            })}
          </div>
        </div>)}
    </>
  )
}

export default MyOrders
