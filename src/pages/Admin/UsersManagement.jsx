// src/pages/UsersManagement.jsx
import { useState, useEffect } from "react";
import TableActions from "../../components/Admin/TableActions";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    matKhau: "",
    trangThai: "ACTIVE",
    loaiDangKi: "email",
    vaiTro: "USER",
    sdt: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/nguoidung", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách người dùng");
      }

      const data = await response.json();
      if (data.code === 200) {
        setUsers(data.result);
      } else {
        throw new Error(data.message || "Lỗi khi lấy danh sách người dùng");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      hoTen: "",
      email: "",
      matKhau: "",
      trangThai: "ACTIVE",
      loaiDangKi: "email",
      vaiTro: "USER",
      sdt: "",
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      hoTen: user.hoTen,
      email: user.email,
      matKhau: "", // Không hiển thị mật khẩu khi sửa
      trangThai: user.trangThai,
      loaiDangKi: user.loaiDangKi || "email",
      vaiTro: user.vaiTro,
      sdt: user.sdt,
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8081/api/nguoidung/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể xóa người dùng");
        }

        fetchUsers(); // Refresh danh sách sau khi xóa
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingUser
        ? `http://localhost:8081/api/nguoidung/${editingUser.id}`
        : "http://localhost:8081/api/nguoidung";

      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Không thể ${editingUser ? "cập nhật" : "thêm"} người dùng`
        );
      }

      setShowModal(false);
      fetchUsers(); // Refresh danh sách sau khi thêm/sửa
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Thêm người dùng
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  SĐT
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Loại đăng kí
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{user.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {user.hoTen}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {user.sdt}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.trangThai === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.trangThai}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {user.vaiTro}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {user.loaiDangKi || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <TableActions
                      onEdit={() => handleEditUser(user)}
                      onDelete={() => handleDeleteUser(user.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="hoTen"
                >
                  Họ tên
                </label>
                <input
                  type="text"
                  id="hoTen"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              {!editingUser && (
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="matKhau"
                  >
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="matKhau"
                    name="matKhau"
                    value={formData.matKhau}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required={!editingUser}
                  />
                </div>
              )}

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="sdt"
                >
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="sdt"
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="trangThai"
                >
                  Trạng thái
                </label>
                <select
                  id="trangThai"
                  name="trangThai"
                  value={formData.trangThai}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Không hoạt động</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="vaiTro"
                >
                  Vai trò
                </label>
                <select
                  id="vaiTro"
                  name="vaiTro"
                  value={formData.vaiTro}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="ADMIN">Quản trị viên</option>
                  <option value="EMPLOYEE">Nhân viên</option>
                  <option value="USER">Người dùng</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="loaiDangKi"
                >
                  Loại đăng kí
                </label>
                <select
                  id="loaiDangKi"
                  name="loaiDangKi"
                  value={formData.loaiDangKi}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="email">Email</option>
                  <option value="google">Google</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {editingUser ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
