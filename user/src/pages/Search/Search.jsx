import React, { useContext, useEffect, useMemo, useState } from "react";
import "./Search.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../../components/FoodItem/FoodItem";
import FoodFilters from "../../components/FoodFilters/FoodFilters";

const Search = () => {
    const location = useLocation();
    const { url, food_list } = useContext(StoreContext);

    const [foodList, setFoodList] = useState([]);
    const [searchedQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
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

    const fetchFoodList = async (query = searchedQuery, activeFilters = filters) => {
        if (!query) {
            setFoodList([]);
            return;
        }

        setLoading(true);
        try {
            const params = {
                name: query,
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
                setFoodList(response.data.data || []);
            } else {
                setFoodList([]);
            }
        } catch (error) {
            setFoodList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        fetchFoodList(searchedQuery, filters);
    };

    useEffect(() => {
        fetchCategories();
    }, [url]);

    useEffect(() => {
        if (!categories.length && fallbackCategories.length) {
            setCategories(fallbackCategories);
        }
    }, [fallbackCategories, categories.length]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get("q") || "";
        setSearchQuery(searchQuery);
    }, [location.search]);

    useEffect(() => {
        if (searchedQuery !== "") {
            fetchFoodList(searchedQuery, filters);
        }
    }, [searchedQuery]);

    return (
        <div className="search-page">
            <div className="search-header">
                <h1 className="search-title">
                    {searchedQuery
                        ? `Results for "${searchedQuery}"`
                        : "Search"}
                </h1>
                <p>
                    {searchedQuery
                        ? "Refine with filters to find the perfect dish"
                        : "Type a dish name in the navbar to get started"}
                </p>
            </div>

            <div className="search-filters">
                <FoodFilters
                    filters={filters}
                    onChange={handleFilterChange}
                    onApply={handleApply}
                    categories={categories}
                />
            </div>

            <div className="search-results">
                {loading ? (
                    <p>Loading...</p>
                ) : foodList.length === 0 ? (
                    <p>No items found</p>
                ) : (
                    foodList.map((item) => (
                        <FoodItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            averageRating={item.averageRating}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Search;