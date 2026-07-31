import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { FaList, FaUsers, FaTags } from "react-icons/fa";
import { MdOutlineRestaurantMenu, MdAddCircleOutline } from "react-icons/md";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { role } = useAuth();

  const canManageFoods = hasPermission(role, PERMISSIONS.FOODS_MANAGE);
  const canManageCategories = hasPermission(role, PERMISSIONS.CATEGORIES_MANAGE);
  const canManageUsers = hasPermission(role, PERMISSIONS.USERS_MANAGE);
  const canViewOrders = hasPermission(role, PERMISSIONS.ORDERS_VIEW);
  const canAssignOrders = hasPermission(role, PERMISSIONS.ORDERS_ASSIGN);

  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {canManageFoods && (
          <NavLink to="/add" className="sidebar-option">
            <MdAddCircleOutline />
            <p>Add Items</p>
          </NavLink>
        )}

        {canManageFoods && (
          <NavLink to="/list" className="sidebar-option">
            <FaList />
            <p>List Items</p>
          </NavLink>
        )}

        {canManageCategories && (
          <NavLink to="/categories" className="sidebar-option">
            <FaTags />
            <p>Categories</p>
          </NavLink>
        )}

        {canViewOrders && (
          <NavLink to="/orders" className="sidebar-option">
            <MdOutlineRestaurantMenu />
            <p>Orders</p>
          </NavLink>
        )}

        {canAssignOrders && (
          <NavLink to="/assign-orders" className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Assign Orders</p>
          </NavLink>
        )}

        {canManageUsers && (
          <NavLink to="/users" className="sidebar-option">
            <FaUsers />
            <p>User Management</p>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;