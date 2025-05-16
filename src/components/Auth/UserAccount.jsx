import React, { useState, useEffect } from "react";
import avatar from "../../assets/avatar.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import OrderTickets from "../Admin/OrderTickets";
import Paid from "../../assets/Paid.png";
import axios from "axios";

const UserAccount = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTicketHistory, setShowTicketHistory] = useState(false);
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [formData, setFormData] = useState({
    hoTen: "",
    gioiTinh: "",
    ngaySinh: "",
    ngheNghiep: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:8081/api/nguoidung/myInfor",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (data.code === 200) {
          setUserData(data.result);
          setFormData({
            hoTen: data.result.hoTen || "",
            gioiTinh: data.result.gioiTinh || "",
            ngaySinh: data.result.ngaySinh
              ? new Date(data.result.ngaySinh).toISOString().split("T")[0]
              : "",
            ngheNghiep: data.result.ngheNghiep || "",
          });
        } else setError("Failed to fetch user data");

        setLoading(false);
      } catch (err) {
        setError(`Error: ${err.message || "Failed to connect to the server"}`);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/nguoidung/${userData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userData.id,
            hoTen: formData.hoTen,
            gioiTinh: formData.gioiTinh,
            email: userData.email,
            ngaySinh: formData.ngaySinh,
            ngheNghiep: formData.ngheNghiep,
            matKhau: userData.matKhau,
            trangThai: userData.trangThai,
            loaiDangKi: userData.loaiDangKi,
            vaiTro: userData.vaiTro,
            sdt: userData.sdt,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update user data");

      const data = await response.json();
      if (data.code === 200) {
        setUserData(data.result);
        setIsEditing(false);
        toast.success(data.message || "Cập nhật thông tin thành công!");
      } else {
        throw new Error(data.message || "Failed to update user data");
      }
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  const handleCancel = () => {
    setFormData({
      hoTen: userData.hoTen || "",
      gioiTinh: userData.gioiTinh || "",
      ngaySinh: userData.ngaySinh
        ? new Date(userData.ngaySinh).toISOString().split("T")[0]
        : "",
      ngheNghiep: userData.ngheNghiep || "",
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/nguoidung/changePassword/${userData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPass: passwordData.currentPassword,
            newPass: passwordData.newPassword,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to change password");

      const data = await response.json();
      if (data.code === 200) {
        if (data.message === "SUCCESS") {
          setShowPasswordModal(false);
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          toast.success("Đổi mật khẩu thành công!");
        } else if (data.message === "WRONG_PASS") {
          toast.error("Mật khẩu hiện tại không đúng!");
        } else {
          throw new Error(data.message || "Failed to change password");
        }
      } else {
        throw new Error(data.message || "Failed to change password");
      }
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi đổi mật khẩu");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8081/api/datve/getMyDonDat",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách đơn đặt hàng");
      }

      const data = await response.json();
      if (data.code === 200) {
        setOrders(data.result);
      } else {
        throw new Error(data.message || "Lỗi khi lấy danh sách đơn đặt hàng");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRowClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const onUpload = async () => {
    if (!file) return;
    try {
      const form = new FormData();
      form.append("file", file);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8081/api/nguoidung/upload-avatar",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setUserData({ ...userData, avatar: response.data.result });
        setShowImageModal(false);
        toast.success("Cập nhật ảnh đại diện thành công!");

        // Phát event để thông báo cập nhật avatar
        window.dispatchEvent(
          new CustomEvent("avatarUpdated", {
            detail: { avatar: response.data.result },
          })
        );
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi tải ảnh lên");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  if (!userData)
    return (
      <div className="flex justify-center items-center h-screen">
        No user data available
      </div>
    );

  const extractTenVaiTro = (vaiTroStr) => {
    const match = vaiTroStr.match(/tenvaitro=([^,]+)/);
    return match ? match[1] : "Không rõ";
  };

  return (
    <div className="flex px-6 py-4 min-h-screen bg-orange-50 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 rounded-lg bg-white shadow-md border border-orange-200">
        <div className="p-6 flex flex-col items-center border-b border-orange-100">
          <div
            className="w-28 h-28 rounded-full overflow-hidden bg-orange-100 mb-3 cursor-pointer hover:opacity-80 transition"
            onClick={() => setShowImageModal(true)}
          >
            <img
              src={userData?.avatar || avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold">{userData?.hoTen || "User"}</h2>
          <p className="text-sm text-gray-500">
            {userData?.sdt
              ? userData.sdt.substring(0, 3) + "***" + userData.sdt.slice(-4)
              : "-"}
          </p>

          <p className="text-sm text-gray-500">
            {extractTenVaiTro(userData?.vaiTro)}
          </p>
        </div>

        <ul className="p-4 space-y-2">
          {["Đổi mật khẩu", "Lịch sử mua vé", "Đăng xuất"].map((item) => (
            <li
              key={item}
              className="py-2 px-3 rounded-lg hover:bg-orange-100 flex justify-between items-center cursor-pointer transition"
              onClick={() => {
                if (item === "Đổi mật khẩu") {
                  setShowPasswordModal(true);
                } else if (item === "Đăng xuất") {
                  handleLogout();
                } else if (item === "Lịch sử mua vé") {
                  setShowTicketHistory(true);
                  fetchOrders();
                }
              }}
            >
              <span>{item}</span>
              <svg
                className="w-4 h-4 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center space-y-8">
          {!showTicketHistory ? (
            <>
              {/* Thông tin cá nhân */}
              <div className="bg-white w-full max-w-3xl shadow-md rounded-lg p-6 border border-orange-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold border-b border-orange-100 pb-2 text-orange-600">
                    Thông tin cá nhân
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Thay đổi
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Lưu
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-sm bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-500">Họ tên</div>
                  <div className="flex justify-between items-center">
                    {isEditing ? (
                      <input
                        type="text"
                        name="hoTen"
                        value={formData.hoTen}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                      />
                    ) : (
                      <span className="font-medium text-gray-700">
                        {userData.hoTen}
                      </span>
                    )}
                  </div>

                  <div className="text-gray-500">Giới tính</div>
                  <div className="flex justify-between items-center">
                    {isEditing ? (
                      <select
                        name="gioiTinh"
                        value={formData.gioiTinh}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    ) : (
                      <span className="font-medium text-gray-700">
                        {userData.gioiTinh}
                      </span>
                    )}
                  </div>

                  <div className="text-gray-500">Ngày sinh</div>
                  <div className="flex justify-between items-center">
                    {isEditing ? (
                      <input
                        type="date"
                        name="ngaySinh"
                        value={formData.ngaySinh}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                      />
                    ) : (
                      <span className="font-medium text-gray-700">
                        {userData.ngaySinh
                          ? new Date(userData.ngaySinh).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Chưa cập nhật"}
                      </span>
                    )}
                  </div>

                  <div className="text-gray-500">Nghề nghiệp</div>
                  <div className="flex justify-between items-center">
                    {isEditing ? (
                      <input
                        type="text"
                        name="ngheNghiep"
                        value={formData.ngheNghiep}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                      />
                    ) : (
                      <span className="font-medium text-gray-700">
                        {userData.ngheNghiep || "Chưa cập nhật"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bảo mật tài khoản */}
              <div className="bg-white w-full max-w-3xl shadow-md rounded-lg p-6 border border-orange-100">
                <h3 className="text-xl font-semibold border-b border-orange-100 pb-2 mb-4 text-orange-600">
                  Bảo mật tài khoản
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Liên kết Email</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">{userData.email}</span>
                      <button className="text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition">
                        Thay đổi
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Số điện thoại</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">
                        {userData.sdt
                          ? userData.sdt.substring(0, 3) +
                            "***" +
                            userData.sdt.slice(-4)
                          : "-"}
                      </span>
                      <button className="text-sm bg-gray-300 text-gray-600 px-3 py-1 rounded cursor-not-allowed">
                        Đã xác nhận
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Mật khẩu đăng nhập</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">******</span>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                      >
                        Thay đổi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Ticket History Section */
            <div className="bg-white w-full shadow-md rounded-lg p-6 border border-orange-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Lịch sử mua vé
                </h3>
                <button
                  onClick={() => setShowTicketHistory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                        Tên khách hàng
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                        Số điện thoại
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                        Ngày đặt
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                        Kiểu thanh toán
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                        Tổng tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <React.Fragment key={order.id}>
                        <tr
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleRowClick(order.id)}
                        >
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {order.id}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {order.tenHanhKhach || order.tenNguoiDat || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {order.sdt || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {order.trangThai || 0}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {formatDate(order.ngayDat)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {order.kieuThanhToan === "CASH"
                              ? "Tiền mặt"
                              : "VNPAY"}
                          </td>
                          <td
                            className="py-3 px-4 min-w-[200px] text-sm text-gray-900"
                            style={
                              order.trangThaiThanhToan === "PAID"
                                ? {
                                    backgroundImage: `url(${Paid})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition:
                                      "calc(100% - 40px) center",
                                    backgroundSize: "52px 40px",
                                  }
                                : {}
                            }
                          >
                            {(order.tongTien || 0).toLocaleString("vi-VN")} VND
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="7" className="p-0 w-full">
                            <OrderTickets
                              orderId={order.id}
                              isExpanded={expandedOrderId === order.id}
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Đổi mật khẩu
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Thay đổi ảnh đại diện
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="mb-4"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="max-w-[300px] rounded-lg mb-4"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={onUpload}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                >
                  Tải lên
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccount;
