import React, { useContext, useEffect, useState } from 'react'
import './Search.css'
import { useLocation } from 'react-router-dom'
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from "react-toastify";
import { assets } from '../../assets/assets';
import FoodItem from '../../components/FoodItem/FoodItem';

const Search = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q");
    const { url, token } = useContext(StoreContext);
    const [foodList, setFoodList] = useState([]);

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/searchfoodlist", { params: { name: searchQuery } });
        if (response.data.success) {
            setFoodList(response.data.data);
        } else {
            toast.error(response.data.error);
        }
    }

    useEffect(() => {
        fetchFoodList();
    }, [searchQuery])

    return (
        <div className="search-page">
            <h2 className="search-title">
                Search Results for "{searchQuery}"
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
    )
}

export default Search