import React, { useState } from "react";
import OrderTickets from "../Admin/OrderTickets";
import Paid from "../../assets/Paid.png";
import { MessageCircleMore } from "lucide-react";
import ConfirmDialog from "../comon/ConfirmDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

// Inject current time for testability
const isWithin10Minutes = (dateString, now = new Date()) => {
  if (!dateString) return false;
  const orderDate = new Date(dateString);
  if (isNaN(orderDate.getTime())) return false; // Handle invalid date
  const diffMs = now - orderDate;
  return diffMs >= 0 && diffMs <= 10 * 60 * 1000;
};

const MyBooking = ({
  orders = [], // Default to empty array
  expandedOrderId,
  handleRowClick,
  handleRatingClick,
  handleCancelOrder,
  handleRepayment,
  formatDate = (date) => new Date(date).toLocaleString("vi-VN"), // Default formatDate
  itemsPerPage = 10, // Configurable items per page
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Calculate total pages
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Get orders for the current page
  const currentOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const onPageChange = (page) => {
    setCurrentPage(page);
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
      </div>
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
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Đánh giá
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentOrders.map((order) => (
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
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRatingClick(order.id);
                      }}
                      className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                      aria-label={order.daDanhGia ? "Xem đánh giá" : "Đánh giá"}
                    >
                      <MessageCircleMore />
                      {order.daDanhGia ? "Xem đánh giá" : "Đánh giá"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <button
                      onClick={(e) => onCancelClick(order.id, e)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      aria-label="Hủy đơn"
                    >
                      Hủy đơn
                    </button>
                  </td>
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

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={index + 1 === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>

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
