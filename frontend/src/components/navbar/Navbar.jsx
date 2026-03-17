import React, { Profiler, useContext, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import craveIt_logo from '../../assets/craveIt_logo.png'
import { FaUser } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoBag } from "react-icons/io5";


const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }

  const handleSearch = () => {
    if (searchTerm != "") navigate(`/search?q=${searchTerm}`);
    setSearchTerm("");
  }

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className='navbar'>
      <Link to='/'><img src={craveIt_logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href="#footer" onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>contact us</a>
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
          <img onClick={handleSearch} src={assets.search_icon} alt="" className="navbar-search-button" />
        </div>
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
          {getTotalCartAmount() > 0 ? <div className="dot"></div> : null}
        </div>
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button> : <div className='navbar-profile'>
          <img src={assets.profile_icon} alt="" />
          <ul className="nav-profile-dropdown">
            <li onClick={() => navigate('/myprofile')}><FaUser color="tomato" /><p>Profile</p></li>
            <hr />
            <li onClick={() => navigate('/myorders')}><IoBag color="tomato" /><p>Orders</p></li>
            <hr />
            <li onClick={logout}><RiLogoutBoxRLine color="tomato" /><p>Logout</p></li>
          </ul>
        </div>}
      </div>
    </div>
  )
}

export default Navbar
