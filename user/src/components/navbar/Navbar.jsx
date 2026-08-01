import React, { useContext, useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import craveIt_logo from "../../assets/craveIt_logo.png";
import { FaUser } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoBag, IoClose, IoMenu } from "react-icons/io5";
import axios from "axios";

const Navbar = ({ setShowLogin }) => {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { getTotalCartAmount, token, setToken, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const logout = async () => {
    try {
      await axios.post(url + "/api/user/logout", {});
    } catch (error) {
      console.log(error);
    }
    setToken("");
    setUser(null);
    setProfileOpen(false);
    navigate("/");
  };

  const getUser = async () => {
    if (!token) return;
    const response = await axios.post(url + "/api/user/getuser", {});
    if (response.data.success) {
      setUser(response.data.data);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
    setSearchTerm("");
    setMobileOpen(false);
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
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    getUser();
  }, [token]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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

      <Link to="/" className="navbar-brand" onClick={() => setMenu("home")}>
        <img src={craveIt_logo} alt="CraveIt" className="logo" />
      </Link>

      <div
        className={`navbar-backdrop ${mobileOpen ? "open" : ""}`}
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
      />

      <ul className={`navbar-menu ${mobileOpen ? "open" : ""}`}>
        <li className="navbar-menu-search">
          <div className="navbar-search navbar-search--mobile">
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
        </li>
        <Link
          to="/"
          onClick={() => {
            setMenu("home");
            closeMobile();
          }}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <Link
          to="/explore"
          onClick={() => {
            setMenu("explore");
            closeMobile();
          }}
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
                  navigate("/myprofile");
                }}
              >
                <FaUser color="var(--color-primary)" />
                <p>Profile</p>
              </li>
              <hr />
              <li
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/myorders");
                }}
              >
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
