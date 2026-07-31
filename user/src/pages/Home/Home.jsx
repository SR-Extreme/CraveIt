import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import InDemand from "../../components/InDemand/InDemand";
import InfiniteCarousel from "../../components/InfiniteCarousel/InfiniteCarousel";
import Gallery from "../../components/Gallery/Gallery";

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div className="home">
      <Header />

      <div className="home-main">
        <section className="home-block" id="explore-menu-section">
          <ExploreMenu category={category} setCategory={setCategory} />
        </section>

        <hr className="home-divider" />

        <section className="home-block">
          <FoodDisplay category={category} />
        </section>

        <hr className="home-divider" />

        <section className="home-block">
          <InDemand />
        </section>
      </div>

      <InfiniteCarousel />

      <div className="home-main home-main--end">
        <hr className="home-divider" />

        <section className="home-block">
          <Gallery />
        </section>
      </div>
    </div>
  );
};

export default Home;
