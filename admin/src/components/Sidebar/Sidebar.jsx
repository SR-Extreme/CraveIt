import React, { useEffect } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import { FaList, FaUsers, FaTags } from "react-icons/fa";
import { MdOutlineRestaurantMenu, MdAddCircleOutline } from "react-icons/md";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { role } = useAuth();
  const location = useLocation();

  const canManageFoods = hasPermission(role, PERMISSIONS.FOODS_MANAGE);
  const canManageCategories = hasPermission(role, PERMISSIONS.CATEGORIES_MANAGE);
  const canManageUsers = hasPermission(role, PERMISSIONS.USERS_MANAGE);
  const canViewOrders = hasPermission(role, PERMISSIONS.ORDERS_VIEW);
  const canAssignOrders = hasPermission(role, PERMISSIONS.ORDERS_ASSIGN);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setSidebarOpen]);

  useEffect(() => {
    const lock = sidebarOpen && window.innerWidth <= 900;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <div
        className={`sidebar-backdrop ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-options">
          {canManageFoods && (
            <NavLink to="/add" className="sidebar-option" onClick={closeSidebar}>
              <MdAddCircleOutline />
              <p>Add Items</p>
            </NavLink>
          )}

          {canManageFoods && (
            <NavLink to="/list" className="sidebar-option" onClick={closeSidebar}>
              <FaList />
              <p>List Items</p>
            </NavLink>
          )}

          {canManageCategories && (
            <NavLink
              to="/categories"
              className="sidebar-option"
              onClick={closeSidebar}
            >
              <FaTags />
              <p>Categories</p>
            </NavLink>
          )}

          {canViewOrders && (
            <NavLink
              to="/orders"
              className="sidebar-option"
              onClick={closeSidebar}
            >
              <MdOutlineRestaurantMenu />
              <p>Orders</p>
            </NavLink>
          )}

          {canAssignOrders && (
            <NavLink
              to="/assign-orders"
              className="sidebar-option"
              onClick={closeSidebar}
            >
              <img src={assets.order_icon} alt="" />
              <p>Assign Orders</p>
            </NavLink>
          )}

          {canManageUsers && (
            <NavLink to="/users" className="sidebar-option" onClick={closeSidebar}>
              <FaUsers />
              <p>User Management</p>
            </NavLink>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
