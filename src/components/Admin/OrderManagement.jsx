import { useState, useEffect } from "react";
import TableActions from "./TableActions";
import OrderTickets from "./OrderTickets";
import React from "react";
import Paid2 from "../../assets/Paid2.png";
import Paid from "../../assets/Paid.png";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [formData, setFormData] = useState({
    tenNguoiDat: "",
    tongTien: 0,
    kieuThanhToan: "",
    trangThaiThanhToan: "",
    ghiChu: "",
    tenHanhKhach: "",
    email: "",
    sdt: "",
    soLuongVe: 0,
  });
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch orders with pagination and search
  const fetchOrders = async (
    page = currentPage,
    size = pageSize,
    searchValue = search
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = searchValue.trim()
        ? `http://localhost:8081/api/datve/search?keyword=${encodeURIComponent(
            searchValue
          )}&page=${page}&size=${size}`
        : `http://localhost:8081/api/datve/getPage?page=${page}&size=${size}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách đơn đặt hàng");
      }

      const data = await response.json();
      // Sửa đoạn này để tương thích với cả trường hợp không có code
      if (data.code === 200 || data.content) {
        setOrders(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setCurrentPage(data.number);
      } else {
        throw new Error(data.message || "Lỗi khi lấy danh sách đơn đặt hàng");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  // Debounce search
  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      fetchOrders(0, pageSize, value);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      fetchOrders(newPage);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setFormData({
      tenNguoiDat: order.tenNguoiDat || "",
      tongTien: order.tongTien || 0,
      kieuThanhToan: order.kieuThanhToan || "",
      trangThaiThanhToan: order.trangThaiThanhToan || "",
      ghiChu: order.ghiChu || "",
      tenHanhKhach: order.tenHanhKhach || "",
      email: order.email || "",
      sdt: order.sdt || "",
      soLuongVe: order.soLuongVe || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/datve/updateDonDat/${editingOrder.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok || data.code !== 200) {
        throw new Error(data.message || "Có lỗi xảy ra!");
      }

      setShowModal(false);
      setSuccessMessage("Cập nhật đơn đặt hàng thành công!");
      fetchOrders(currentPage);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRowClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Lọc đơn theo tab và tìm kiếm (áp dụng cho dữ liệu đã phân trang)
  const filteredOrders = orders.filter((order) => {
    // Lọc theo tab
    if (activeTab === "history" && order.trangThai !== "Đã thanh toán")
      return false;

    if (activeTab === "cancelled") {
      const status = (order.trangThai || "").trim().toLowerCase();
      if (status.startsWith("đã huỷ")) {
        const match = status.match(/đã huỷ\s*(\d+)\s*\/\s*(\d+)/);
        if (match) {
          const a = parseInt(match[1], 10);
          const b = parseInt(match[2], 10);
          if (a === b) return true;
          return false;
        }
        return true;
      }
      return false;
    }

    // Lọc theo tìm kiếm (tên khách, sdt, email)
    const keyword = search.toLowerCase();
    if (
      keyword &&
      !(
        (order.tenHanhKhach || "").toLowerCase().includes(keyword) ||
        (order.tenNguoiDat || "").toLowerCase().includes(keyword) ||
        (order.sdt || "").toLowerCase().includes(keyword) ||
        (order.email || "").toLowerCase().includes(keyword)
      )
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý đơn đặt hàng
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          {/* Tabs */}
          <div className="flex rounded-md bg-gray-100 overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "all"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("all")}
            >
              Tất cả
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "history"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Lịch sử
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "cancelled"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("cancelled")}
            >
              Đã huỷ
            </button>
          </div>
          {/* Search */}
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, SĐT, email..."
            value={search}
            onChange={handleSearch}
            className="ml-0 md:ml-4 px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400 w-full md:w-64"
          />
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Tên khách hàng
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Kiểu thanh toán
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr
                      key={order.id + "-main"}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(order.id)}
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.tenHanhKhach || order.tenNguoiDat || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.sdt || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.trangThai || 0}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(order.ngayDat)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.kieuThanhToan === "CASH" ? "Tiền mặt" : "VNPAY"}
                      </td>
                      <td
                        className={`py-3 px-4 min-w-[200px] text-sm text-gray-900`}
                        style={
                          order.trangThaiThanhToan === "PAID"
                            ? {
                                backgroundImage: `url(${Paid})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "calc(100% - 40px) center",
                                backgroundSize: "52px 40px",
                              }
                            : {}
                        }
                      >
                        {(order.tongTien || 0).toLocaleString("vi-VN")} VND
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        <TableActions onEdit={() => handleEditOrder(order)} />
                      </td>
                    </tr>
                    <tr key={order.id + "-expand"}>
                      <td colSpan="6" className="p-0 w-full">
                        <OrderTickets
                          className=""
                          orderId={order.id}
                          isExpanded={expandedOrderId === order.id}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
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

      {/* Modal for Edit Order */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Chỉnh sửa đơn đặt hàng
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
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Tên người đặt</label>
                  <input
                    type="text"
                    name="tenNguoiDat"
                    value={formData.tenNguoiDat}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Tên hành khách
                  </label>
                  <input
                    type="text"
                    name="tenHanhKhach"
                    value={formData.tenHanhKhach}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
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
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Số điện thoại</label>
                  <input
                    type="text"
                    name="sdt"
                    value={formData.sdt}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Số lượng vé</label>
                  <input
                    type="number"
                    name="soLuongVe"
                    value={formData.soLuongVe}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Kiểu thanh toán
                  </label>
                  <select
                    name="kieuThanhToan"
                    value={formData.kieuThanhToan}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  >
                    <option value="CASH">Tiền mặt</option>
                    <option value="VNPAY">VNPAY</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Thanh toán</label>
                  <select
                    name="trangThaiThanhToan"
                    value={formData.trangThaiThanhToan}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  >
                    <option value="Chưa thanh toán">Chưa thanh toán</option>
                    <option value="Đã thanh toán">Đã thanh toán</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Ghi chú</label>
                  <textarea
                    name="ghiChu"
                    value={formData.ghiChu}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    rows="3"
                  />
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
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
