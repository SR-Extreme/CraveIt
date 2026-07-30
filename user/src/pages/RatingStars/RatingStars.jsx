import React from "react";
import "./RatingStars.css";

const RatingStars = ({
    value = 0,
    onChange,
    disabled = false,
    size = "md",
}) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div
            className={`rating-stars rating-stars--${size} ${disabled ? "rating-stars--disabled" : ""
                }`}
            role="radiogroup"
            aria-label="Order rating"
        >
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`rating-stars__star ${star <= value ? "is-active" : ""
                        }`}
                    onClick={() => {
                        if (!disabled) onChange?.(star);
                    }}
                    disabled={disabled}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    aria-checked={star === value}
                    role="radio"
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default RatingStars;