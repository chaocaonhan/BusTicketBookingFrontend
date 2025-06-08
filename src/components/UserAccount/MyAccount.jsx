import React from "react";

const MyAccount = ({
  userData,
  isEditing,
  formData,
  handleInputChange,
  handleSave,
  handleCancel,
  setIsEditing,
  setShowPasswordModal,
}) => {
  return (
    <div className="flex flex-col items-center space-y-8">
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
                className="text-sm bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
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
                className="text-sm bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
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
                  ? new Date(userData.ngaySinh).toLocaleDateString("vi-VN")
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
              <button className="text-sm bg-gray-300 text-gray-600 px-3 py-1 rounded cursor-not-allowed">
                Đã xác nhận
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
    </div>
  );
};

export default MyAccount;
