import React from "react";
import Hero from "../components/Hero/Hero";
import SearchBox from "../components/SearchBox/SearchBox";
import Layout from "./Layout";
import PopularRoutes from "../components/PopularRoutes";
import BusFeatures from "../components/BusFeatures";

const Home = () => {
  return (
    <Layout>
      <div className="relative w-full min-h-screen">
        <Hero></Hero>
        <PopularRoutes></PopularRoutes>
        <BusFeatures></BusFeatures>
      </div>
    </Layout>
  );
};

export default Home;
