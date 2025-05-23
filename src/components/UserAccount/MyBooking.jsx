import React from "react";
import OrderTickets from "../Admin/OrderTickets";
import Paid from "../../assets/Paid.png";
import { useState } from "react";
import { MessageCircleMore } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

function isWithin10Minutes(dateString) {
  const now = new Date();
  const orderDate = new Date(dateString);
  const diffMs = now - orderDate;
  return diffMs >= 0 && diffMs <= 10 * 60 * 1000;
}

const MyBooking = ({
  orders,
  expandedOrderId,
  handleRowClick,
  handleRatingClick,
  handleCancelOrder,
  handleRepayment,
  formatDate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // số đơn hàng hiển thị mỗi trang

  // Tính tổng số trang
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Lấy danh sách orders cho trang hiện tại
  const currentOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm chuyển trang
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white w-full shadow-md rounded-lg p-6 border border-orange-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Lịch sử mua vé</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
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
                <tr
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => handleRowClick(order.id, e)}
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {order.id}
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
                    {/* Hiển thị nút Thanh toán nếu đủ điều kiện */}
                    {order.kieuThanhToan === "VNPAY" &&
                      order.trangThaiThanhToan === "UNPAID" &&
                      isWithin10Minutes(order.ngayDat) && (
                        <button
                          className="ml-2 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-xs"
                          onClick={() =>
                            handleRepayment(order.id, order.tongTien)
                          }
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
                    >
                      <MessageCircleMore />
                      {order.daDanhGia ? "Xem đánh giá" : "Đánh giá"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelOrder(order.id);
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors"
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

      {/* //phân trang */}
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
    </div>
  );
};

export default MyBooking;
