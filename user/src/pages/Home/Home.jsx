import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import InDemand from "../../components/InDemand/InDemand";
import Gallery from "../../components/Gallery/Gallery";
import InfiniteCarousel from "../../components/InfiniteCarousel/InfiniteCarousel";

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div className="home">
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <InDemand />
      <Gallery />
      <InfiniteCarousel />
    </div>
  );
};

export default Home;