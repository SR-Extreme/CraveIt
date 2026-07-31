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
  const isEmpty = filteredFoods.length === 0;

  return (
    <div className="food-display" id="food-display">
      <p className="food-display-subtitle">
        Discover popular picks from our kitchen
      </p>

      {isEmpty ? (
        <p className="food-display-empty">
          No dishes yet. Add food items from the admin panel.
        </p>
      ) : (
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
      )}

      {!isEmpty && (
        <div className="food-display-more">
          <button
            type="button"
            className="food-display-more-btn"
            onClick={() => navigate("/explore")}
          >
            Explore More
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;