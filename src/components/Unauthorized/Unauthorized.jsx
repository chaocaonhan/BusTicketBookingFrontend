import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    const role = authService.getUserRole();
    if (role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (role === "DRIVER") {
      navigate("/driver/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-orange-500 mb-2">
          Truy Cập Bị Từ Chối
        </h2>
        <p className="text-gray-600 mb-6">
          Bạn không có quyền truy cập trang này. Vui lòng quay lại trang chính
          hoặc đăng xuất.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition"
            onClick={handleGoBack}
          >
            Quay lại trang chính
          </button>
          <button
            className="border-2 border-orange-500 text-orange-500 hover:bg-orange-100 font-semibold py-2 px-4 rounded-xl transition"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
