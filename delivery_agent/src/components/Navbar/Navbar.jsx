import React from 'react'
import './Navbar.css'
import craveIt_logo from '../../assets/craveIt_logo.png'
import { NavLink } from 'react-router-dom'

const Navbar = () => {

    const logout = () => {
        sessionStorage.removeItem("delivery_token");
        localStorage.removeItem("delivery_token");
        window.location.href = "/auth?mode=login";
    }

    return (
        <div className='navbar'>
            <img src={craveIt_logo} alt="" className="logo" />
            <ul className="navbar-menu">
                <NavLink to="/">Current Orders</NavLink>
                <NavLink to="/past-orders">Past Orders</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/delivery-panel">Delivery Panel</NavLink>
            </ul>
            <div className="navbar-right">
                <button onClick={() => logout()}>Logout</button>
            </div>
        </div>
    )
}

export default Navbar
