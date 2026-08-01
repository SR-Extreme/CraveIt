import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import craveIt_logo from "../../assets/craveIt_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoClose, IoMenu } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="navbar-toggle"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((open) => !open)}
        >
          {sidebarOpen ? <IoClose /> : <IoMenu />}
        </button>
        <Link to="/" className="navbar-brand">
          <img src={craveIt_logo} alt="CraveIt" className="logo" />
        </Link>
      </div>

      <div
        className={`navbar-profile ${profileOpen ? "open" : ""}`}
        ref={profileRef}
      >
        <button
          type="button"
          className="navbar-profile-btn"
          aria-label="Profile menu"
          aria-expanded={profileOpen}
          onClick={() => setProfileOpen((open) => !open)}
        >
          <img src={assets.profile_icon} alt="Profile" />
        </button>
        <ul className="nav-profile-dropdown">
          <li
            onClick={() => {
              setProfileOpen(false);
              navigate("/profile");
            }}
          >
            <FaUser color="var(--brand-color)" />
            <p>Profile</p>
          </li>
          <hr />
          <li
            onClick={() => {
              setProfileOpen(false);
              logout();
            }}
          >
            <RiLogoutBoxRLine color="var(--brand-color)" />
            <p>Logout</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
