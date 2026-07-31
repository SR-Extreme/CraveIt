import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import craveIt_logo from "../../assets/craveIt_logo.png";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { role } = useAuth();

  const canManageFoods = hasPermission(role, PERMISSIONS.FOODS_MANAGE);
  const canManageCategories = hasPermission(role, PERMISSIONS.CATEGORIES_MANAGE);
  const canManageUsers = hasPermission(role, PERMISSIONS.USERS_MANAGE);
  const canViewOrders = hasPermission(role, PERMISSIONS.ORDERS_VIEW);
  const canAssignOrders = hasPermission(role, PERMISSIONS.ORDERS_ASSIGN);

  return (
    <footer className="footer" id="footer">
      <img
        className="footer-scrap"
        src="/Footer.png"
        alt=""
        aria-hidden="true"
      />

      <div className="footer-surface">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/">
              <img src={craveIt_logo} alt="CraveIt" />
            </Link>
            <p>
              Admin console for CraveIt — manage menus, orders, categories, and
              delivery partners from one place.
            </p>
          </div>

          <div className="footer-column">
            <h2>Manage</h2>
            <ul>
              {canManageFoods && (
                <li>
                  <Link to="/add">Add Items</Link>
                </li>
              )}
              {canManageFoods && (
                <li>
                  <Link to="/list">List Items</Link>
                </li>
              )}
              {canManageCategories && (
                <li>
                  <Link to="/categories">Categories</Link>
                </li>
              )}
              {canViewOrders && (
                <li>
                  <Link to="/orders">Orders</Link>
                </li>
              )}
            </ul>
          </div>

          <div className="footer-column">
            <h2>Account</h2>
            <ul>
              {canAssignOrders && (
                <li>
                  <Link to="/assign-orders">Assign Orders</Link>
                </li>
              )}
              {canManageUsers && (
                <li>
                  <Link to="/users">User Management</Link>
                </li>
              )}
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h2>Contact</h2>
            <ul>
              <li>
                <a href="tel:+917842578558">+91-7842578558</a>
              </li>
              <li>
                <a href="mailto:saurav0808roy@gmail.com">
                  saurav0808roy@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr />
        <p className="footer-copyright">
          Copyright {new Date().getFullYear()} © CraveIt — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
