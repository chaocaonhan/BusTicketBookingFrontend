import React from "react";
import Hero from "../components/Hero/Hero";
import Layout from "./Layout";
import PopularRoutes from "../components/Hero/PopularRoutes";
import BusFeatures from "../components/Hero/BusFeatures";

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
