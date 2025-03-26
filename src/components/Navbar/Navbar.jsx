// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { FaBars, FaX, FaUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

export const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Nav items
  const navItems = [
    { label: "TRANG CHỦ", link: "/" },
    { label: "LỊCH TRÌNH", link: "/lich-trinh" },
    { label: "TRA CỨU VÉ", link: "/" },
    { label: "TIN TỨC", link: "/" },
  ];

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.sub || "User");
      setIsLoggedIn(true);
    }

    const handleAuthChange = () => {
      setIsLoggedIn(authService.isAuthenticated());
      const token = authService.getToken();
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.sub || "User");
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setOpen(!open);
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setOpen(false);
  };

  return (
    <nav className="bg-[url('./assets/nav-bg.png')] fixed w-full top-0 left-0 lg:px-24 md:px-16 sm:px-7 px-4 py-4 backdrop-blur-lg transition-transform duration-300 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo section */}
        <Link to="/" className="text-4xl text-white font-bold">
          FutaBus
        </Link>

        {/* Hamburger menu for mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-2xl text-neutral-500 focus:outline-none"
          >
            {open ? (
              <FaX className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navlink and user section */}
        <div
          className={`
            fixed md:static 
            top-20 left-0 w-full md:w-auto 
            bg-white md:bg-transparent 
            md:flex items-center justify-end 
            gap-16 
            ${open ? "block" : "hidden"}
          `}
        >
          {/* Nav links */}
          <ul
            className="
              list-none 
              flex flex-col md:flex-row 
              items-start md:items-center 
              gap-4 md:gap-8 
              text-lg text-neutral-50 
              font-bold
              p-4 md:p-0
            "
          >
            {navItems.map((item, ind) => (
              <li key={ind} className="w-full md:w-auto">
                <Link
                  to={item.link}
                  className="block md:inline hover:text-red-500 ease-in-out duration-300"
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* User section */}
          <div className="p-4 md:p-0 relative">
            {isLoggedIn ? (
              <div className="group relative">
                <button
                  className="relative flex items-center gap-2 px-4 py-2 bg-white md:rounded-full rounded-xl text-orange-500 border border-red-500 font-normal hover:bg-gray-100 transition duration-300 
                               after:absolute after:inset-[-8px] after:content-[''] after:bg-transparent"
                >
                  <FaUser className="w-4 h-4" />
                  <span>{username}</span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 md:text-sm z-50 hidden group-hover:block">
                  <Link
                    to="/user/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Hồ sơ
                  </Link>
                  <Link
                    to="/user/bookings"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Vé của tôi
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="w-full md:w-fit px-6 md:px-4 py-2.5 md:py-1 bg-white border border-red-500 md:rounded-full rounded-xl text-base font-normal text-orange-500 hover:bg-gray-100 ease-in-out duration-300"
                onClick={() => {
                  navigate("/login");
                  toggleMenu();
                }}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
