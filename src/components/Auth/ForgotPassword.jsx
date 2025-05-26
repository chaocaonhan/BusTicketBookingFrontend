import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8081/api/nguoidung/datLaiMatKhau",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.text();

      if (response.ok) {
        toast.success("Mật khẩu mới đã được gửi đến email của bạn");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(data || "Không thể đặt lại mật khẩu");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-xl p-8 border border-orange-200">
          <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
            Quên mật khẩu
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Vui lòng nhập địa chỉ email của bạn để nhận mật khẩu mới
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                className="w-full px-4 py-3 bg-orange-50 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-300 
                ${
                  loading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
            >
              {loading ? "Đang xử lý..." : "Gửi"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a
              href="/login"
              className="text-orange-500 font-medium hover:underline transition"
            >
              Quay lại đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
