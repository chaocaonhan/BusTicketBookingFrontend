// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:8081/api/nguoidung/";

// Lưu JWT token vào localStorage
const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Lấy JWT token từ localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Xóa JWT token khỏi localStorage
const removeToken = () => {
  localStorage.removeItem("token");
};

// Lấy vai trò người dùng từ token
const getUserRole = () => {
  const token = getToken();
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  }
  return null;
};

const resetPassword = async (email) => {
  const response = await fetch(
    "http://localhost:8081/api/auth/reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send reset password email");
  }

  return response.json();
};

// Đăng ký người dùng mới
const register = async (userData) => {
  try {
    const response = await axios.post(API_URL + "register", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Đăng nhập
const login = async (email, matKhau) => {
  try {
    const response = await axios.post(API_URL + "login", { email, matKhau });
    if (response.data && response.data.data) {
      setToken(response.data.data);
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Đăng xuất
const logout = () => {
  removeToken();
  window.location.href = "/login";
};

// Kiểm tra xem người dùng đã đăng nhập chưa
const isAuthenticated = () => {
  return getToken() !== null;
};

// Xác thực tài khoản
const verifyAccount = async (userId, code) => {
  try {
    const response = await axios.get(
      `${API_URL}verify?userId=${userId}&token=${code}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const authService = {
  register,
  login,
  logout,
  verifyAccount,
  getToken,
  getUserRole,
  isAuthenticated,
};

export default authService;
