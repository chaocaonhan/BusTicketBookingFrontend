"use client";

import { useState } from "react";
import axios from "axios";
import OrderTickets from "../Admin/OrderTickets"; // Thêm dòng này ở đầu file

function FindMyBooking() {
  const [ticketCode, setTicketCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBookingInfo(null);
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8081/api/datve/findByIdAndPhoneNumber",
        {
          maDonDatVe: ticketCode,
          sdt: phoneNumber,
        }
      );
      if (res.data.code === 200) {
        setBookingInfo(res.data.result);
      } else {
        setError(
          "Không tìm thấy thông tin vé. Vui lòng kiểm tra lại mã vé và số điện thoại."
        );
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm định dạng ngày
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return (
      date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN")
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6 ">
      <div className="max-w-3xl items-center mx-auto">
        <h1 className="text-3xl font-medium text-orange-500 mb-8">
          Kiểm tra thông tin vé
        </h1>

        <form onSubmit={handleSubmit} className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label htmlFor="ticketCode" className="block text-gray-700">
                Mã vé
              </label>
              <input
                id="ticketCode"
                type="text"
                placeholder="Nhập mã đơn đặt vé"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-gray-700">
                Số điện thoại
              </label>
              <input
                id="phoneNumber"
                type="text"
                placeholder="Nhập số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-orange-400 hover:bg-orange-500 text-white font-medium h-12 rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? "Đang kiểm tra..." : "KIỂM TRA VÉ"}
            </button>
          </div>
        </form>
      </div>

      {/* Hiển thị lỗi */}
      {error && (
        <div className="mb-6 text-center text-red-500 font-medium">{error}</div>
      )}

      {/* Hiển thị thông tin vé nếu có */}
      {bookingInfo && (
        <div>
          <section className="w-[80%] mx-auto rounded-lg shadow-lg p-8 mb-8 bg-orange-200">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Thông tin vé của bạn
              </h2>
              <p className="text-gray-600">
                Quý khách vui lòng kiểm tra lại thông tin vé bên dưới.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn đặt vé:</span>
                <span className="font-medium">{bookingInfo.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tên người đặt:</span>
                <span className="font-medium">{bookingInfo.tenNguoiDat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="font-medium">{bookingInfo.sdt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{bookingInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày đặt:</span>
                <span className="font-medium">
                  {formatDate(bookingInfo.ngayDat)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-medium text-orange-500">
                  {bookingInfo.tongTien.toLocaleString("vi-VN")} VND
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức thanh toán:</span>
                <span className="font-medium">{bookingInfo.kieuThanhToan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái thanh toán:</span>
                <span className="font-medium text-green-600">
                  {bookingInfo.trangThaiThanhToan === "PAID"
                    ? "Đã thanh toán"
                    : bookingInfo.trangThaiThanhToan}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái vé:</span>
                <span className="font-medium">{bookingInfo.trangThai}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tên hành khách:</span>
                <span className="font-medium">{bookingInfo.tenHanhKhach}</span>
              </div>
            </div>

            {/* Hiển thị chi tiết vé bên dưới */}
          </section>

          <div className="mt-8 w-[80%] mx-auto items-center ">
            <OrderTickets orderId={bookingInfo.id} isExpanded={true} />
          </div>
        </div>
      )}

      {/* Hướng dẫn sử dụng */}
      {!bookingInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              Bước 1. Nhập thông tin vé
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
              <img
                src="https://static.vecteezy.com/system/resources/previews/013/220/410/non_2x/men-and-woman-of-multiracial-team-search-vacancy-with-binoculars-magnifying-glass-diverse-people-looking-finding-new-work-opportunities-vacancies-employment-career-strategy-concept-job-search-vector.jpg"
                alt="Step 1: Enter ticket information"
                className="object-contain h-64"
              />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              Bước 2. Kiểm tra vé
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
              <img
                src="https://dataspace.com/wp-content/uploads/2023/11/find-data-jobs-1.png"
                alt="Step 2: Check ticket"
                className="object-contain h-64"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindMyBooking;
