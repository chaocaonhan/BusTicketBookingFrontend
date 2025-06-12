import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderTickets from "../Admin/OrderTickets";
import Paid from "../../assets/Paid.png";
import { MessageCircleMore } from "lucide-react";
import ConfirmDialog from "../comon/ConfirmDialog";

// Inject current time for testability
const isWithin10Minutes = (dateString, now = new Date()) => {
  if (!dateString) return false;
  const orderDate = new Date(dateString);
  if (isNaN(orderDate.getTime())) return false; // Handle invalid date
  const diffMs = now - orderDate;
  return diffMs >= 0 && diffMs <= 10 * 60 * 1000;
}; // Default to empty array

const MyBooking = ({
  expandedOrderId,
  handleRowClick,
  handleRatingClick,
  handleCancelOrder,
  handleRepayment,
  formatDate = (date) => new Date(date).toLocaleString("vi-VN"),
  itemsPerPage = 10,
}) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState("BOOKED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async (
    page = 0,
    size = itemsPerPage,
    status = activeTab
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8081/api/datve/getMyDonDatByTrangThai`,
        {
          params: {
            page,
            size,
            trangThaiDonDat: status,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setOrders(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi lấy danh sách đơn đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(newPage);
    }
  };

  const onCancelClick = (orderId, e) => {
    e.stopPropagation();
    setSelectedOrderId(orderId);
    setShowCancelDialog(true);
  };

  const onConfirmCancel = () => {
    if (selectedOrderId) {
      handleCancelOrder(selectedOrderId);
    }
    setShowCancelDialog(false);
  };

  return (
    <div className="bg-white w-full shadow-md rounded-lg p-6 border border-orange-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Lịch sử mua vé</h3>
        <div className="flex rounded-md bg-gray-100 overflow-hidden">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "BOOKED"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("BOOKED")}
          >
            Đã đặt
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "COMPLETED"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("COMPLETED")}
          >
            Lịch sử
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "CANCELED"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("CANCELED")}
          >
            Đã huỷ
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white" aria-label="Lịch sử mua vé">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Mã đơn hàng
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
                {activeTab === "COMPLETED" && (
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Đánh giá
                  </th>
                )}
                {activeTab === "BOOKED" && (
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  {" "}
                  {/* Key retained for list rendering */}
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => handleRowClick(order.id, e)}
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {order.id || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {order.trangThai || "Không xác định"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {order.ngayDat ? formatDate(order.ngayDat) : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {order.kieuThanhToan === "CASH" ? "Tiền mặt" : "VNPAY"}
                    </td>
                    <td
                      className="py-3 px-4 min-w-[200px] text-sm text-gray-900"
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
                      {order.kieuThanhToan === "VNPAY" &&
                        order.trangThaiThanhToan === "UNPAID" &&
                        isWithin10Minutes(order.ngayDat) && (
                          <button
                            className="ml-2 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRepayment(order.id, order.tongTien);
                            }}
                          >
                            Thanh toán
                          </button>
                        )}
                    </td>
                    {activeTab === "COMPLETED" && (
                      <td className="py-3 px-4 text-sm text-gray-900">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Order clicked:", order); // Debugging log
                            handleRatingClick(order);
                          }}
                          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                          aria-label={
                            order.daDanhGia ? "Xem đánh giá" : "Đánh giá"
                          }
                        >
                          <MessageCircleMore />
                          {order.daDanhGia ? "Xem đánh giá" : "Đánh giá"}
                        </button>
                      </td>
                    )}
                    {activeTab === "BOOKED" && (
                      <td className="py-3 px-4 text-sm text-gray-900">
                        <button
                          onClick={(e) => onCancelClick(order.id, e)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          aria-label="Hủy đơn"
                        >
                          Hủy đơn
                        </button>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td colSpan="7" className="p-0 w-full">
                      <OrderTickets
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
      )}

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
              «
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
              ‹
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={`px-3 py-1 rounded ${
                  currentPage === index
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
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
              ›
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
              »
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showCancelDialog}
        title="Xác nhận hủy đơn"
        description="Bạn có chắc chắn muốn hủy đơn hàng này?"
        cancelText="Không"
        confirmText="Có, hủy đơn"
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={onConfirmCancel}
      />
    </div>
  );
};

export default MyBooking;
