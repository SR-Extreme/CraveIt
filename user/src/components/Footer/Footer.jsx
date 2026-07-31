import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Footer.css";
import craveIt_logo from "../../assets/craveIt_logo.png";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSectionNav = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 100);
    } else {
      scrollToSection(sectionId);
    }
  };

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
              Fresh flavors, fast delivery, and effortless ordering — CraveIt
              brings your favorite meals to your doorstep.
            </p>
          </div>

          <div className="footer-column">
            <h2>Navigate</h2>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/explore">Explore</Link>
              </li>
              <li>
                <button type="button" onClick={() => handleSectionNav("in-demand")}>
                  Popular
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleSectionNav("gallery")}>
                  Gallery
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h2>Account</h2>
            <ul>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li>
                <Link to="/myorders">Orders</Link>
              </li>
              <li>
                <Link to="/myprofile">Profile</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h2>Contact</h2>
            <ul>
              <li>
                <a href="tel:+12323324564">+91-7842578558</a>
              </li>
              <li>
                <a href="mailto:contact@craveit.com">saurav0808roy@gmail.com</a>
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
