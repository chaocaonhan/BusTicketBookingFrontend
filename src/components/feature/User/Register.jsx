import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    matKhau: "",
    SDT: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.register(formData);
      console.log("Response from API:", response); // Kiểm tra phản hồi

      const userId = response?.result?.id; // Lấy userId đúng cách
      if (userId) {
        navigate(`/verify?userId=${userId}`);
      } else {
        setMessage("Lỗi hệ thống: Không lấy được userId.");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setMessage(error?.message || "Đã xảy ra lỗi, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl border border-orange-200">
        <h2 className="text-2xl font-bold text-center text-orange-600">
          Đăng Ký
        </h2>

        {message && (
          <div
            className={`p-3 mt-3 text-sm rounded-md font-medium ${
              message.includes("thành công")
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label
              htmlFor="hoTen"
              className="block text-sm font-medium text-gray-600"
            >
              Họ tên
            </label>
            <input
              type="text"
              id="hoTen"
              name="hoTen"
              value={formData.hoTen}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-orange-300 rounded-lg bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-orange-300 rounded-lg bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="matKhau"
              className="block text-sm font-medium text-gray-600"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="matKhau"
              name="matKhau"
              value={formData.matKhau}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-orange-300 rounded-lg bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="SDT"
              className="block text-sm font-medium text-gray-600"
            >
              Số điện thoại
            </label>
            <input
              type="text"
              id="SDT"
              name="SDT"
              value={formData.SDT}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-orange-300 rounded-lg bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700"
            }`}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-orange-500 font-medium hover:underline"
            >
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
