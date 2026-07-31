import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "../DeliveryTemplates.css";

const DeliveryProfile = () => {
  const { url, token } = useContext(StoreContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      const response = await axios.post(`${url}/api/user/getuser`, {});
      if (response.data.success) {
        setProfile(response.data.data);
      }
    };
    fetchProfile();
  }, [token, url]);

  return (
    <section className="delivery-template">
      <h2>Delivery Agent Profile</h2>
      <p>Basic account details for the delivery partner.</p>
      <div className="delivery-card">
        <div className="delivery-card__title">Personal info</div>
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
            <span className="delivery-row__value">
              {profile?.role || "delivery"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryProfile;
