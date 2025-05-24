import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import success from "../../assets/success.png";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BookingDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingInfo } = location.state || {};
  const { outboundTrip, returnTrip } = bookingInfo;
  const isReturn = !!returnTrip;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    agree: false,
    promotionCode: "",
  });
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Enhanced pickup/dropoff state management
  const [outboundPickupPoints, setOutboundPickupPoints] = useState([]);
  const [outboundDropoffPoints, setOutboundDropoffPoints] = useState([]);
  const [selectedOutboundPickup, setSelectedOutboundPickup] = useState("");
  const [selectedOutboundDropoff, setSelectedOutboundDropoff] = useState("");

  // Return trip pickup/dropoff points (if applicable)
  const [returnPickupPoints, setReturnPickupPoints] = useState([]);
  const [returnDropoffPoints, setReturnDropoffPoints] = useState([]);
  const [selectedReturnPickup, setSelectedReturnPickup] = useState("");
  const [selectedReturnDropoff, setSelectedReturnDropoff] = useState("");

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
          setUserId(userData.id);

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
  }, []);

  // Lấy điểm đón/trả cho lượt đi
  useEffect(() => {
    if (outboundTrip?.id) {
      fetchTripPoints(outboundTrip.id, "outbound");
    }
  }, [outboundTrip?.id]);

  // Lấy điểm đón/trả cho lượt về
  useEffect(() => {
    if (isReturn && returnTrip?.id) {
      fetchTripPoints(returnTrip.id, "return");
    }
  }, [isReturn, returnTrip?.id]);

  const fetchTripPoints = async (tripId, tripType) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/chuyenxe/lichTrinhChuyenXe?idChuyenXe=${tripId}`
      );
      const data = await response.json();

      if (data.result && Array.isArray(data.result)) {
        const points = data.result;

        if (tripType === "outbound") {
          setOutboundPickupPoints(points);
          setOutboundDropoffPoints(points);
          setSelectedOutboundPickup(points[0]?.tenDiemDon || "");
          setSelectedOutboundDropoff(
            points[points.length - 1]?.tenDiemDon || ""
          );
        } else {
          setReturnPickupPoints(points);
          setReturnDropoffPoints(points);
          setSelectedReturnPickup(points[0]?.tenDiemDon || "");
          setSelectedReturnDropoff(points[points.length - 1]?.tenDiemDon || "");
        }
      }
    } catch (err) {
      console.error(`Lỗi tải điểm đón/trả cho chuyến ${tripType}:`, err);
    }
  };

  if (!bookingInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Không tìm thấy thông tin đặt vé</p>
      </div>
    );
  }

  // Helper
  const formatDateTime = (date, time) =>
    `${time} ${date.split("-").reverse().join("/")}`;

  // Tổng tiền
  const total =
    ((outboundTrip?.totalPrice || 0) + (returnTrip?.totalPrice || 0)) *
    (1 - discountAmount / 100);

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
    // Validate form
    if (!form.name || !form.phone || !form.email) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng");
      return;
    }

    // Validate pickup/dropoff selections
    if (!selectedOutboundPickup || !selectedOutboundDropoff) {
      alert("Vui lòng chọn điểm đón và điểm trả cho chuyến đi");
      return;
    }

    if (isReturn && (!selectedReturnPickup || !selectedReturnDropoff)) {
      alert("Vui lòng chọn điểm đón và điểm trả cho chuyến về");
      return;
    }

    // Kiểm tra ghế trước khi hiển thị popup thanh toán
    await checkSeatsAvailability();
  };

  const prepareBookingData = () => {
    return {
      // Thông tin người dùng
      userId: userId,
      hoTen: form.name,
      sdt: form.phone,
      email: form.email,

      // Thông tin thanh toán
      tongTien: total,
      trangThaiThanhToan: 0,

      // Thông tin chuyến đi
      loaiChuyenDi: isReturn ? 1 : 0,

      // Thông tin chuyến đi với điểm đón/trả
      chuyenDi: {
        idChuyenXe: outboundTrip.id,
        danhSachGheMuonDat: outboundTrip.selectedSeats.map((seat) => seat.id),
        diemDon: selectedOutboundPickup,
        diemTra: selectedOutboundDropoff,
      },

      // Thông tin chuyến về (nếu có)
      ...(isReturn && {
        chuyenVe: {
          idChuyenXe: returnTrip.id,
          danhSachGheMuonDat: returnTrip.selectedSeats.map((seat) => seat.id),
          diemDon: selectedReturnPickup,
          diemTra: selectedReturnDropoff,
        },
      }),
    };
  };

  const handleChooseVNPAYPayment = async () => {
    try {
      setLoading(true);
      const bookingData = {
        ...prepareBookingData(),
        kieuThanhToan: "VNPAY",
      };

      console.log("Booking data:", bookingData);

      // Gọi API đặt vé trước
      const bookingResponse = await axios.post(
        "http://localhost:8081/api/datve",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Booking response:", bookingResponse.data);

      if (bookingResponse.data.code === 200 && bookingResponse.data.result) {
        const bookingId = bookingResponse.data.result;

        if (!bookingId) {
          throw new Error("Không thể lấy được ID đặt vé từ server");
        }

        console.log("Booking ID:", bookingId);

        // Chuẩn bị dữ liệu để chuyển đến trang PaySuccess
        const successData = {
          bookingData: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            total: total,
            paymentMethod: "VNPAY",
            paymentStatus: "Đã thanh toán",
            bookingDate: new Date().toLocaleString("vi-VN"),
            outboundPickup: selectedOutboundPickup,
            outboundDropoff: selectedOutboundDropoff,
            ...(isReturn && {
              returnPickup: selectedReturnPickup,
              returnDropoff: selectedReturnDropoff,
            }),
          },
          tripData: {
            outboundTrip: {
              ...outboundTrip,
              selectedSeats: outboundTrip.selectedSeats,
              tenLoaiXe: outboundTrip.tenLoaiXe || "Xe giường nằm",
              diemDi: outboundTrip.diemDi,
              diemDen: outboundTrip.diemDen,
              ngayKhoiHanh: outboundTrip.ngayKhoiHanh,
              gioKhoiHanh: outboundTrip.gioKhoiHanh,
              totalPrice: outboundTrip.totalPrice,
            },
            ...(isReturn && {
              returnTrip: {
                ...returnTrip,
                selectedSeats: returnTrip.selectedSeats,
                tenLoaiXe: returnTrip.tenLoaiXe || "Xe giường nằm",
                diemDi: returnTrip.diemDi,
                diemDen: returnTrip.diemDen,
                ngayKhoiHanh: returnTrip.ngayKhoiHanh,
                gioKhoiHanh: returnTrip.gioKhoiHanh,
                totalPrice: returnTrip.totalPrice,
              },
            }),
          },
          isReturn: isReturn,
        };

        // Lưu thông tin booking vào localStorage
        localStorage.setItem("currentBooking", JSON.stringify(successData));

        // Gọi API thanh toán VNPAY
        const paymentResponse = await axios.get(
          `http://localhost:8081/api/payment/pay-boooking?total=${total}&bookingId=${bookingId}`
        );

        console.log("Payment response:", paymentResponse.data);

        if (paymentResponse.data) {
          // Chuyển hướng đến trang thanh toán VNPAY
          window.location.href = paymentResponse.data;
        } else {
          throw new Error("Không thể tạo URL thanh toán VNPAY");
        }
      } else {
        throw new Error(
          bookingResponse.data.message || "Có lỗi xảy ra khi đặt vé"
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.message ||
          err.response?.data?.message ||
          "Không thể xử lý thanh toán. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChooseCashPayment = async () => {
    try {
      setLoading(true);

      const bookingData = {
        ...prepareBookingData(),
        kieuThanhToan: "CASH",
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
        // Chuẩn bị dữ liệu để chuyển đến trang PaySuccess
        const successData = {
          bookingData: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            total: total,
            paymentMethod: "Thanh toán khi lên xe",
            outboundPickup: selectedOutboundPickup,
            outboundDropoff: selectedOutboundDropoff,
            ...(isReturn && {
              returnPickup: selectedReturnPickup,
              returnDropoff: selectedReturnDropoff,
            }),
          },
          tripData: {
            outboundTrip: outboundTrip,
            ...(isReturn && { returnTrip: returnTrip }),
          },
          isReturn: isReturn,
        };

        // Chuyển hướng đến trang PaySuccess với dữ liệu
        navigate("/payment-success", { state: successData });
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

  // Add promotion code validation function
  const validatePromotionCode = async (code) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/khuyen-mai/check?maKm=${code}`
      );
      if (
        response.data.code === 200 &&
        response.data.message === "Áp mã thành công"
      ) {
        const discount = response.data.result;
        setDiscountAmount(discount);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error validating promotion code:", err);
      return false;
    }
  };

  // Add promotion code handler
  const handlePromotionCode = async () => {
    if (!form.promotionCode) {
      setError("Vui lòng nhập mã khuyến mãi");
      return;
    }

    setLoading(true);
    try {
      const isValid = await validatePromotionCode(form.promotionCode);
      if (isValid) {
        setError(null);
      } else {
        setError("Mã khuyến mãi không hợp lệ");
        setDiscountAmount(0);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi kiểm tra mã khuyến mãi");
      setDiscountAmount(0);
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
            <div className="bg-white rounded-xl shadow p-8">
              <div className="font-bold text-xl text-black mb-6">
                Thông tin lượt đi
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#3b4a54]">Tuyến</span>
                <span className="font-semibold text-black">
                  {outboundTrip.diemDi} - {outboundTrip.diemDen}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#3b4a54]">Loại xe</span>
                <span className="font-semibold text-black">
                  {outboundTrip.tenLoaiXe}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#3b4a54]">Thời gian xuất bến</span>
                <span className="font-semibold text-green-700">
                  {formatDateTime(
                    outboundTrip.ngayKhoiHanh,
                    outboundTrip.gioKhoiHanh
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#3b4a54]">Số lượng ghế</span>
                <span className="font-semibold text-black">
                  {outboundTrip.selectedSeats.length} Ghế
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#3b4a54]">Số ghế</span>
                <span className="font-semibold text-green-700">
                  {outboundTrip.selectedSeats.map((s) => s.chair).join(", ")}
                </span>
              </div>

              {/* Điểm đón cho chuyến đi */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-[#3b4a54]">
                  Điểm đón <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedOutboundPickup}
                  onValueChange={setSelectedOutboundPickup}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn điểm đón" />
                  </SelectTrigger>
                  <SelectContent>
                    {outboundPickupPoints.map((point, idx) => (
                      <SelectItem key={idx} value={point.tenDiemDon}>
                        {point.tenDiemDon}
                        {point.thoiGian && ` - ${point.thoiGian}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Điểm trả cho chuyến đi */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-[#3b4a54]">
                  Điểm trả <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedOutboundDropoff}
                  onValueChange={setSelectedOutboundDropoff}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn điểm trả" />
                  </SelectTrigger>
                  <SelectContent>
                    {outboundDropoffPoints.map((point, idx) => (
                      <SelectItem key={idx} value={point.tenDiemDon}>
                        {point.tenDiemDon}
                        {point.thoiGian && ` - ${point.thoiGian}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
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
              <div className="bg-white rounded-xl shadow p-8">
                <div className="font-bold text-xl text-black mb-6">
                  Thông tin lượt về
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#3b4a54]">Tuyến xe</span>
                  <span className="font-semibold text-black">
                    {returnTrip.diemDi} - {returnTrip.diemDen}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#3b4a54]">Loại xe</span>
                  <span className="font-semibold text-black">
                    {returnTrip.tenLoaiXe}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#3b4a54]">Thời gian xuất bến</span>
                  <span className="font-semibold text-green-700">
                    {formatDateTime(
                      returnTrip.ngayKhoiHanh,
                      returnTrip.gioKhoiHanh
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#3b4a54]">Số lượng ghế</span>
                  <span className="font-semibold text-black">
                    {returnTrip.selectedSeats.length} Ghế
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#3b4a54]">Số ghế</span>
                  <span className="font-semibold text-green-700">
                    {returnTrip.selectedSeats.map((s) => s.chair).join(", ")}
                  </span>
                </div>

                {/* Điểm đón cho chuyến về */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-[#3b4a54]">
                    Điểm đón <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedReturnPickup}
                    onValueChange={setSelectedReturnPickup}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn điểm đón" />
                    </SelectTrigger>
                    <SelectContent>
                      {returnPickupPoints.map((point, idx) => (
                        <SelectItem key={idx} value={point.tenDiemDon}>
                          {point.tenDiemDon}
                          {point.thoiGian && ` - ${point.thoiGian}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Điểm trả cho chuyến về */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-[#3b4a54]">
                    Điểm trả <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedReturnDropoff}
                    onValueChange={setSelectedReturnDropoff}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn điểm trả" />
                    </SelectTrigger>
                    <SelectContent>
                      {returnDropoffPoints.map((point, idx) => (
                        <SelectItem key={idx} value={point.tenDiemDon}>
                          {point.tenDiemDon}
                          {point.thoiGian && ` - ${point.thoiGian}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t">
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
              <div>
                <div className="flex gap-2">
                  <input
                    className="w-48 h-10 border rounded px-2 py-1 text-sm"
                    value={form.promotionCode}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, promotionCode: e.target.value }))
                    }
                    placeholder="Nhập mã KM"
                  />
                  <button
                    type="button"
                    onClick={handlePromotionCode}
                    className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Áp dụng
                  </button>
                </div>
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
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{discountAmount.toLocaleString()}%</span>
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
                    onClick={handleChooseCashPayment}
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
