import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import axios from "axios";
import Sidebar from "../components/UserAccount/Sidebar";
import MyAccount from "../components/UserAccount/MyAccount";
import MyBooking from "../components/UserAccount/MyBooking";
import {
  PasswordModal,
  ImageModal,
  RatingModal,
} from "../components/UserAccount/Modals";

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
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existingRating, setExistingRating] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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

  const handleRowClick = (orderId, event) => {
    if (event.target.closest("button")) {
      return;
    }
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

  const handleRatingSubmit = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/danhGia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          soSao: rating,
          noiDung: comment,
          maDonDatVe: orderId,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể gửi đánh giá");
      }

      const data = await response.json();
      if (data.code === 200) {
        toast.success("Gửi đánh giá thành công!");
        setShowRatingModal(false);
        setRating(0);
        setComment("");
        fetchOrders();
      } else {
        throw new Error(data.message || "Lỗi khi gửi đánh giá");
      }
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  const fetchExistingRating = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/danhGia/getByIdDonDat/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể lấy thông tin đánh giá");
      }

      const data = await response.json();
      if (data.code === 200) {
        setExistingRating(data.result);
      }
    } catch (err) {
      console.error("Error fetching rating:", err);
    }
  };

  const handleRatingClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowRatingModal(true);
    if (orders.find((o) => o.id === orderId)?.daDanhGia) {
      fetchExistingRating(orderId);
    }
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedOrderId(null);
    setRating(0);
    setComment("");
    setExistingRating(null);
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8081/api/datve/huyDon/${orderId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok || data.code !== 200) {
          throw new Error(data.message || "Có lỗi xảy ra khi hủy đơn hàng!");
        }

        toast.success("Hủy đơn hàng thành công!");
        fetchOrders();
      } catch (err) {
        toast.error(err.message || "Có lỗi xảy ra khi hủy đơn hàng");
      }
    }
  };

  const handleMenuClick = (item) => {
    if (item === "Đổi mật khẩu") {
      setShowPasswordModal(true);
    } else if (item === "Đăng xuất") {
      handleLogout();
    } else if (item === "Lịch sử mua vé") {
      setShowTicketHistory(true);
      fetchOrders();
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

  return (
    <div className="flex px-6 py-4 min-h-screen bg-orange-50 text-gray-800">
      <Sidebar
        userData={userData}
        onMenuClick={handleMenuClick}
        onAvatarClick={() => setShowImageModal(true)}
      />

      <div className="flex-1 p-6">
        {showTicketHistory ? (
          <MyBooking
            orders={orders}
            expandedOrderId={expandedOrderId}
            handleRowClick={handleRowClick}
            handleRatingClick={handleRatingClick}
            handleCancelOrder={handleCancelOrder}
            formatDate={formatDate}
          />
        ) : (
          <MyAccount
            userData={userData}
            isEditing={isEditing}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            setIsEditing={setIsEditing}
            setShowPasswordModal={setShowPasswordModal}
          />
        )}
      </div>

      <PasswordModal
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
        passwordData={passwordData}
        handlePasswordChange={handlePasswordChange}
        handlePasswordSubmit={handlePasswordSubmit}
      />

      <ImageModal
        showImageModal={showImageModal}
        setShowImageModal={setShowImageModal}
        preview={preview}
        onFileChange={onFileChange}
        onUpload={onUpload}
      />

      <RatingModal
        showRatingModal={showRatingModal}
        handleCloseRatingModal={handleCloseRatingModal}
        selectedOrderId={selectedOrderId}
        orders={orders}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        existingRating={existingRating}
        handleRatingSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default UserAccount;
