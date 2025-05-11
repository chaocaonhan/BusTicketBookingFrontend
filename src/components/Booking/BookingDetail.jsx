import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import success from "../../assets/success.png";
import axios from "axios";

const BookingDetail = () => {
  const location = useLocation();
  const { bookingInfo } = location.state || {};
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    agree: false,
  });
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Lấy thông tin người dùng khi component được khởi tạo
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          "http://localhost:8081/api/nguoidung/myInfor",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.code === 200) {
          const userData = response.data.result;
          // Lưu userId từ response
          setUserId(userData.id);

          // Kiểm tra nếu vai trò là CUSTOMER bằng cách tìm kiếm trong chuỗi vaiTro
          if (userData.vaiTro && userData.vaiTro.includes("CUSTOMER")) {
            setForm((prev) => ({
              ...prev,
              name: userData.hoTen || "",
              phone: userData.sdt || "",
              email: userData.email || "",
            }));
          }
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    };

    fetchUserInfo();
  }, []); // Chỉ chạy một lần khi component mount

  if (!bookingInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Không tìm thấy thông tin đặt vé</p>
      </div>
    );
  }

  const { outboundTrip, returnTrip } = bookingInfo;
  const isReturn = !!returnTrip;

  // Helper
  const formatDateTime = (date, time) =>
    `${time} ${date.split("-").reverse().join("/")}`;

  // Tổng tiền
  const total = (outboundTrip?.totalPrice || 0) + (returnTrip?.totalPrice || 0);

  const checkSeatsAvailability = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gộp tất cả ID ghế đã chọn vào một mảng
      const selectedSeatIds = [
        ...outboundTrip.selectedSeats.map((seat) => seat.id),
        ...(isReturn ? returnTrip.selectedSeats.map((seat) => seat.id) : []),
      ];

      // Gọi API kiểm tra ghế
      const response = await axios.post(
        "http://localhost:8081/api/chuyenxe/kiemtra-ghe",
        { seatIds: selectedSeatIds }
      );

      if (response.data.code === 200) {
        // Nếu kiểm tra thành công, hiển thị popup thanh toán
        setShowPaymentPopup(true);
      } else {
        setError(response.data.message || "Có lỗi xảy ra khi kiểm tra ghế");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể kiểm tra ghế. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    // Kiểm tra form đã được điền đầy đủ chưa
    if (!form.name || !form.phone || !form.email) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng");
      return;
    }

    // Kiểm tra ghế trước khi hiển thị popup thanh toán
    await checkSeatsAvailability();
  };

  const handleChooseVNPAYPayment = async () => {
    try {
      setLoading(true);
      // Chuẩn bị dữ liệu đặt vé
      const bookingData = {
        customerInfo: {
          name: form.name,
          phone: form.phone,
          email: form.email,
        },
        outboundTrip: {
          tripId: outboundTrip.id,
          seats: outboundTrip.selectedSeats.map((seat) => ({
            seatId: seat.id,
            seatNumber: seat.chair,
          })),
        },
        ...(isReturn && {
          returnTrip: {
            tripId: returnTrip.id,
            seats: returnTrip.selectedSeats.map((seat) => ({
              seatId: seat.id,
              seatNumber: seat.chair,
            })),
          },
        }),
        paymentMethod: "VNPAY",
        totalAmount: total,
      };

      // Gọi API đặt vé với VNPAY
      const response = await axios.post(
        "http://localhost:8081/api/datve/thanh-toan-vnpay",
        bookingData
      );

      if (response.data.code === 200) {
        // Xử lý redirect đến trang thanh toán VNPAY
        window.location.href = response.data.paymentUrl;
      } else {
        setError(response.data.message || "Có lỗi xảy ra khi thanh toán");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể xử lý thanh toán. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePayment = async () => {
    try {
      setLoading(true);

      // Chuẩn bị dữ liệu đặt vé
      const bookingData = {
        // Thông tin người dùng
        userId: userId,
        hoTen: form.name,
        sdt: form.phone,
        email: form.email,

        // Thông tin thanh toán
        tongTien: total,
        kieuThanhToan: "CASH",
        trangThaiThanhToan: 0,

        // Thông tin chuyến đi
        loaiChuyenDi: isReturn ? 1 : 0,

        // Thông tin chuyến đi
        chuyenDi: {
          idChuyenXe: outboundTrip.id,
          danhSachGheMuonDat: outboundTrip.selectedSeats.map((seat) => seat.id),
        },

        // Thông tin chuyến về (nếu có)
        ...(isReturn && {
          chuyenVe: {
            idChuyenXe: returnTrip.id,
            danhSachGheMuonDat: returnTrip.selectedSeats.map((seat) => seat.id),
          },
        }),
      };

      // Gọi API đặt vé thanh toán khi lên xe
      const response = await axios.post(
        "http://localhost:8081/api/datve",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 200) {
        // Xử lý sau khi đặt vé thành công
        alert("Đặt vé thành công! Vui lòng thanh toán khi lên xe.");
        // Có thể chuyển hướng đến trang xác nhận đặt vé
        // window.location.href = `/booking-confirmation/${response.data.bookingId}`;
      } else {
        setError(response.data.message || "Có lỗi xảy ra khi đặt vé");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể đặt vé. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f7f8] min-h-screen py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* LEFT - Thông tin chuyến đi */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Thông tin chuyến đi - 2 cột */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thông tin lượt đi */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="font-bold text-xl text-black mb-3">
                Thông tin lượt đi
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#3b4a54]">Tuyến xe</span>
                <span className="font-semibold text-black">
                  {outboundTrip.diemDi} - {outboundTrip.diemDen}
                </span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#3b4a54]">Thời gian xuất bến</span>
                <span className="font-semibold text-green-700">
                  {formatDateTime(
                    outboundTrip.ngayKhoiHanh,
                    outboundTrip.gioKhoiHanh
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#3b4a54]">Số lượng ghế</span>
                <span className="font-semibold text-black">
                  {outboundTrip.selectedSeats.length} Ghế
                </span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#3b4a54]">Số ghế</span>
                <span className="font-semibold text-green-700">
                  {outboundTrip.selectedSeats.map((s) => s.chair).join(", ")}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#3b4a54] font-semibold">
                  Tổng tiền lượt đi
                </span>
                <span className="font-bold text-green-700">
                  {outboundTrip.totalPrice.toLocaleString()}đ
                </span>
              </div>
            </div>
            {/* Thông tin lượt về */}
            {isReturn && (
              <div className="bg-white rounded-xl shadow p-4">
                <div className="font-bold text-xl text-black mb-3">
                  Thông tin lượt về
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#3b4a54]">Tuyến xe</span>
                  <span className="font-semibold text-black">
                    {returnTrip.diemDi} - {returnTrip.diemDen}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#3b4a54]">Thời gian xuất bến</span>
                  <span className="font-semibold text-green-700">
                    {formatDateTime(
                      returnTrip.ngayKhoiHanh,
                      returnTrip.gioKhoiHanh
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#3b4a54]">Số lượng ghế</span>
                  <span className="font-semibold text-black">
                    {returnTrip.selectedSeats.length} Ghế
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#3b4a54]">Số ghế</span>
                  <span className="font-semibold text-green-700">
                    {returnTrip.selectedSeats.map((s) => s.chair).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[#3b4a54] font-semibold">
                    Tổng tiền lượt về
                  </span>
                  <span className="font-bold text-green-700">
                    {returnTrip.totalPrice.toLocaleString()}đ
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Điều khoản & lưu ý */}
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="text-orange-600 font-bold mb-2">
              ĐIỀU KHOẢN & LƯU Ý
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <div>
                (*) Quý khách vui lòng có mặt tại bến xuất phát của xe trước ít
                nhất 30 phút giờ xe khởi hành, mang theo thông báo đã thanh toán
                vé thành công có chứa mã vé được gửi từ hệ thống Sao Việt. Vui
                lòng liên hệ Trung tâm tổng đài 1900 1234 để được hỗ trợ.
              </div>
              <div>
                (*) Nếu quý khách có nhu cầu trung chuyển, vui lòng liên hệ Tổng
                đài trung chuyển 1900 6918 trước khi đặt vé. Chúng tôi không
                đón/trung chuyển tại những điểm xe trung chuyển không thể tới
                được.
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT - Thông tin khách hàng */}
        <div className="w-full md:w-[340px]">
          {/* Thông tin khách hàng */}
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h2 className="text-lg font-bold mb-4">Thông tin khách hàng</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>
            </form>
          </div>
          {/* Chi tiết giá */}
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              Chi tiết giá
              <span className="text-orange-500" title="Chi tiết giá">
                i
              </span>
            </div>
            <div className="text-sm flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Giá vé lượt đi</span>
                <span className="text-orange-600">
                  {outboundTrip.totalPrice.toLocaleString()}đ
                </span>
              </div>
              {isReturn && (
                <div className="flex justify-between">
                  <span>Giá vé lượt về</span>
                  <span className="text-orange-600">
                    {returnTrip.totalPrice.toLocaleString()}đ
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phí thanh toán</span>
                <span className="text-orange-600">0đ</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Tổng tiền</span>
                <span className="text-orange-600">
                  {total.toLocaleString()}đ
                </span>
              </div>
            </div>
          </div>
          {/* Tổng tiền + nút */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div className="flex gap-3">
              <button className="px-8 py-2 rounded-full border border-orange-400 text-orange-500 font-semibold bg-white hover:bg-orange-50">
                Hủy
              </button>
              <button
                onClick={handlePayment}
                className="px-8 py-2 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup thanh toán */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="relative">
              <button
                className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPaymentPopup(false)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="text-center">
                <div className="mb-4">
                  <img
                    src={success}
                    alt="success"
                    className="mx-auto w-16 h-16"
                  />
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Thanh toán</h3>
                  <p className="text-gray-600">
                    Quý khách vui lòng lựa chọn phương thức thanh toán bên dưới
                    để thanh toán và nhận vé
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    className="w-full py-3 px-4 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    onClick={handleChooseVNPAYPayment}
                  >
                    <span className="text-red-500 font-bold">VN</span>
                    <span className="text-blue-600 font-bold">PAY</span>
                  </button>
                  <button
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={handleChoosePayment}
                  >
                    Thanh toán khi lên xe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị loading và error */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-center">Đang xử lý...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Lỗi</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                onClick={() => setError(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;
