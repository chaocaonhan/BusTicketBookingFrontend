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
      newCode[index] = value ? value : ""; // Xóa nếu không có giá trị
      setCode(newCode);

      // Tự động chuyển sang ô tiếp theo nếu nhập một số
      if (value && index < code.length - 1) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      let newCode = [...code];

      // Nếu ô hiện tại có giá trị, chỉ cần xóa giá trị mà không di chuyển
      if (newCode[index]) {
        newCode[index] = "";
        setCode(newCode);
      }
      // Nếu ô hiện tại trống, di chuyển về ô trước đó
      else if (index > 0) {
        document.getElementById(`code-input-${index - 1}`).focus();
      }
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const verificationCode = code.join("");
      await authService.verifyAccount(userId, verificationCode);
      setMessage("Xác nhận thành công! Bạn có thể đăng nhập.");
      setTimeout(() => navigate("/login"), 500);
    } catch (error) {
      setMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md text-white">
        <h2 className="text-2xl font-bold text-center">We sent you a code</h2>
        <p className="text-center text-gray-400">
          Please, enter it below to verify your email
        </p>
        {message && (
          <div className="p-3 mt-3 text-sm text-blue-400 bg-gray-700 rounded-md">
            {message}
          </div>
        )}
        <div className="flex justify-center gap-2 mt-4">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 text-center text-xl font-semibold bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>
        <button
          onClick={handleVerify}
          className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
        <p className="mt-3 text-center text-gray-400">
          Didn't receive the code?{" "}
          <span className="text-blue-400 cursor-pointer">Send Again</span>
        </p>
      </div>
    </div>
  );
};

export default VerifyAccount;
