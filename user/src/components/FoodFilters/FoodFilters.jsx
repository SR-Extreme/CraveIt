import React from "react";
import "./FoodFilters.css";

const FoodFilters = ({ filters, onChange, onApply, categories = [] }) => {
  const {
    category = "All",
    minPrice = 0,
    maxPrice = 500,
    minRating = 0,
    maxRating = 5,
  } = filters;

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply?.();
  };

  return (
    <form className="food-filters" onSubmit={handleSubmit}>
      <div className="food-filters-group">
        <label htmlFor="filter-category">Category</label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          <option value="All">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="food-filters-group food-filters-range">
        <span className="food-filters-label">
          Price{" "}
          <span className="food-filters-value">
            ₹{minPrice} – ₹{maxPrice}
          </span>
        </span>
        <div className="food-filters-sliders">
          <label>
            Min
            <input
              type="range"
              min="0"
              max="500"
              step="1"
              value={minPrice}
              onChange={(e) =>
                onChange("minPrice", Math.min(Number(e.target.value), maxPrice))
              }
            />
          </label>
          <label>
            Max
            <input
              type="range"
              min="0"
              max="500"
              step="1"
              value={maxPrice}
              onChange={(e) =>
                onChange("maxPrice", Math.max(Number(e.target.value), minPrice))
              }
            />
          </label>
        </div>
      </div>

      <div className="food-filters-group food-filters-range">
        <span className="food-filters-label">
          Rating{" "}
          <span className="food-filters-value">
            {Number(minRating).toFixed(1)} – {Number(maxRating).toFixed(1)}
          </span>
        </span>
        <div className="food-filters-sliders">
          <label>
            Min
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) =>
                onChange(
                  "minRating",
                  Math.min(Number(e.target.value), maxRating)
                )
              }
            />
          </label>
          <label>
            Max
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={maxRating}
              onChange={(e) =>
                onChange(
                  "maxRating",
                  Math.max(Number(e.target.value), minRating)
                )
              }
            />
          </label>
        </div>
      </div>

      <button type="submit" className="food-filters-apply">
        Apply Filters
      </button>
    </form>
  );
};

export default FoodFilters;
