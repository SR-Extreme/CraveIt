import React, { useContext, useEffect, useState } from 'react'
import './Search.css'
import { useLocation } from 'react-router-dom'
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from "react-toastify";
import FoodItem from '../../components/FoodItem/FoodItem';

const Search = () => {

    const location = useLocation();
    const { url, token } = useContext(StoreContext);
    const [foodList, setFoodList] = useState([]);
    const [minPrice, setMinPrice] = useState("0");
    const [maxPrice, setMaxPrice] = useState("200");
    const [searchedQuery, setSearchQuery] = useState("");

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/searchfoodlist", { params: { name: searchedQuery } });
        if (response.data.success) {
            const newFoodList = await response.data.data.filter((item) => {
                return item.price >= minPrice && item.price <= maxPrice;
            })
            console.log(newFoodList);
            setFoodList(newFoodList);
        } else {
            toast.error(response.data.error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();  //prevents page reload
        fetchFoodList();
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get("q");

        if (searchQuery) {
            setSearchQuery(searchQuery);
        }
    }, [location.search]);

    useEffect(() => {
        if (searchedQuery != "") fetchFoodList();
    }, [searchedQuery])

    return (
        <div>
            <div className="search-page">
                <h2 className="search-title">
                    Search Results for "{searchedQuery}"
                </h2>
                <div className="search-results">
                    {foodList.length === 0 ? (
                        <p>No items found</p>
                    ) : (
                        foodList.map((item, index) => {
                            return (<FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />)
                        })
                    )}
                </div>
            </div>
            <div className="search-filters">
                <form className="price-slider" onSubmit={handleSubmit}>
                    <span>Price range:</span>
                    <div className="slider-row">
                        <label>
                            min:₹{minPrice}
                            <input
                                type="range"
                                min="0"
                                max="200"
                                step="1"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                            />
                        </label>
                        <label>
                            max:₹{maxPrice}
                            <input
                                type="range"
                                min="0"
                                max="200"
                                step="1"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                            />
                        </label>
                    </div>
                    <button type='submit'>Apply</button>
                </form>
            </div>
        </div>
    )
}

export default Search