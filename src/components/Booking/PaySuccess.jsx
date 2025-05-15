import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaySuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [isReturn, setIsReturn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Kiểm tra xem có state từ navigation không
        if (location.state) {
          setBookingData(location.state.bookingData);
          setTripData(location.state.tripData);
          setIsReturn(location.state.isReturn);
          setLoading(false);
          return;
        }

        // Nếu không có state, kiểm tra URL params (từ VNPAY callback)
        const params = new URLSearchParams(location.search);
        const bookingId = params.get("bookingId");
        const paymentMethod = params.get("paymentMethod");
        const status = params.get("status");

        if (bookingId && paymentMethod === "VNPAY" && status === "success") {
          // Lấy dữ liệu từ localStorage
          const savedBooking = localStorage.getItem("currentBooking");
          if (savedBooking) {
            const parsedData = JSON.parse(savedBooking);
            setBookingData(parsedData.bookingData);
            setTripData(parsedData.tripData);
            setIsReturn(parsedData.isReturn);
          } else {
            // Nếu không có trong localStorage, fetch từ API
            const response = await axios.get(
              `http://localhost:8081/api/datve/${bookingId}`
            );
            if (response.data.code === 200) {
              const bookingInfo = response.data.result;
              // Format dữ liệu để phù hợp với cấu trúc hiện tại
              setBookingData({
                name: bookingInfo.hoTen,
                phone: bookingInfo.sdt,
                email: bookingInfo.email,
                total: bookingInfo.tongTien,
                paymentMethod: "VNPAY",
                paymentStatus: "Đã thanh toán",
                bookingDate: new Date(bookingInfo.ngayDat).toLocaleString(
                  "vi-VN"
                ),
              });
              // Cần thêm logic để lấy thông tin chuyến đi từ API
              // setTripData(...)
            }
          }
        }
      } catch (error) {
        console.error("Error loading booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [location]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4">Đang tải thông tin đặt vé...</p>
        </div>
      </div>
    );
  }

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
            <h3 className="text-xl font-bold text-gray-800">THÔNG TIN VÉ</h3>
            <div
              className={`grid ${
                isReturn ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              } gap-6`}
            >
              {/* Outbound Trip */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-bold text-lg mb-4">Chuyến đi</h4>
                <div className="space-y-4">
                  <div className="lineInfo flex justify-between items-start">
                    <span className="text-gray-600">Tuyến:</span>
                    <div className="rightInfo">
                      <span className="font-medium">
                        {tripData.outboundTrip.diemDi} -{" "}
                        {tripData.outboundTrip.diemDen}
                      </span>
                    </div>
                  </div>
                  <div className="lineInfo flex justify-between items-start">
                    <span className="text-gray-600">Loại xe:</span>
                    <div className="rightInfo">
                      <span className="font-medium">
                        {tripData.outboundTrip.tenLoaiXe}
                      </span>
                    </div>
                  </div>
                  <div className="lineInfo flex justify-between items-start">
                    <span className="text-gray-600">Ngày:</span>
                    <div className="rightInfo">
                      <span className="font-medium">
                        {formatDate(tripData.outboundTrip.ngayKhoiHanh)}
                      </span>
                    </div>
                  </div>
                  <div className="lineInfo flex justify-between items-start">
                    <span className="text-gray-600">Thời gian:</span>
                    <div className="rightInfo">
                      <span className="font-medium">
                        {tripData.outboundTrip.gioKhoiHanh}
                      </span>
                    </div>
                  </div>
                  <div className="lineInfo flex justify-between items-start">
                    <span className="text-gray-600">Số ghế:</span>
                    <div className="rightInfo">
                      <span className="font-medium">
                        {tripData.outboundTrip.selectedSeats.length}
                      </span>
                    </div>
                  </div>
                  <div className="lineInfo flex justify-between items-start">
                    <span className="text-gray-600">Ghế đã đặt:</span>
                    <div className="seatInfo">
                      <span className="font-medium">
                        {tripData.outboundTrip.selectedSeats
                          .map((seat) => seat.chair)
                          .join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="lineInfo flex justify-between items-start">
                    <span className="text-gray-600">Giá:</span>
                    <div className="rightInfo">
                      <span className="font-medium">
                        {tripData.outboundTrip.totalPrice.toLocaleString(
                          "vi-VN"
                        )}{" "}
                        VND
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Trip (if exists) */}
              {isReturn && tripData.returnTrip && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="font-bold text-lg mb-4">Chuyến về</h4>
                  <div className="space-y-4">
                    <div className="lineInfo flex justify-between items-start">
                      <span className="text-gray-600">Tuyến:</span>
                      <div className="rightInfo">
                        <span className="font-medium">
                          {tripData.returnTrip.diemDi} -{" "}
                          {tripData.returnTrip.diemDen}
                        </span>
                      </div>
                    </div>
                    <div className="lineInfo flex justify-between items-start">
                      <span className="text-gray-600">Loại xe:</span>
                      <div className="rightInfo">
                        <span className="font-medium">
                          {tripData.returnTrip.tenLoaiXe}
                        </span>
                      </div>
                    </div>
                    <div className="lineInfo flex justify-between items-start">
                      <span className="text-gray-600">Ngày:</span>
                      <div className="rightInfo">
                        <span className="font-medium">
                          {formatDate(tripData.returnTrip.ngayKhoiHanh)}
                        </span>
                      </div>
                    </div>
                    <div className="lineInfo flex justify-between items-start">
                      <span className="text-gray-600">Thời gian:</span>
                      <div className="rightInfo">
                        <span className="font-medium">
                          {tripData.returnTrip.gioKhoiHanh}
                        </span>
                      </div>
                    </div>
                    <div className="lineInfo flex justify-between items-start">
                      <span className="text-gray-600">Số ghế:</span>
                      <div className="rightInfo">
                        <span className="font-medium">
                          {tripData.returnTrip.selectedSeats.length}
                        </span>
                      </div>
                    </div>
                    <div className="lineInfo flex justify-between items-start">
                      <span className="text-gray-600">Ghế đã đặt:</span>
                      <div className="seatInfo">
                        <span className="font-medium">
                          {tripData.returnTrip.selectedSeats
                            .map((seat) => seat.chair)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                    <div className="lineInfo flex justify-between items-start">
                      <span className="text-gray-600">Giá:</span>
                      <div className="rightInfo">
                        <span className="font-medium">
                          {tripData.returnTrip.totalPrice.toLocaleString(
                            "vi-VN"
                          )}{" "}
                          VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
