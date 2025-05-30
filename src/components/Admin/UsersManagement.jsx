import { useState, useEffect } from "react";
import TableActions from "./TableActions";
import { toast } from "react-toastify";
import ConfirmDialog from "../comon/ConfirmDialog";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    hoTen: "",
    gioiTinh: "",
    email: "",
    matKhau: "",
    trangThai: "ACTIVE",
    loaiDangKi: "email",
    vaiTro: "USER",
    sdt: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchUsers = async (
    page = currentPage,
    size = pageSize,
    search = searchTerm
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Quyết định sử dụng API nào dựa trên từ khóa tìm kiếm
      let url = search.trim()
        ? `http://localhost:8081/api/nguoidung/search?keyword=${encodeURIComponent(
            search
          )}&page=${page}&size=${size}`
        : `http://localhost:8081/api/nguoidung/getPage?page=${page}&size=${size}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách người dùng");
      }

      const data = await response.json();
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setCurrentPage(data.number);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      fetchUsers(newPage);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout to prevent too many API calls
    const timeout = setTimeout(() => {
      fetchUsers(0, pageSize, value); // Reset to first page when searching
    }, 500);

    setSearchTimeout(timeout);
  };

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
      id: 0,
      hoTen: "",
      gioiTinh: "",
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
      id: user.id,
      hoTen: user.hoTen,
      gioiTinh: user.gioiTinh,
      email: user.email,
      matKhau: "", // Không hiển thị mật khẩu khi sửa
      trangThai: user.trangThai,
      loaiDangKi: user.loaiDangKi || "email",
      vaiTro: user.vaiTro,
      sdt: user.sdt,
    });
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const deleteUser = async (userId) => {
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

      const data = await response.json();

      if (data.code === 200) {
        toast.success("Xóa người dùng thành công!");
        fetchUsers(currentPage);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        toast.error(data.message || "Không thể xóa người dùng");
        setError(data.message || "Không thể xóa người dùng");
      }
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    }
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
    }
    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingUser
        ? `http://localhost:8081/api/nguoidung/${formData.id}`
        : "http://localhost:8081/api/nguoidung/createUser";

      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.code === 200) {
        setShowModal(false);
        toast.success(
          editingUser
            ? "Cập nhật người dùng thành công!"
            : "Thêm người dùng mới thành công!"
        );
        fetchUsers(currentPage);
      } else {
        toast.error(data.message || "Có lỗi xảy ra");
        setError(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      0,
      Math.min(
        currentPage - Math.floor(maxVisiblePages / 2),
        totalPages - maxVisiblePages
      )
    );
    startPage = Math.max(0, startPage);

    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-green-100 text-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Thêm người dùng
        </button>
      </div>

      {/* Search box */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400 pl-10"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto " style={{ minHeight: "500px" }}>
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
                    Giới tính
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
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {user.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {user.hoTen}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 truncate max-w-[200px]">
                        {user.email}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {user.gioiTinh}
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
                          onDelete={() => handleDeleteUser(user)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-4 text-center text-gray-500">
                      Không có dữ liệu người dùng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center mt-6">
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0}
                  className={`px-3 py-1 rounded ${
                    currentPage === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  &laquo;
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`px-3 py-1 rounded ${
                    currentPage === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  &lsaquo;
                </button>

                {generatePageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  &rsaquo;
                </button>
                <button
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={currentPage === totalPages - 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal for Add/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
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
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Họ tên</label>
                  <input
                    type="text"
                    name="hoTen"
                    value={formData.hoTen}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    required
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="text-sm text-gray-600">Mật khẩu</label>
                    <input
                      type="password"
                      name="matKhau"
                      value={formData.matKhau}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-600">Số điện thoại</label>
                  <input
                    type="text"
                    name="sdt"
                    value={formData.sdt}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Giới tính</label>
                  <select
                    name="gioiTinh"
                    value={formData.gioiTinh}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Trạng thái</label>
                  <select
                    name="trangThai"
                    value={formData.trangThai}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Vai trò</label>
                  <select
                    name="vaiTro"
                    value={formData.vaiTro}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  >
                    <option value="ADMIN">Quản trị viên</option>
                    <option value="EMPLOYEE">Nhân viên</option>
                    <option value="USER">Người dùng</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-3 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-100 text-green-800 rounded ring ring-transparent hover:ring-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                >
                  {editingUser ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add ConfirmDialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Xác nhận xóa người dùng"
        description={`Bạn có chắc chắn muốn xóa người dùng ${
          userToDelete?.hoTen || ""
        }?`}
        cancelText="Hủy"
        confirmText="Xóa"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default UsersManagement;
