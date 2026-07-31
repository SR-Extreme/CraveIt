import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import craveIt_admin_logo from "../../assets/CraveIt_admin_logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("admin_token");
    localStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_role");
    localStorage.removeItem("admin_role");
    window.location.href = "/auth?mode=login";
  };

  return (
    <div className="navbar">
      <img className="logo" src={craveIt_admin_logo} alt="CraveIt Admin" />

      <div className="navbar-profile">
        <img className="profile" src={assets.profile_image} alt="Profile" />
        <ul className="nav-profile-dropdown">
          <li onClick={() => navigate("/profile")}>Profile</li>
          <hr />
          <li onClick={logout}>Logout</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;