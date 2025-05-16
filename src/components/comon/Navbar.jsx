// src/components/Navbar.jsx
import React, { useEffect, useState, useRef } from "react";
import { FaBars, FaX } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import axios from "axios";
import avatar from "../../assets/avatar.png"; // Import ảnh từ assets

export const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Nav items
  const navItems = [
    { label: "TRANG CHỦ", link: "/" },
    { label: "LỊCH TRÌNH", link: "/lich-trinh" },
    { label: "TRA CỨU VÉ", link: "/" },
    { label: "TIN TỨC", link: "/" },
  ];

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = authService.getToken();
      if (token) {
        setLoading(true);
        try {
          const response = await axios.get(
            "http://localhost:8081/api/nguoidung/myInfor",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.code === 200) {
            const userData = response.data.result;
            setUserInfo({
              hoTen: userData.hoTen,
              avatar: userData.avatar || avatar,
            });
            setIsAdmin(userData.vaiTro.includes("ADMIN"));
            setIsLoggedIn(true);
          } else {
            setError("Không thể lấy thông tin người dùng");
          }
        } catch (err) {
          setError("Lỗi khi tải thông tin người dùng");
          authService.logout();
          setIsLoggedIn(false);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserInfo();

    const handleAuthChange = () => {
      setIsLoggedIn(authService.isAuthenticated());
      fetchUserInfo();
    };

    // Thêm event listener cho avatarUpdated
    const handleAvatarUpdate = (event) => {
      setUserInfo((prev) => ({
        ...prev,
        avatar: event.detail.avatar,
      }));
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("avatarUpdated", handleAvatarUpdate);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setOpen(!open);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserInfo(null);
    setIsAdmin(false);
    setOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-[url('./assets/nav-bg.png')] fixed w-full top-0 left-0 lg:px-24 md:px-16 sm:px-7 px-4 py-4 backdrop-blur-lg transition-transform duration-300 z-50 p-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo section */}
        <Link to="/" className="text-4xl text-white font-bold">
          SaoVietBus
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
              text-lg 
              font-bold
              p-4 md:p-0
              text-orange-500 md:text-neutral-50
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
              <div className="flex items-center" ref={dropdownRef}>
                {loading ? (
                  <div className="animate-pulse flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="ml-3 w-24 h-4 bg-gray-200 rounded"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500">Lỗi: {error}</div>
                ) : userInfo ? (
                  <div className="relative">
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center text-gray-700 hover:text-blue-600"
                    >
                      <img
                        src={userInfo?.avatar || avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      />
                      <span className="ml-2 font-medium text-white">
                        {userInfo.hoTen}
                      </span>
                      <svg
                        className="w-4 h-4 ml-1 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 md:text-sm z-50">
                        <Link
                          to="/user/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            toggleMenu();
                            toggleDropdown();
                          }}
                        >
                          Hồ sơ
                        </Link>
                        <Link
                          to="/user/bookings"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            toggleMenu();
                            toggleDropdown();
                          }}
                        >
                          Vé của tôi
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                              toggleMenu();
                              toggleDropdown();
                            }}
                          >
                            Quản lý hệ thống
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}
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
