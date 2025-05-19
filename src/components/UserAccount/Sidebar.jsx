import React from "react";
import avatar from "../../assets/avatar.png";

const Sidebar = ({ userData, onMenuClick, onAvatarClick }) => {
  const extractTenVaiTro = (vaiTroStr) => {
    const match = vaiTroStr.match(/tenvaitro=([^,]+)/);
    return match ? match[1] : "Không rõ";
  };

  return (
    <div className="w-64 rounded-lg bg-white shadow-md border border-orange-200">
      <div className="p-6 flex flex-col items-center border-b border-orange-100">
        <div
          className="w-28 h-28 rounded-full overflow-hidden bg-orange-100 mb-3 cursor-pointer hover:opacity-80 transition"
          onClick={onAvatarClick}
        >
          <img
            src={userData?.avatar || avatar}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-lg font-semibold">{userData?.hoTen || "User"}</h2>
        <p className="text-sm text-gray-500">
          {userData?.sdt
            ? userData.sdt.substring(0, 3) + "***" + userData.sdt.slice(-4)
            : "-"}
        </p>
        <p className="text-sm text-gray-500">
          {extractTenVaiTro(userData?.vaiTro)}
        </p>
      </div>

      <ul className="p-4 space-y-2">
        {[
          "Thông tin tài khoản",
          "Đổi mật khẩu",
          "Lịch sử mua vé",
          "Đăng xuất",
        ].map((item) => (
          <li
            key={item}
            className="py-2 px-3 rounded-lg hover:bg-orange-100 flex justify-between items-center cursor-pointer transition"
            onClick={() => onMenuClick(item)}
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
  );
};

export default Sidebar;
