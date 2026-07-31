import React from "react";
import "./InfiniteCarousel.css";

const CAROUSEL_IMAGES = [
  "/carousal/Download_1.jpg",
  "/carousal/Download_2.jpg",
  "/carousal/Download_3.jpg",
  "/carousal/Download_4.avif",
  "/carousal/Download_5.jpg",
  "/carousal/Download_6.jpeg",
  "/carousal/Download_7.png",
  "/carousal/Download_8.jpg",
  "/carousal/Download_9.jpg",
  "/carousal/Download_10.jpg",
];

const InfiniteCarousel = () => {
  const loopImages = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];

  return (
    <section
      className="infinite-carousel"
      id="highlights"
      aria-label="Food highlights carousel"
    >
      <div className="infinite-carousel-track">
        {loopImages.map((src, index) => (
          <div className="infinite-carousel-item" key={`${src}-${index}`}>
            <img src={src} alt={`CraveIt highlight ${(index % CAROUSEL_IMAGES.length) + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfiniteCarousel;
