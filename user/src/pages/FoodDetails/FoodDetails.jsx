import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./FoodDetails.css";
import { StoreContext } from "../../context/StoreContext";
import QuantitySelector from "../../components/QuantitySelector/QuantitySelector";

const FoodDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { url, food_list, cartItems, addToCart, removeFromCart } =
        useContext(StoreContext);

    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFood = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get(`${url}/api/food/${id}`);
                if (response.data.success) {
                    setFood(response.data.data);
                } else {
                    const fallback = food_list.find((item) => item._id === id);
                    if (fallback) {
                        setFood(fallback);
                    } else {
                        setError(response.data.message || "Food not found");
                    }
                }
            } catch (err) {
                const fallback = food_list.find((item) => item._id === id);
                if (fallback) {
                    setFood(fallback);
                } else {
                    setError("Failed to load food details");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFood();
    }, [id, url, food_list]);

    if (loading) {
        return (
            <div className="food-details">
                <div className="food-details-card food-details-loading">Loading...</div>
            </div>
        );
    }

    if (error || !food) {
        return (
            <div className="food-details">
                <div className="food-details-card food-details-empty">
                    <p>{error || "Food not found"}</p>
                    <button type="button" onClick={() => navigate("/explore")}>
                        Back to Explore
                    </button>
                </div>
            </div>
        );
    }

    const quantity = cartItems?.[food._id] || 0;
    const ratingValue = Number(food.averageRating) || 0;

    return (
        <div className="food-details">
            <div className="food-details-card">
                <div className="food-details-image-wrap">
                    <img
                        src={`${url}/images/${food.image}`}
                        alt={food.name}
                        className="food-details-image"
                    />
                </div>

                <h1 className="food-details-name">{food.name}</h1>

                <div className="food-details-body">
                    <p className="food-details-desc">{food.description}</p>

                    <div className="food-details-meta">
                        <div className="food-details-meta-item">
                            <span>Average Rating</span>
                            <strong>★ {ratingValue.toFixed(1)}</strong>
                        </div>
                        <div className="food-details-meta-item">
                            <span>Total Quantity Purchased</span>
                            <strong>{food.totalQuantityBought || 0}</strong>
                        </div>
                        <div className="food-details-meta-item">
                            <span>Total Orders</span>
                            <strong>{food.totalOrders || 0}</strong>
                        </div>
                        <div className="food-details-meta-item">
                            <span>Price</span>
                            <strong className="food-details-price">₹{food.price}</strong>
                        </div>
                    </div>
                </div>

                <div className="food-details-actions">
                    <QuantitySelector
                        quantity={quantity}
                        onIncrease={() => addToCart(food._id)}
                        onDecrease={() => removeFromCart(food._id)}
                    />
                    <button
                        type="button"
                        className="food-details-cart-btn"
                        onClick={() => navigate("/cart")}
                    >
                        Go To Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodDetails;