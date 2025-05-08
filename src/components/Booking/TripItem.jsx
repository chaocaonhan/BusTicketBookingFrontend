import React, { useState } from "react";
import axios from "axios";
import SeatTable from "./SeatTable";

const TripItem = ({ trip, calculateDuration }) => {
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatData, setSeatData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tính tổng tiền
  const totalPrice = selectedSeats.length * trip.giaVe;

  const handleShowSeatMap = async () => {
    if (showSeatMap) {
      setShowSeatMap(false);
      return;
    }

    setShowSeatMap(true);
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

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
  };

  const TripTime = ({ start, end, duration }) => (
    <div className="grid grid-cols-3 items-center w-full mb-2">
      <div className="justify-self-start">
        <span className="text-xl font-bold">{start.slice(0, 5)}</span>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
          <div className="h-px w-4 bg-gray-300"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500 mx-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="h-px w-4 bg-gray-300"></div>
        </div>
        <span className="text-xs text-gray-500 mt-1">{duration}</span>
      </div>

      <div className="justify-self-end">
        <span className="text-xl font-bold">{end.slice(0, 5)}</span>
      </div>
    </div>
  );

  const TripLocations = ({ from, to }) => (
    <div className="flex mb-4">
      <div className="w-1/2 font-medium text-gray-700">{from}</div>
      <div className="w-1/2 text-right font-medium text-gray-700">{to}</div>
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

  const TripActions = ({ onShowSeatMap, selectedSeats }) => (
    <div className="flex border-t pt-4">
      <div className="flex space-x-4">
        <button
          className="px-4 py-2 text-orange-600 font-medium"
          onClick={onShowSeatMap}
        >
          Chọn ghế
        </button>
        <button className="px-4 py-2 text-orange-600 font-medium">
          Lịch trình
        </button>
        <button className="px-4 py-2 text-orange-600 font-medium">
          Trung chuyển
        </button>
        <button className="px-4 py-2 text-orange-600 font-medium">
          Chính sách
        </button>
      </div>
      <div className="ml-auto">
        <button
          className={`font-medium px-6 py-2 rounded-lg ${
            selectedSeats.length > 0
              ? "bg-orange-500 text-white"
              : "bg-orange-100 text-orange-500"
          }`}
        >
          {selectedSeats.length > 0 ? "Đặt vé" : "Chọn chuyến"}
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
          <TripLocations from={trip.diemDi} to={trip.diemDen} />
        </div>

        <TripPrice
          price={trip.giaVe}
          type={trip.tenLoaiXe}
          seats={trip.soGheTrong}
        />
      </div>

      <TripActions
        onShowSeatMap={handleShowSeatMap}
        selectedSeats={selectedSeats}
      />

      {showSeatMap && (
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
                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md">
                  <div className="text-sm text-gray-600">Tổng tiền:</div>
                  <div className="text-xl font-bold text-orange-500">
                    {totalPrice.toLocaleString()}đ
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {selectedSeats.length > 0 && (
        <div className="mb-4 p-2 bg-orange-50 rounded">
          <p className="text-sm font-medium text-orange-700">
            Đã chọn {selectedSeats.length} ghế:{" "}
            {selectedSeats.map((seat) => seat.chair).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default TripItem;
