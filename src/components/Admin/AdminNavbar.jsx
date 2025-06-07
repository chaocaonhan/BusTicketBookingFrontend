import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, ChevronDown } from "lucide-react";

import avatar from "../../assets/avatar.png";

const AdminNavbar = ({ toggleSidebar, userInfo, loading, error }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-3 text-gray-600 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
          >
            <Menu />
          </button>
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            Quản lý vé xe khách
          </span>
        </div>

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
                className="flex items-center text-gray-700 hover:text-orange-500"
              >
                <img
                  src={userInfo?.avatar ? userInfo.avatar : avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
                <span className="ml-2 font-medium">{userInfo.hoTen}</span>
                <ChevronDown />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{userInfo.hoTen}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {userInfo.email}
                    </p>
                  </div>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-lg  text-gray-700 hover:bg-gray-100"
                  >
                    Trang người dùng
                  </Link>
                  <div className="border-t">
                    <button
                      className="flex flex-row w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                      }}
                    >
                      <LogOut />
                      <p className="text-lg pl-4 align-middle">Đăng xuất</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
