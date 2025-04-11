import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Navbar/Footer";

const Layout = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Navbar className="fixed top-0 left-0 w-full z-20 bg-white shadow-md p-0" />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
