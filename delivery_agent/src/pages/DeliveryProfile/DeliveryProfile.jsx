import React, { useEffect, useState } from "react";
import axios from "axios";
import "../DeliveryTemplates.css";

const DeliveryProfile = () => {
  const [profile, setProfile] = useState(null);
  const url = "http://localhost:4000";
  const token = localStorage.getItem("delivery_token");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      const response = await axios.post(`${url}/api/user/getuser`, {}, { headers: { token } });
      if (response.data.success) {
        setProfile(response.data.data);
      }
    };
    fetchProfile();
  }, [token]);

  return (
    <section className="delivery-template">
      <h2>Delivery Agent Profile</h2>
      <p>Basic account details for the delivery partner.</p>
      <div className="delivery-card">
        <h3 className="delivery-card__title">Personal info</h3>
        <div className="delivery-rows">
          <div className="delivery-row">
            <span className="delivery-row__label">Name</span>
            <span className="delivery-row__value">{profile?.name || "—"}</span>
          </div>
          <div className="delivery-row">
            <span className="delivery-row__label">Email</span>
            <span className="delivery-row__value">{profile?.email || "—"}</span>
          </div>
          <div className="delivery-row">
            <span className="delivery-row__label">Phone</span>
            <span className="delivery-row__value">{profile?.phone || "—"}</span>
          </div>
          <div className="delivery-row">
            <span className="delivery-row__label">Role</span>
            <span className="delivery-row__value">{profile?.role || "delivery"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryProfile;
