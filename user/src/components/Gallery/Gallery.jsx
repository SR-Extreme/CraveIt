import React, { useContext, useEffect, useState } from "react";
import "./Gallery.css";
import { StoreContext } from "../../context/StoreContext";

const Gallery = () => {
    const { url, food_list } = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);

    const images = food_list.filter((item) => item.image);
    const previewCount = 8;
    const previewImages = images.slice(0, previewCount);
    const remaining = Math.max(images.length - previewCount, 0);

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    if (images.length === 0) {
        return null;
    }

    return (
        <section className="gallery" id="gallery">
            <div className="gallery-header">
                <h2>Gallery</h2>
                <p>A look at what’s cooking</p>
            </div>

            <div className="gallery-grid">
                {previewImages.map((item, index) => {
                    const isLastOverflow =
                        remaining > 0 && index === previewImages.length - 1;

                    return (
                        <button
                            type="button"
                            key={item._id}
                            className="gallery-item"
                            onClick={() => {
                                if (isLastOverflow) setIsOpen(true);
                            }}
                        >
                            <img
                                src={`${url}/images/${item.image}`}
                                alt={item.name}
                                loading="lazy"
                            />
                            {isLastOverflow && (
                                <span className="gallery-more">+{remaining}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {isOpen && (
                <div
                    className="gallery-modal-overlay"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="gallery-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="gallery-modal-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close gallery"
                        >
                            ×
                        </button>
                        <div className="gallery-modal-scroll">
                            {images.map((item) => (
                                <div className="gallery-modal-item" key={item._id}>
                                    <img
                                        src={`${url}/images/${item.image}`}
                                        alt={item.name}
                                        loading="lazy"
                                    />
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;