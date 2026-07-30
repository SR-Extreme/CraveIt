import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import craveIt_logo from "../../assets/craveIt_logo.png";
import { FaUser } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoBag } from "react-icons/io5";
import axios from "axios";

const Navbar = ({ setShowLogin }) => {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const { getTotalCartAmount, token, setToken, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    sessionStorage.removeItem("user_token");
    localStorage.removeItem("user_token");
    setToken("");
    navigate("/");
  };

  const getUser = async () => {
    const storedToken =
      sessionStorage.getItem("user_token") || localStorage.getItem("user_token");
    if (!storedToken) return;
    const response = await axios.post(
      url + "/api/user/getuser",
      {},
      { headers: { token: storedToken } }
    );
    if (response.data.success) {
      setUser(response.data.data);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
    setSearchTerm("");
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSectionNav = (sectionId, menuKey) => {
    setMenu(menuKey);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  useEffect(() => {
    getUser();
  }, [token]);

  return (
    <div className="navbar">
      <Link to="/" onClick={() => setMenu("home")}>
        <img src={craveIt_logo} alt="CraveIt" className="logo" />
      </Link>

      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <Link
          to="/explore"
          onClick={() => setMenu("explore")}
          className={menu === "explore" ? "active" : ""}
        >
          Explore
        </Link>
        <button
          type="button"
          className={`navbar-menu-link ${menu === "popular" ? "active" : ""}`}
          onClick={() => handleSectionNav("in-demand", "popular")}
        >
          Popular
        </button>
        <button
          type="button"
          className={`navbar-menu-link ${menu === "gallery" ? "active" : ""}`}
          onClick={() => handleSectionNav("gallery", "gallery")}
        >
          Gallery
        </button>
      </ul>

      <div className="navbar-right">
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search your crave..."
            className="navbar-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleEnterPress}
          />
          <img
            onClick={handleSearch}
            src={assets.search_icon}
            alt="Search"
            className="navbar-search-button"
          />
        </div>

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          {getTotalCartAmount() > 0 ? <div className="dot"></div> : null}
        </div>

        {!token ? (
          <button type="button" onClick={() => setShowLogin(true)}>
            Sign in
          </button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myprofile")}>
                <FaUser color="var(--color-primary)" />
                <p>Profile</p>
              </li>
              <hr />
              <li onClick={() => navigate("/myorders")}>
                <IoBag color="var(--color-primary)" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <RiLogoutBoxRLine color="var(--color-primary)" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;