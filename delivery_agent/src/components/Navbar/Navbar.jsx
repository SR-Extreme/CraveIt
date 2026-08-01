import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import craveIt_logo from "../../assets/craveIt_logo.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { IoClose, IoMenu } from "react-icons/io5";

const Navbar = () => {
  const { url, setToken } = useContext(StoreContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const logout = async () => {
    try {
      await axios.post(`${url}/api/user/logout`, {});
    } catch (error) {
      console.log(error);
    }
    setToken("");
    window.location.href = "/auth?mode=login";
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="navbar">
      <button
        type="button"
        className="navbar-toggle"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <IoClose /> : <IoMenu />}
      </button>

      <Link to="/" className="navbar-brand" onClick={closeMobile}>
        <img src={craveIt_logo} alt="CraveIt" className="logo" />
      </Link>

      <div
        className={`navbar-backdrop ${mobileOpen ? "open" : ""}`}
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
      />

      <ul className={`navbar-menu ${mobileOpen ? "open" : ""}`}>
        <NavLink to="/" end onClick={closeMobile}>
          Current Orders
        </NavLink>
        <NavLink to="/past-orders" onClick={closeMobile}>
          Past Orders
        </NavLink>
        <NavLink to="/profile" onClick={closeMobile}>
          Profile
        </NavLink>
        <NavLink to="/delivery-panel" onClick={closeMobile}>
          Delivery Panel
        </NavLink>
      </ul>

      <div className="navbar-right">
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
