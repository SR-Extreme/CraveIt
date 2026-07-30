import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Explore.css";
import { StoreContext } from "../../context/StoreContext";
import FoodFilters from "../../components/FoodFilters/FoodFilters";
import FoodItem from "../../components/FoodItem/FoodItem";

const Explore = () => {
    const { url, food_list } = useContext(StoreContext);

    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: "All",
        minPrice: 0,
        maxPrice: 500,
        minRating: 0,
        maxRating: 5,
    });

    const fallbackCategories = useMemo(() => {
        return [...new Set(food_list.map((item) => item.category).filter(Boolean))];
    }, [food_list]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${url}/api/category/list`);
            if (response.data.success && response.data.data?.length) {
                setCategories(response.data.data.map((cat) => cat.name));
            } else {
                setCategories(fallbackCategories);
            }
        } catch (error) {
            setCategories(fallbackCategories);
        }
    };

    const fetchFoods = async (activeFilters = filters) => {
        setLoading(true);
        try {
            const params = {
                minPrice: activeFilters.minPrice,
                maxPrice: activeFilters.maxPrice,
                minRating: activeFilters.minRating,
                maxRating: activeFilters.maxRating,
            };

            if (activeFilters.category && activeFilters.category !== "All") {
                params.category = activeFilters.category;
            }

            const response = await axios.get(`${url}/api/food/filter`, { params });
            if (response.data.success) {
                setFoods(response.data.data || []);
            } else {
                setFoods([]);
            }
        } catch (error) {
            setFoods(food_list);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        fetchFoods(filters);
    };

    useEffect(() => {
        fetchCategories();
        fetchFoods();
    }, [url]);

    useEffect(() => {
        if (!categories.length && fallbackCategories.length) {
            setCategories(fallbackCategories);
        }
    }, [fallbackCategories, categories.length]);

    return (
        <div className="explore-page">
            <div className="explore-header">
                <h1>Explore</h1>
                <p>Browse the full menu and filter by what you crave</p>
            </div>

            <FoodFilters
                filters={filters}
                onChange={handleFilterChange}
                onApply={handleApply}
                categories={categories}
            />

            {loading ? (
                <p className="explore-status">Loading dishes...</p>
            ) : foods.length === 0 ? (
                <p className="explore-status">No dishes match your filters.</p>
            ) : (
                <div className="explore-grid">
                    {foods.map((item) => (
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
        </div>
    );
};

export default Explore;