import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import craveIt_logo from "../../assets/craveIt_logo.png";

const Footer = () => {
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
              Reliable partners, real-time tracking, and seamless handoffs —
              CraveIt helps delivery agents get every order to the door.
            </p>
          </div>

          <div className="footer-column">
            <h2>Navigate</h2>
            <ul>
              <li>
                <Link to="/">Current Orders</Link>
              </li>
              <li>
                <Link to="/past-orders">Past Orders</Link>
              </li>
              <li>
                <Link to="/delivery-panel">Delivery Panel</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h2>Account</h2>
            <ul>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/delivery-panel">Active Delivery</Link>
              </li>
              <li>
                <Link to="/auth?mode=login">Sign in</Link>
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
