import { useState, useEffect } from "react";
import { QrCode, Bus } from "lucide-react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { toast } from "react-toastify";

const OrderTickets = ({ orderId, isExpanded }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

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

  const handleCancelTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/ve-xe/huyVe?maVeXe=${ticketId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể huỷ vé");
      }

      setTickets(
        tickets.map((ticket) =>
          ticket.maVeXe === ticketId
            ? { ...ticket, trangThaiVe: "CANCELED" }
            : ticket
        )
      );

      toast.success("Huỷ vé thành công!");
      setShowCancelModal(false);
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi huỷ vé");
    }
  };

  const openCancelModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setShowCancelModal(true);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    return `${h}:${m}`;
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
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận huỷ vé</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn huỷ vé này không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Đóng
              </button>
              <button
                onClick={() => handleCancelTicket(selectedTicketId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xác nhận huỷ
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Danh sách vé đã đặt
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tickets.map((ticket) => (
          <div
            key={ticket.maVeXe}
            className="relative bg-white rounded-lg overflow-hidden shadow-md"
          >
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bus className="h-4 w-4" />
                  <span className="font-bold text-base">Sao Việt</span>
                </div>
                <div className="text-xs font-medium bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">
                  {ticket.trangThaiVe === "BOOKED"
                    ? "Đã đặt"
                    : ticket.trangThaiVe === "CANCELED"
                    ? "Đã huỷ"
                    : ticket.trangThaiVe === "COMPLETED"
                    ? "Hoàn thành"
                    : ticket.trangThaiVe}
                </div>
              </div>
            </div>
            <div className="p-2">
              <div className="flex justify-between items-start mb-2 pl-2">
                <div className="flex flex-col gap-1">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      {ticket.tenTuyen}
                    </h3>
                  </div>
                  <div className="mb-1 text-sm text-gray-500">
                    Hạng xe : {ticket.loaiXe}
                  </div>
                  <div className="mb-1 text-sm text-gray-500">
                    Biển kiểm soát : {ticket.bienSoXe}
                  </div>
                  <div className="mb-1 text-sm text-gray-500">
                    Số ghế : {ticket.tenGhe}
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <div className="text-xs text-gray-500">Mã vé</div>
                  <div className="font-bold text-gray-500 text-3xl">
                    {ticket.maVeXe}
                  </div>
                </div>
              </div>
              <div className="w-full py-4">
                <Timeline
                  position="right"
                  sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                      flex: 0,
                      padding: 0,
                    },
                  }}
                >
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="grey" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <div className="text-sm">{ticket.trungChuyenTu}</div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="grey" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <div className="flex items-center gap-2">
                        <div className="text-lg text-gray-500">
                          {formatTime(ticket.thoiGianBatDau)}
                        </div>
                        <div className="text-lg font-medium">
                          {ticket.diemBatDau}
                        </div>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="grey" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <div className="flex items-center gap-2">
                        <div className="text-lg text-gray-500">
                          {formatTime(ticket.thoiGianKetThuc)}
                        </div>
                        <div className="text-lg font-medium">
                          {ticket.diemKetThuc}
                        </div>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="grey" />
                    </TimelineSeparator>
                    <TimelineContent>
                      <div className="text-sm">{ticket.trungChuyenDen}</div>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </div>
              <div className="relative py-1">
                <div className="absolute left-0 top-1/2 -ml-2 w-3 h-3 bg-gray-50 rounded-full"></div>
                <div className="border-t-2 border-dashed border-gray-300"></div>
                <div className="absolute right-0 top-1/2 -mr-2 w-3 h-3 bg-gray-50 rounded-full"></div>
              </div>
              <div className="pt-1 flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500">Giá vé</div>
                  <div className="font-bold text-sm text-gray-800">
                    {ticket.giaVe.toLocaleString("vi-VN")} đ
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <QrCode className="h-8 w-8 text-gray-700" />
                  <div className="text-xs text-gray-500 mt-1">
                    {ticket.maVeXe}
                  </div>
                </div>
              </div>
              {ticket.trangThaiVe === "BOOKED" && (
                <div className="flex items-center justify-end mt-2">
                  <button
                    onClick={() => openCancelModal(ticket.maVeXe)}
                    className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Huỷ
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
