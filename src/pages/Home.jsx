import React from "react";
import Hero from "../components/feature/Hero/Hero";
import Layout from "./Layout";
import PopularRoutes from "../components/feature/Hero/PopularRoutes";
import BusFeatures from "../components/feature/Hero/BusFeatures";

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
