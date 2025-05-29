import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/comon/Navbar";
import Footer from "../components/comon/Footer";

const Layout = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar className="fixed top-0 left-0 w-full z-20 bg-white shadow-md p-0" />

      {/* Tạo khoảng trống cho Navbar */}
      <div className="pt-16 flex-1 ">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
