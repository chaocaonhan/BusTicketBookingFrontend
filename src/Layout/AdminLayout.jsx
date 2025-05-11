// src/layout/AdminLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminNavbar from "../components/Admin/AdminNavbar";
import avatar from "../assets/avatar.png"; // Import ảnh từ assets

const AdminLayout = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Không tìm thấy token");
        }

        const response = await fetch(
          "http://localhost:8081/api/nguoidung/myInfor",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin người dùng");
        }

        const data = await response.json();
        if (data.code === 200) {
          setUserInfo(data.result);
        } else {
          throw new Error(data.message || "Lỗi khi lấy thông tin người dùng");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 transition-all duration-300">
        {/* Navbar */}
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          userInfo={userInfo}
          loading={loading}
          error={error}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white p-4 shadow-inner">
          <div className="text-center text-gray-600">
            <p>© 2025 Hệ thống quản lý vé xe khách</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
