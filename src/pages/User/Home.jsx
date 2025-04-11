import React from "react";
import Hero from "../../components/feature/Hero/Hero";
import PopularRoutes from "../../components/feature/Hero/PopularRoutes";
import BusFeatures from "../../components/feature/Hero/BusFeatures";

const Home = () => {
  return (
    <div className="relative w-full min-h-screen">
      <Hero />
      <PopularRoutes className="px-3" />
      <BusFeatures />
    </div>
  );
};

export default Home;
