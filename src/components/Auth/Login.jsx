import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "@/utils/toastConfig";
import authService from "../../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "ccnhan1288@gmail.com",
    matKhau: "ccnhan1288@gmail.com",
  });
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
    if (!formData.email.trim()) {
      showError("Vui lòng nhập email!");
      return;
    }

    if (!formData.matKhau.trim()) {
      showError("Vui lòng nhập mật khẩu!");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.login(
        formData.email,
        formData.matKhau
      );

      showSuccess("Đăng nhập thành công!");

      window.dispatchEvent(new Event("authChange"));

      const role = authService.getUserRole();
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "DRIVER") {
        navigate("/driver/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      // Hiển thị thông báo lỗi
      showError("Mật khẩu hoặc email không đúng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-xl p-8 border border-orange-200 transition hover:shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-orange-600 mb-6">
            Đăng Nhập
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-orange-50 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
              />
            </div>

            <div className="mb-6">
              <div className="flex flex-row justify-between items-center mb-2">
                <label
                  htmlFor="matKhau"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mật khẩu
                </label>
                <p className="text-sm text-gray-600 mt-2">
                  <a
                    href="/forgot-password"
                    className="text-orange-500 font-medium hover:underline transition"
                  >
                    Quên mật khẩu?
                  </a>
                </p>
              </div>
              <input
                type="password"
                className="w-full px-4 py-3 bg-orange-50 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                id="matKhau"
                name="matKhau"
                value={formData.matKhau}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-300 ${
                loading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="text-orange-500 font-medium hover:underline transition"
              >
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
