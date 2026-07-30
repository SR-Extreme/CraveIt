import React, { useContext, useMemo } from "react";
import "./InfiniteCarousel.css";
import { StoreContext } from "../../context/StoreContext";

const InfiniteCarousel = () => {
    const { url, food_list } = useContext(StoreContext);

    const images = useMemo(
        () => food_list.filter((item) => item.image),
        [food_list]
    );

    if (images.length === 0) {
        return null;
    }

    const loopImages = [...images, ...images];

    return (
        <section className="infinite-carousel" aria-label="Food highlights carousel">
            <div className="infinite-carousel-track">
                {loopImages.map((item, index) => (
                    <div className="infinite-carousel-item" key={`${item._id}-${index}`}>
                        <img
                            src={`${url}/images/${item.image}`}
                            alt={item.name}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InfiniteCarousel;