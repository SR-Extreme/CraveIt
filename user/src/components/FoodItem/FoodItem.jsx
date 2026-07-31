import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";
import QuantitySelector from "../QuantitySelector/QuantitySelector";
import { getImageUrl } from "../../utils/imageUrl";

const FoodItem = ({
    id,
    name,
    price,
    description,
    image,
    averageRating = 0,
}) => {
    const { cartItems, addToCart, removeFromCart } =
        useContext(StoreContext);
    const navigate = useNavigate();

    const quantity = cartItems?.[id] || 0;
    const ratingValue = Number(averageRating) || 0;

    return (
        <div className="food-item">
            <div className="food-item-img-container">
                <img
                    className="food-item-image"
                    src={getImageUrl(image)}
                    alt={name}
                />
                <div className="food-item-qty">
                    <QuantitySelector
                        quantity={quantity}
                        onIncrease={() => addToCart(id)}
                        onDecrease={() => removeFromCart(id)}
                    />
                </div>
            </div>

            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <span className="food-item-rating">
                        ★ {ratingValue.toFixed(1)}
                    </span>
                </div>

                <p className="food-item-desc">
                    {description?.length > 80
                        ? `${description.slice(0, 80)}...`
                        : description}
                </p>

                <div className="food-item-footer">
                    <p className="food-item-price">₹{price}</p>
                    <button
                        type="button"
                        className="food-item-view"
                        onClick={() => navigate(`/food/${id}`)}
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodItem;