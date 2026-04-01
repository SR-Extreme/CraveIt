import React, { useEffect, useState } from "react";
import "./Assignment.css";
import axios from "axios";
import { toast } from "react-toastify";

const Assignment = ({url}) => {
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const token = localStorage.getItem("admin_token");

  const [orders,setOrders] = useState([]);
  const [agents,setAgents]= useState([]);

  const handleAssign = async() => {
    if(!selectedAgent || !selectedOrder){
        toast.error("Select both order and agent IDs");
        return;
    }
    try {
        const response = await axios.post(url+"/api/delivery/assign",{orderId:selectedOrder,deliveryPartnerId:selectedAgent},{headers:{token:token}});
        if(response.data.success){
            const availResponse = await axios.post(url+"/api/delivery/update-available-false",{deliveryId:response.data.data.deliveryPartnerId,available:false},{headers:{token:token}});
            const updateResponse = await axios.post(url+"/api/order/status",{orderId:response.data.data.orderId,status:"Assigned"});
            if(availResponse.data.success && updateResponse.data.success){
                fetchData();
                toast.success(`${selectedOrder} has been assigned to ${selectedAgent}`);
                setSelectedAgent("");
                setSelectedOrder("");
            }
        }
    } catch (error) {
        console.log(error);
        toast.error("Error");
    }
  };

  const fetchData = async () =>{
    try {
        const userResponse = await axios.get(url+"/api/user/getallusers",{headers:{token:token}});
        if(userResponse.data.success){
            let newUsers = userResponse.data.data.filter((user)=>{
                return user.role == "delivery" && user.available
            })
            setAgents(newUsers);
        }

        const orderResponse = await axios.get(url+"/api/order/list");
        if(orderResponse.data.success){
            let newOrders = orderResponse.data.data.filter((order)=>{
                return order.status == "Food Processing"
            })
            setOrders(newOrders);
        }
    } catch (error) {
        toast.error("Error");
    }
  }

  useEffect(()=>{
    fetchData();
  },[]);

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
            {orders.length===0 && (
                <p className="empty-message">No orders to be Assigned</p>
            )}
            {orders.map((order, index) => (
              <div
                key={index}
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
            {agents.length===0 && (
                <p className="empty-message">No orders to be Assigned</p>
            )}
            {agents.map((agent, index) => (
              <div
                key={index}
                className={`card ${selectedAgent === agent ? "selected" : ""}`}
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