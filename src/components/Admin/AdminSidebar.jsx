import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  House,
  Users,
  Route,
  MapPinned,
  BusFront,
  Star,
  Tickets,
  Bus,
  TextSearch,
  Percent,
  Diameter,
} from "lucide-react";

const AdminSidebar = ({ collapsed }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const menuItems = [
    // {
    //   title: "Tổng quan",
    //   icon: <House />,
    //   path: "/admin/dashboard",
    //   submenu: null,
    // },
    {
      title: "Quản lý người dùng",
      icon: <Users />,
      path: "/admin/users",
      submenu: null,
    },

    {
      title: "Quản lý đơn đặt",
      icon: <Tickets />,
      path: "/admin/manage-orders",
      submenu: null,
    },
    {
      title: "Quản lý tuyến xe",
      icon: <Route />,
      path: "/admin/routes",
      submenu: null,
    },
    {
      title: "Quản lý tỉnh thành",
      icon: <MapPinned />,
      path: "/admin/province",
      submenu: null,
    },
    {
      title: "Quản lý xe",
      icon: <Bus />,
      path: "/admin/vehicles",
      submenu: null,
    },
    {
      title: "Quản lý tài xế",
      icon: <Diameter />,
      path: "/admin/manage-drivers",
      submenu: null,
    },
    {
      title: "Quản lý chuyến xe",
      icon: <BusFront />,
      path: "/admin/manage-trips",
      submenu: null,
    },
    {
      title: "Đánh giá",
      icon: <Star />,
      path: "/admin/rating",
      submenu: null,
    },
    {
      title: "Mã giảm giá",
      icon: <Percent />,
      path: "/admin/discount",
      submenu: null,
    },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-screen bg-gray-800 text-white transition-all duration-300 pt-16`}
    >
      <div className="h-full py-4 px-3 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`flex items-center w-full p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 ${
                      activeSubmenu === item.title ? "bg-gray-700" : ""
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 ml-3 text-left whitespace-nowrap">
                          {item.title}
                        </span>
                        <svg
                          className={`w-6 h-6 ${
                            activeSubmenu === item.title
                              ? "transform rotate-180"
                              : ""
                          }`}
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
                      </>
                    )}
                  </button>
                  {!collapsed && activeSubmenu === item.title && (
                    <ul className="py-2 space-y-2 pl-7">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `flex items-center p-2 text-base font-normal rounded-lg ${
                                isActive
                                  ? "bg-gray-700 text-white"
                                  : "text-gray-300 hover:bg-gray-700"
                              }`
                            }
                          >
                            {subItem.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-normal rounded-lg ${
                      isActive
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      {item.title}
                    </span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default AdminSidebar;
