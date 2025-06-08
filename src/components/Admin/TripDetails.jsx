import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import OrderTickets from "./OrderTickets";

const TripDetails = () => {
  const location = useLocation();
  const { trip } = location.state || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8081/api/datve/findByChuyenXe/${trip.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách đơn đặt hàng");
        }

        const data = await response.json();
        console.log("API Response:", data);
        setOrders(Array.isArray(data.result) ? data.result : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (trip) {
      fetchOrders();
    }
  }, [trip]);

  const handleRowClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="mt-16 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold text-[#00613d] mb-4 text-center">
        Chi tiết chuyến {trip.tenTuyen} - {trip.gioKhoiHanh} -
        {trip.ngayKhoiHanh}
      </h1>
      <div className="trip-info max-w-[80%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-lg justify-center t">
        <p className="text-gray-700">
          <strong>Mã chuyến:</strong> {trip.id}
        </p>
        <p className="text-gray-700">
          <strong>Biển số xe:</strong> {trip.bienSo}
        </p>
        <p className="text-gray-700">
          <strong>Tài xế:</strong> {trip.taiXe}
        </p>
        <p className="text-gray-700">
          <strong>Điểm đi:</strong> {trip.diemDi}
        </p>
        <p className="text-gray-700">
          <strong>Điểm đến:</strong> {trip.diemDen}
        </p>
        <p className="text-gray-700">
          <strong>Giờ kết thúc:</strong> {trip.gioKetThuc}
        </p>
        <p className="text-gray-700">
          <strong>Giá vé:</strong> {trip.giaVe.toLocaleString()} VNĐ
        </p>
        <p className="text-gray-700">
          <strong>Loại xe:</strong> {trip.tenLoaiXe}
        </p>
        <p className="text-gray-700">
          <strong>Số ghế trống:</strong> {trip.soGheTrong}
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4 text-center">
        Danh sách đơn đặt
      </h2>

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
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "ID",
                  "Tên khách hàng",
                  "Số điện thoại",
                  "Trạng thái",
                  "Ngày đặt",
                  "Thanh toán",
                  "Tổng tiền",
                ].map((title) => (
                  <th
                    key={title}
                    className="py-3 px-4 text-left font-medium text-gray-600 uppercase tracking-wider"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-600 py-4">
                    Chưa có đơn đặt vé
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr
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
                        {order.trangThai || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Date(order.ngayDat).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.kieuThanhToan === "CASH" ? "Tiền mặt" : "VNPAY"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {(order.tongTien || 0).toLocaleString("vi-VN")} VND
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr>
                        <td colSpan="7" className="p-4">
                          <OrderTickets
                            orderId={order.id}
                            isExpanded={expandedOrderId === order.id}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
