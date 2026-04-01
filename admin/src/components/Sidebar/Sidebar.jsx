import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { FaList } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
            <MdAddCircleOutline />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <FaList />
            <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <MdOutlineRestaurantMenu />
            <p>Orders</p>
        </NavLink>
        <NavLink to='/assign-orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Assign Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
