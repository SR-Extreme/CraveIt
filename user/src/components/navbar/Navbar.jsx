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
import axios from 'axios';


const Navbar = ({ setShowLogin }) => {

  const [user, setUser] = useState([]);

  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const { getTotalCartAmount, token, setToken, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("user_token");
    localStorage.removeItem("user_token");
    setToken("");
    navigate("/");
  }

  const getUser = async () => {
    const token = sessionStorage.getItem("user_token") || localStorage.getItem("user_token");
    if (!token) return;
    const response = await axios.post(url + '/api/user/getuser', {}, { headers: { token: token } });
    if (response.data.success) {
      setUser(response.data.data);
    }
  } ////////////////


  const handleSearch = () => {
    if (searchTerm != "") navigate(`/search?q=${searchTerm}`);
    setSearchTerm("");
  }

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  useEffect(() => {
    getUser();
  }, [])

  return (
    <div className='navbar'>
      <Link to='/'><img src={craveIt_logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href="#footer" onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>contact us</a>
        {user.role === "delivery" && (<button onClick={() => navigate("/delivery-panel")}>Delivery Panel</button>)}
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
