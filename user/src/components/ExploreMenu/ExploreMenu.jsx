import React, { useContext, useEffect, useState } from "react";
import "./ExploreMenu.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

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
        Choose from a diverse menu featuring a delectable array of dishes
        crafted with the finest ingredients and culinary expertise. Our mission
        is to satisfy your cravings and elevate your dining experience, one
        delicious meal at a time.
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
                src={`${url}/images/${item.image}`}
                alt={item.name}
              />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      )}

      <hr />
    </div>
  );
};

export default ExploreMenu;