import React, { useContext, useEffect, useState } from "react";
import "./ExploreMenu.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { getImageUrl } from "../../utils/imageUrl";

const ExploreMenu = ({ category, setCategory }) => {
  const { url } = useContext(StoreContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/category/list`);
        if (response.data.success) {
          setCategories(response.data.data || []);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [url]);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Discover a world of delicious flavors by exploring our carefully curated food categories. From authentic Indian classics to mouthwatering desserts, there's something for every craving. Simply select a category to instantly browse the dishes you love and find your next favorite meal. Freshly prepared, expertly crafted, and delivered straight to your doorstep
      </p>

      {loading ? (
        <p className="explore-menu-empty">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="explore-menu-empty">
          No categories yet. SuperAdmin can add them from the admin panel.
        </p>
      ) : (
        <div className="explore-menu-list">
          {categories.map((item) => (
            <div
              key={item._id}
              onClick={() =>
                setCategory((prev) => (prev === item.name ? "All" : item.name))
              }
              className="explore-menu-list-item"
            >
              <img
                className={category === item.name ? "active" : ""}
                src={getImageUrl(item.image)}
                alt={item.name}
              />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreMenu;