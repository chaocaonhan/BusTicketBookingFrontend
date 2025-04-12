import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../../services/authService";

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [code, setCode] = useState(new Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!isNaN(value)) {
      let newCode = [...code];
      newCode[index] = value || "";
      setCode(newCode);

      if (value && index < code.length - 1) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      let newCode = [...code];
      if (newCode[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        document.getElementById(`code-input-${index - 1}`).focus();
      }
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const verificationCode = code.join("");
      await authService.verifyAccount(userId, verificationCode);
      setMessage("✅ Xác nhận thành công! Bạn có thể đăng nhập.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage("❌ Mã xác nhận không chính xác hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-orange-200 text-gray-800">
        <h2 className="text-2xl font-bold text-center text-orange-600">
          Chúng tôi đã gửi mã xác nhận
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Vui lòng nhập mã gồm 6 chữ số để xác minh email của bạn
        </p>

        {message && (
          <div className="p-3 mb-3 text-sm bg-orange-100 text-orange-700 border border-orange-200 rounded-md">
            {message}
          </div>
        )}

        <div className="flex justify-center gap-2 mb-4">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 text-center text-xl font-semibold border border-orange-300 rounded-md bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition"
          disabled={loading}
        >
          {loading ? "Đang xác minh..." : "Xác minh"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Không nhận được mã?{" "}
          <span className="text-orange-500 hover:underline cursor-pointer">
            Gửi lại
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyAccount;
