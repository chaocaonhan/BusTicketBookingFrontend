import React from "react";
import BusSearch from "../../components/feature/Hero/SearchBar";
import PopularRoutes from "../../components/feature/Hero/PopularRoutes";
import BusFeatures from "../../components/feature/Hero/BusFeatures";

const Home = () => {
  return (
    <div className="relative w-full min-h-screen">
      <BusSearch />
      <PopularRoutes className="px-3" />
      <BusFeatures />
    </div>
  );
};

export default Home;
