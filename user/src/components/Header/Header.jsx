import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <section className="header" aria-label="Hero">
      <img
        className="header-image"
        src="/Hero.png"
        alt="Grilled kebabs and spices"
      />
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients and culinary expertise. Our
          mission is to satisfy your cravings and elevate your dining
          experience, one delicious meal at a time.
        </p>
        <a href="#explore-menu">
          <button type="button">View Menu</button>
        </a>
      </div>
    </section>
  );
};

export default Header;
