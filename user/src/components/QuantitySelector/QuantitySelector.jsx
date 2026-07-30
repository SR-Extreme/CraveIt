import React from "react";
import "./QuantitySelector.css";

const QuantitySelector = ({
    quantity = 0,
    onIncrease,
    onDecrease,
    className = "",
}) => {
    if (!quantity) {
        return (
            <button
                type="button"
                className={`quantity-selector quantity-selector--empty ${className}`.trim()}
                onClick={onIncrease}
                aria-label="Add to cart"
            >
                +
            </button>
        );
    }

    return (
        <div className={`quantity-selector ${className}`.trim()}>
            <button
                type="button"
                className="quantity-selector__btn quantity-selector__btn--minus"
                onClick={onDecrease}
                aria-label="Decrease quantity"
            >
                −
            </button>
            <span className="quantity-selector__count">{quantity}</span>
            <button
                type="button"
                className="quantity-selector__btn quantity-selector__btn--plus"
                onClick={onIncrease}
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    );
};

export default QuantitySelector;