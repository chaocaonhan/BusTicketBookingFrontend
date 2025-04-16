import React, { useState, useEffect } from "react";
import avatar from "../../../assets/avatar.png";

const UserAccount = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        if (data.code === 0) setUserData(data.result);
        else setError("Failed to fetch user data");

        setLoading(false);
      } catch (err) {
        setError(`Error: ${err.message || "Failed to connect to the server"}`);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
          <div className="w-28 h-28 rounded-full overflow-hidden bg-orange-100 mb-3">
            <img
              src={avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold">{userData.hoTen || "User"}</h2>
          <p className="text-sm text-gray-500">
            {userData.sdt
              ? userData.sdt.substring(0, 3) + "***" + userData.sdt.slice(-4)
              : "-"}
          </p>

          <p className="text-sm text-gray-500">
            {extractTenVaiTro(userData.vaiTro)}
          </p>
        </div>

        <ul className="p-4 space-y-2">
          {["Đổi mật khẩu", "Lịch sử mua vé", "Đăng xuất"].map((item) => (
            <li
              key={item}
              className="py-2 px-3 rounded-lg hover:bg-orange-100 flex justify-between items-center cursor-pointer transition"
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
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Thông tin cá nhân */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-orange-100">
            <h3 className="text-xl font-semibold border-b border-orange-100 pb-2 mb-4 text-orange-600">
              Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-500">Tài khoản</div>
              <div className="font-medium text-gray-700">
                {userData.id ? `cnhan${userData.id}` : "-"}
              </div>

              <div className="text-gray-500">Họ tên</div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  {userData.hoTen}
                </span>
                <button className="text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition">
                  Thay đổi
                </button>
              </div>

              <div className="text-gray-500">Giới tính</div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  {userData.gioiTinh}
                </span>
                <button className="text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition">
                  Thay đổi
                </button>
              </div>
            </div>
          </div>

          {/* Bảo mật tài khoản */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-orange-100">
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
                  <button className="text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition">
                    Thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
