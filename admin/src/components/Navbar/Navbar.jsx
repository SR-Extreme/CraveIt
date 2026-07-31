import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import craveIt_logo from "../../assets/craveIt_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={craveIt_logo} alt="CraveIt" className="logo" />
      </Link>

      <div className="navbar-profile">
        <img src={assets.profile_icon} alt="Profile" />
        <ul className="nav-profile-dropdown">
          <li onClick={() => navigate("/profile")}>
            <FaUser color="var(--brand-color)" />
            <p>Profile</p>
          </li>
          <hr />
          <li onClick={logout}>
            <RiLogoutBoxRLine color="var(--brand-color)" />
            <p>Logout</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
