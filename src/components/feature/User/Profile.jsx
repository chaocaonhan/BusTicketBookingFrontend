// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import authService from "../../../services/authService";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    hoTen: "",
    email: "",
    sdt: "",
    ngaySinh: "",
  });
  const navigate = useNavigate();

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = authService.getToken();
      if (!token) {
        navigate("/login");
        return;
      }

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

        if (response.data.code === 0) {
          const userData = response.data.result;
          setUserInfo(userData);
          setFormData({
            id: userData.id,
            hoTen: userData.hoTen,
            email: userData.email,
            sdt: userData.sdt,
            ngaySinh: userData.ngaySinh || "", // Assuming API might have this field
          });
        } else {
          setError("Không thể lấy thông tin người dùng");
        }
      } catch (err) {
        setError("Lỗi khi tải thông tin người dùng");
        if (err.response?.status === 401) {
          authService.logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle update
  const handleUpdate = async () => {
    if (isEditing) {
      // Submit update
      try {
        const token = authService.getToken();
        const updateData = {
          id: formData.id,
          hoTen: formData.hoTen,
          email: formData.email,
          sdt: formData.sdt,
          ngaySinh: formData.ngaySinh,
          matKhau: userInfo.matKhau, // Preserve existing password
          vaiTro: userInfo.vaiTro, // Preserve existing role
          loaiDangKi: userInfo.loaiDangKi, // Preserve existing registration type
          trangThai: userInfo.trangThai, // Preserve existing status
        };

        const response = await axios.put(
          `http://localhost:8081/api/nguoidung/${formData.id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.code === 200) {
          const updatedUser = response.data.result;
          setUserInfo(updatedUser);
          setFormData({
            id: updatedUser.id,
            hoTen: updatedUser.hoTen,
            email: updatedUser.email,
            sdt: updatedUser.sdt,
            ngaySinh: updatedUser.ngaySinh || "",
          });
          setIsEditing(false);
        } else {
          setError("Cập nhật thất bại");
        }
      } catch (err) {
        setError("Lỗi khi cập nhật thông tin");
        if (err.response?.status === 401) {
          authService.logout();
          navigate("/login");
        }
      }
    } else {
      // Enable editing
      setIsEditing(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <div className="flex items-center mb-6">
          <img src="/path-to-logo.png" alt="FUTAPay Logo" className="h-8" />
          <span className="ml-2 text-xl font-bold text-green-600">FUTAPay</span>
        </div>
        <nav className="space-y-2">
          <a
            href="#"
            className="flex items-center p-2 bg-orange-100 rounded-md text-orange-600"
          >
            <span className="mr-2">🧑</span> Thông tin tài khoản
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <span className="mr-2">⏳</span> Lịch sử mua vé
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <span className="mr-2">📍</span> Địa chỉ của bạn
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <span className="mr-2">🔑</span> Đặt lại mật khẩu
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-red-600 hover:bg-gray-100 rounded-md"
          >
            <span className="mr-2">🚪</span> Đăng xuất
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Thông tin tài khoản</h2>
          <p className="text-gray-500 mb-6">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </p>
          <div className="flex">
            <div className="w-1/3 flex justify-center">
              <img
                src="/path-to-placeholder-image.png"
                alt="Profile Placeholder"
                className="w-32 h-32 rounded-full"
              />
            </div>
            <div className="w-2/3 space-y-4">
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600">Họ và tên:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="hoTen"
                    value={formData.hoTen}
                    onChange={handleInputChange}
                    className="w-2/3 p-2 border rounded-md"
                  />
                ) : (
                  <p className="w-2/3 text-gray-900">{userInfo.hoTen}</p>
                )}
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600">Số điện thoại:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="sdt"
                    value={formData.sdt}
                    onChange={handleInputChange}
                    className="w-2/3 p-2 border rounded-md"
                  />
                ) : (
                  <p className="w-2/3 text-gray-900">{userInfo.sdt}</p>
                )}
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600">Giới tính:</label>
                {isEditing ? (
                  <select
                    name="gioiTinh"
                    onChange={handleInputChange}
                    className="w-2/3 p-2 border rounded-md"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                ) : (
                  <p className="w-2/3 text-gray-900">-</p>
                )}
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600">Email:</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-2/3 p-2 border rounded-md"
                  />
                ) : (
                  <p className="w-2/3 text-gray-900">{userInfo.email}</p>
                )}
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600">Ngày sinh:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ngaySinh"
                    value={formData.ngaySinh}
                    onChange={handleInputChange}
                    placeholder="DD/MM/YYYY"
                    className="w-2/3 p-2 border rounded-md"
                  />
                ) : (
                  <p className="w-2/3 text-gray-900">
                    {userInfo.ngaySinh || "-"}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500">Chọn ảnh</p>
              <p className="text-gray-400 text-sm">
                Dung lượng file tối đa 1 MB Định dạng: .JPEG, .PNG
              </p>
            </div>
            <button
              onClick={handleUpdate}
              className={`px-6 py-2 rounded-full text-white font-medium ${
                isEditing
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-orange-500 hover:bg-orange-600"
              } transition-colors duration-200`}
            >
              {isEditing ? "Cập nhật" : "Chỉnh sửa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
