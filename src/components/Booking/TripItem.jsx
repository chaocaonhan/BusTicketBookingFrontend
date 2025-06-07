import React, { useState } from "react";
import axios from "axios";
import SeatTable from "./SeatTable";
import TripSchedule from "./TripSchedule";
import { ClockFading } from "lucide-react";
import pickup from "../../assets/pickup.svg";
import station from "../../assets/station.svg";

const TripItem = ({
  trip,
  calculateDuration,
  isSeatMapOpen,
  onSeatMapToggle,
  isReturn,
  activeTab,
  onContinueBooking,
}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatData, setSeatData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTabLocal, setActiveTabLocal] = useState(null); // 'seat', 'schedule', 'policy'

  // Tính tổng tiền
  const totalPrice = selectedSeats.length * trip.giaVe;

  const handleShowSeatMap = async () => {
    if (activeTabLocal === "seat") {
      setActiveTabLocal(null);
      onSeatMapToggle(trip.id);
      return;
    }

    setActiveTabLocal("seat");
    onSeatMapToggle(trip.id);
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8081/api/chuyenxe/danhSachDatGhe`,
        {
          params: {
            id: trip.id,
          },
        }
      );
      if (response.data.code === 200) {
        const formattedData = response.data.result.map((seat) => ({
          id: seat.id,
          chair: seat.tenGhe,
          bookStatus: seat.trangThai,
          floorNo: seat.tang,
          rowNo: seat.hang,
          columnNo: seat.cot,
        }));
        setSeatData(formattedData);
      }
    } catch (err) {
      setError("Không thể tải dữ liệu ghế");
      console.error("Error fetching seat data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowSchedule = () => {
    if (activeTabLocal === "schedule") {
      setActiveTabLocal(null);
    } else {
      setActiveTabLocal("schedule");
      if (isSeatMapOpen) {
        onSeatMapToggle(trip.id);
      }
    }
  };

  const handleShowPolicy = () => {
    if (activeTabLocal === "policy") {
      setActiveTabLocal(null);
    } else {
      setActiveTabLocal("policy");
      if (isSeatMapOpen) {
        onSeatMapToggle(trip.id);
      }
    }
  };

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
  };

  const handleContinue = () => {
    const tripInfo = {
      id: trip.id,
      diemDi: trip.diemDi,
      diemDen: trip.diemDen,
      gioKhoiHanh: trip.gioKhoiHanh,
      gioKetThuc: trip.gioKetThuc,
      ngayKhoiHanh: trip.ngayKhoiHanh,
      giaVe: trip.giaVe,
      selectedSeats: selectedSeats,
      totalPrice: totalPrice,
      tenLoaiXe: trip.tenLoaiXe,
    };

    onContinueBooking(tripInfo, activeTab);
  };

  // Reset activeTabLocal when isSeatMapOpen changes
  React.useEffect(() => {
    if (!isSeatMapOpen) {
      setActiveTabLocal(null);
    }
  }, [isSeatMapOpen]);

  const TripTime = ({ start, end, duration }) => (
    <div className="grid grid-cols-3 items-center w-full mb-2">
      <div className="justify-self-start">
        <span className="text-xl font-bold">{start.slice(0, 5)}</span>
      </div>

      <div className="flex items-center justify-center">
        <img src={pickup} alt="pickup" className="w-6 h-6" />
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center">
            <span class="flex-1 w-12 border-b-4 border-dotted"></span>
            <ClockFading className="w-8 h-8 text-orange-500 mx-1" />
            <span class="flex-1 w-12 border-b-4 border-dotted"></span>
          </div>
        </div>
        <img src={station} alt="station" className="w-6 h-6" />
      </div>

      <div className="justify-self-end">
        <span className="text-xl font-bold">{end.slice(0, 5)}</span>
      </div>
    </div>
  );

  const TripLocations = ({ from, to, duration }) => (
    <div className="flex mb-4">
      <div className="w-2/5 font-medium text-gray-700">{from}</div>
      <span className="text-lg w-1/5 text-center text-gray-500 ">
        {duration}
      </span>
      <div className="w-2/5 text-right font-medium text-gray-700">{to}</div>
    </div>
  );

  const TripPrice = ({ price, type, seats }) => (
    <div className="text-right">
      <div className="mb-1">
        <span className="text-gray-500">{type}</span>
        <span className="text-green-600 ml-2">{seats} chỗ trống</span>
      </div>
      <div className="text-2xl font-bold text-orange-500">
        {price.toLocaleString()}đ
      </div>
    </div>
  );

  const TripActions = () => (
    <div className="flex border-t pt-4">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTabLocal === "seat"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-orange-600"
          }`}
          onClick={handleShowSeatMap}
        >
          Chọn ghế
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTabLocal === "schedule"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-orange-600"
          }`}
          onClick={handleShowSchedule}
        >
          Lịch trình
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTabLocal === "policy"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-orange-600"
          }`}
          onClick={handleShowPolicy}
        >
          Chính sách
        </button>
      </div>
      <div className="ml-auto flex space-x-4">
        <button
          className={`font-medium px-6 py-2 rounded-lg ${
            selectedSeats.length > 0
              ? "bg-orange-100 text-orange-500"
              : "bg-orange-500 text-white"
          }`}
        >
          Chọn chuyến
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="w-2/3 pr-4">
          <TripTime
            start={trip.gioKhoiHanh}
            end={trip.gioKetThuc}
            duration={calculateDuration(trip.gioKhoiHanh, trip.gioKetThuc)}
          />
          <TripLocations
            from={trip.diemDi}
            to={trip.diemDen}
            duration={calculateDuration(trip.gioKhoiHanh, trip.gioKetThuc)}
          />
        </div>

        <TripPrice
          price={trip.giaVe}
          type={trip.tenLoaiXe}
          seats={trip.soGheTrong}
        />
      </div>

      <TripActions />

      {activeTabLocal === "seat" && (
        <div className="mb-4 relative">
          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <>
              <SeatTable
                seatData={seatData}
                onSeatsSelected={handleSeatsSelected}
                selectedSeats={selectedSeats}
                pricePerSeat={trip.giaVe}
              />
              {selectedSeats.length > 0 && (
                <div className="mb-4 p-2 bg-orange-50 rounded flex justify-between items-center">
                  <p className="text-sm font-medium text-orange-700">
                    Đã chọn {selectedSeats.length} ghế:{" "}
                    {selectedSeats.map((seat) => seat.chair).join(", ")}
                  </p>
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Tổng tiền:</span>
                      <span className="text-xl font-bold text-orange-500">
                        {totalPrice.toLocaleString()}đ
                      </span>
                    </div>
                    <button
                      onClick={handleContinue}
                      className="font-medium px-6 py-2 rounded-lg bg-orange-500 text-white"
                    >
                      Tiếp tục
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTabLocal === "schedule" && (
        <div className="mt-4 border-t pt-4">
          <TripSchedule tripId={trip.id} />
        </div>
      )}

      {activeTabLocal === "policy" && (
        <div className="mt-4 border-t pt-4">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Chính sách chuyến xe</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Chính sách hủy vé:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Hủy trước 24h: Hoàn tiền 100%</li>
                  <li>Hủy trước 12h: Hoàn tiền 50%</li>
                  <li>Hủy sau 12h: Không hoàn tiền</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Chính sách đổi vé:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Đổi vé trước 24h: Miễn phí</li>
                  <li>Đổi vé trước 12h: Phí 10% giá vé</li>
                  <li>Đổi vé sau 12h: Phí 20% giá vé</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripItem;
