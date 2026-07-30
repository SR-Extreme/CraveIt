import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const navigate = useNavigate();

  const filteredFoods = food_list.filter(
    (item) => category === "All" || category === item.category
  );

  const displayedFoods = filteredFoods.slice(0, 4);

  return (
    <div className="food-display" id="food-display">
      <h2>Explore Menu</h2>
      <p className="food-display-subtitle">
        Discover popular picks from our kitchen
      </p>

      <div className="food-display-list">
        {displayedFoods.map((item) => (
          <FoodItem
            key={item._id}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            averageRating={item.averageRating}
          />
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <p className="food-display-empty">No dishes found in this category.</p>
      )}

      <div className="food-display-more">
        <button
          type="button"
          className="food-display-more-btn"
          onClick={() => navigate("/explore")}
        >
          Explore More
        </button>
      </div>
    </div>
  );
};

export default FoodDisplay;