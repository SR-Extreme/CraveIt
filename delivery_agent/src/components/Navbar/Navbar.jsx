import React from "react";
import "./Navbar.css";
import craveIt_logo from "../../assets/craveIt_logo.png";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const Navbar = () => {
  const { url, setToken } = useContext(StoreContext);

  const logout = async () => {
    try {
      await axios.post(`${url}/api/user/logout`, {});
    } catch (error) {
      console.log(error);
    }
    setToken("");
    window.location.href = "/auth?mode=login";
  };

  return (
    <div className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={craveIt_logo} alt="CraveIt" className="logo" />
      </Link>

      <ul className="navbar-menu">
        <NavLink to="/" end>
          Current Orders
        </NavLink>
        <NavLink to="/past-orders">Past Orders</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/delivery-panel">Delivery Panel</NavLink>
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
