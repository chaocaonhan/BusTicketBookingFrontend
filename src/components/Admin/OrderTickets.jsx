import { useState, useEffect } from "react";
import { QrCode, Bus, Calendar } from "lucide-react";

const OrderTickets = ({ orderId, isExpanded }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTicket, setExpandedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!orderId || !isExpanded) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8081/api/ve-xe/maDonDatVe?maDonDatVe=${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách vé");
        }

        const data = await response.json();
        if (data.code === 200) {
          setTickets(data.result);
        } else {
          throw new Error(data.message || "Lỗi khi lấy danh sách vé");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [orderId, isExpanded]);

  const toggleTicket = (ticketId) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  if (!isExpanded) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-2">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết vé</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.maVeXe}
            className="relative bg-white rounded-lg overflow-hidden shadow-md"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bus className="h-5 w-5" />
                  <span className="font-bold text-lg">Sao Việt</span>
                </div>
                <div className="text-xs font-medium bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">
                  {ticket.trangThaiVe === "BOOKED"
                    ? "Đã đặt"
                    : ticket.trangThaiVe}
                </div>
              </div>
            </div>
            {/* Body */}
            <div className="p-3">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      {ticket.tenTuyen}
                    </h3>
                  </div>

                  <div className="mb-2 text-2xl font-bold">
                    <div className="text-xs text-gray-500">
                      Hạng xe : {ticket.loaiXe}
                    </div>
                  </div>
                  <div className="mb-2 text-2xl font-bold">
                    <div className="text-xs text-gray-500">
                      {" "}
                      Số ghế : {ticket.tenGhe}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Mã vé</div>
                  <div className="font-bold text-blue-800">{ticket.maVeXe}</div>
                </div>
              </div>
              {/* Timeline */}
              <div className="mb-4 pl-4 relative">
                <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-green-500"></div>
                <div className="flex items-start mb-3 relative">
                  <div className="absolute left-[-12px] top-1 w-3 h-3 bg-black rounded-full"></div>
                  <div className="ml-4 text-sm">{ticket.trungChuyenTu}</div>
                </div>
                <div className="flex items-start mb-3 relative">
                  <div className="absolute left-[-12px] top-1 w-3 h-3 bg-black rounded-full"></div>
                  <div className="ml-4">
                    <div className="text-sm font-medium">
                      {ticket.diemBatDau}
                    </div>
                  </div>
                </div>
                <div className="flex items-start mb-3 relative">
                  <div className="absolute left-[-12px] top-1 w-3 h-3 bg-black rounded-full"></div>
                  <div className="ml-4">
                    <div className="text-sm font-medium">
                      {ticket.diemKetThuc}
                    </div>
                  </div>
                </div>
                <div className="flex items-start relative">
                  <div className="absolute left-[-12px] top-1 w-3 h-3 bg-black rounded-full"></div>
                  <div className="ml-4 text-sm">{ticket.trungChuyenDen}</div>
                </div>
              </div>
              {/* Đường đục lỗ */}
              <div className="relative py-2">
                <div className="absolute left-0 top-1/2 -ml-2 w-4 h-4 bg-gray-50 rounded-full"></div>
                <div className="border-t-2 border-dashed border-gray-300"></div>
                <div className="absolute right-0 top-1/2 -mr-2 w-4 h-4 bg-gray-50 rounded-full"></div>
              </div>
              {/* Footer */}
              <div className="pt-2 flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500">Giá vé</div>
                  <div className="font-bold text-base text-gray-800">
                    {ticket.giaVe.toLocaleString("vi-VN")} đ
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <QrCode className="h-12 w-12 text-gray-700" />
                  <div className="text-xs text-gray-500 mt-1">
                    {ticket.maVeXe}
                  </div>
                </div>
              </div>
              {/* Nút đánh giá */}
              <button
                onClick={() => toggleTicket(ticket.maVeXe)}
                className="mt-2 w-full text-center py-1.5 text-xs text-gray-700 font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                {expandedTicket === ticket.maVeXe
                  ? "Ẩn thông tin"
                  : "Đánh giá chuyến đi"}
              </button>
              {/* Phần mở rộng */}
              {expandedTicket === ticket.maVeXe && (
                <div className="mt-2 p-2 bg-gray-50 rounded-md">
                  <div className="text-sm font-medium mb-2">
                    Đánh giá chuyến đi
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className="text-2xl text-gray-300 hover:text-yellow-400"
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="w-full mt-2 p-2 border border-gray-200 rounded-md text-sm"
                    placeholder="Nhập đánh giá của bạn..."
                    rows={3}
                  />
                  <button className="mt-2 bg-gray-600 text-white px-3 py-1 rounded-md text-xs">
                    Gửi đánh giá
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTickets;
