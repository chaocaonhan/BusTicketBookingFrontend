import React, { useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Navbar/Footer";

const Layout = ({ children }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <Navbar className="fixed top-0 left-0 w-full z-20 bg-white shadow-md" /> {/* Giả định Navbar là fixed */}
      <main className="pt-16"> {/* Padding-top bằng chiều cao Navbar */}
        {children}
      </main>
      <Footer></Footer>
    </>
  );
};

export default Layout;