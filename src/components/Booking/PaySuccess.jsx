import React from "react";
import { Link, useLocation } from "react-router-dom";

const PaySuccess = () => {
  const location = useLocation();
  const { bookingData, tripData, isReturn } = location.state || {};

  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Try to parse the date string
    let date;
    if (dateString.includes("/")) {
      // Handle DD/MM/YY format
      const [day, month, year] = dateString.split("/");
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (dateString.includes("-")) {
      // Handle YYYY-MM-DD format
      const [year, month, day] = dateString.split("-");
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      // If the format is unknown, try to create a date directly
      date = new Date(dateString);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return dateString; // Return original string if date is invalid
    }

    return date.toLocaleDateString("vi-VN");
  };

  if (!bookingData || !tripData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy thông tin đặt vé
          </h2>
          <Link to="/">
            <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Trở về trang chủ
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-500"
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

        {/* Success Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Mua vé thành công
          </h2>
          <p className="text-gray-600">
            Chúng tôi đã gửi thông tin vé về địa chỉ email {bookingData.email}.
            Vui lòng kiểm tra lại
          </p>
        </div>

        {/* Booking Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">THÔNG TIN MUA VÉ</h3>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">
                Thông tin khách hàng
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Họ và tên:</span>
                  <span className="font-medium">{bookingData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-medium">{bookingData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{bookingData.email}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">
                Thông tin thanh toán
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng giá vé:</span>
                  <span className="font-medium">
                    {bookingData.total.toLocaleString("vi-VN")} VND
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="font-medium">
                    {bookingData.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium text-green-600">
                    Thanh toán thành công
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Ticket Info */}
          <div className="space-y-6">
            {/* Outbound Trip */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Chuyến đi</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tuyến:</span>
                    <span className="font-medium">
                      {tripData.outboundTrip.diemDi} -{" "}
                      {tripData.outboundTrip.diemDen}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày:</span>
                    <span className="font-medium">
                      {console.log(tripData.outboundTrip.ngayKhoiHanh)}
                      {console.log(typeof tripData.outboundTrip.ngayKhoiHanh)}
                      {formatDate(tripData.outboundTrip.ngayKhoiHanh)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">
                      {tripData.outboundTrip.gioKhoiHanh}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số ghế:</span>
                    <span className="font-medium">
                      {tripData.outboundTrip.selectedSeats.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ghế đã đặt:</span>
                    <span className="font-medium">
                      {tripData.outboundTrip.selectedSeats
                        .map((seat) => seat.chair)
                        .join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá:</span>
                    <span className="font-medium">
                      {tripData.outboundTrip.totalPrice.toLocaleString("vi-VN")}{" "}
                      VND
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Trip (if exists) */}
            {isReturn && tripData.returnTrip && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Chuyến về</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tuyến:</span>
                      <span className="font-medium">
                        {tripData.returnTrip.diemDi} -{" "}
                        {tripData.returnTrip.diemDen}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày:</span>
                      <span className="font-medium">
                        {formatDate(tripData.returnTrip.ngayKhoiHanh)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian:</span>
                      <span className="font-medium">
                        {tripData.returnTrip.gioKhoiHanh}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số ghế:</span>
                      <span className="font-medium">
                        {tripData.returnTrip.selectedSeats.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ghế đã đặt:</span>
                      <span className="font-medium">
                        {tripData.returnTrip.selectedSeats
                          .map((seat) => seat.chair)
                          .join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá:</span>
                      <span className="font-medium">
                        {tripData.returnTrip.totalPrice.toLocaleString("vi-VN")}{" "}
                        VND
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Back to Home Button */}
          <div className="text-center">
            <Link to="/">
              <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Trở về trang chủ
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaySuccess;
