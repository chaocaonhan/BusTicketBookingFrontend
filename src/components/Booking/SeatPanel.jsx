import React from "react";
const { useState, useEffect } = React;
const SeatPanel = () => {
  const initialSeats = [
    {
      id: 238101714,
      chair: "B17",
      rowNo: 13,
      columnNo: 5,
      bookStatus: 0,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101715,
      chair: "A01",
      rowNo: 1,
      columnNo: 1,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101716,
      chair: "A02",
      rowNo: 1,
      columnNo: 5,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101717,
      chair: "A03",
      rowNo: 2,
      columnNo: 1,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101719,
      chair: "A09",
      rowNo: 4,
      columnNo: 1,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101722,
      chair: "A16",
      rowNo: 6,
      columnNo: 3,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101723,
      chair: "A17",
      rowNo: 6,
      columnNo: 5,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101726,
      chair: "A08",
      rowNo: 3,
      columnNo: 5,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101727,
      chair: "A05",
      rowNo: 2,
      columnNo: 5,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101728,
      chair: "A04",
      rowNo: 2,
      columnNo: 3,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101729,
      chair: "A07",
      rowNo: 3,
      columnNo: 3,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101732,
      chair: "B01",
      rowNo: 8,
      columnNo: 1,
      bookStatus: 1,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101733,
      chair: "B02",
      rowNo: 8,
      columnNo: 5,
      bookStatus: 1,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101734,
      chair: "B03",
      rowNo: 9,
      columnNo: 1,
      bookStatus: 1,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101735,
      chair: "B04",
      rowNo: 9,
      columnNo: 3,
      bookStatus: 0,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101736,
      chair: "B05",
      rowNo: 9,
      columnNo: 5,
      bookStatus: 1,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101737,
      chair: "B06",
      rowNo: 10,
      columnNo: 1,
      bookStatus: 1,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101738,
      chair: "B07",
      rowNo: 10,
      columnNo: 3,
      bookStatus: 1,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101739,
      chair: "B08",
      rowNo: 10,
      columnNo: 5,
      bookStatus: 1,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101740,
      chair: "B09",
      rowNo: 11,
      columnNo: 1,
      bookStatus: 0,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101741,
      chair: "B10",
      rowNo: 11,
      columnNo: 3,
      bookStatus: 0,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101742,
      chair: "B11",
      rowNo: 11,
      columnNo: 5,
      bookStatus: 1,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101743,
      chair: "B12",
      rowNo: 12,
      columnNo: 1,
      bookStatus: 0,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101744,
      chair: "B13",
      rowNo: 12,
      columnNo: 3,
      bookStatus: 0,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101745,
      chair: "B14",
      rowNo: 12,
      columnNo: 5,
      bookStatus: 0,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101746,
      chair: "B15",
      rowNo: 13,
      columnNo: 1,
      bookStatus: 0,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238101747,
      chair: "B16",
      rowNo: 13,
      columnNo: 3,
      bookStatus: 0,
      floorNo: 2,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 238102738,
      chair: "A06",
      rowNo: 3,
      columnNo: 1,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 244358331,
      chair: "A10",
      rowNo: 4,
      columnNo: 3,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 244358332,
      chair: "A11",
      rowNo: 4,
      columnNo: 5,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 244358333,
      chair: "A12",
      rowNo: 5,
      columnNo: 1,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 244358334,
      chair: "A13",
      rowNo: 5,
      columnNo: 3,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 244358335,
      chair: "A14",
      rowNo: 5,
      columnNo: 5,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
    {
      id: 244358336,
      chair: "A15",
      rowNo: 6,
      columnNo: 1,
      bookStatus: 1,
      floorNo: 1,
      inSelect: 0,
      price: 200000,
    },
  ];

  const [seats, setSeats] = useState(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Xử lý chọn ghế
  const handleSeatClick = (seat) => {
    if (seat.bookStatus === 1) return; // Ghế đã đặt, không thể chọn

    const updatedSeats = seats.map((s) => {
      if (s.id === seat.id) {
        const newInSelect = s.inSelect === 0 ? 1 : 0;
        return { ...s, inSelect: newInSelect };
      }
      return s;
    });

    setSeats(updatedSeats);

    if (seat.inSelect === 0) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    }
  };

  // Xử lý hủy toàn bộ lựa chọn
  const handleCancel = () => {
    const updatedSeats = seats.map((s) => ({ ...s, inSelect: 0 }));
    setSeats(updatedSeats);
    setSelectedSeats([]);
  };

  // Xử lý xác nhận
  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    alert(`Bạn đã chọn ghế: ${selectedSeats.map((s) => s.chair).join(", ")}`);
  };

  // Tính tổng giá
  const totalPrice = selectedSeats.reduce(
    (total, seat) => total + seat.price,
    0
  );

  // Tách ghế theo tầng
  const floor1Seats = seats.filter((seat) => seat.floorNo === 1);
  const floor2Seats = seats.filter((seat) => seat.floorNo === 2);

  // Hàm tạo lưới ghế cho từng tầng
  const renderSeats = (floorSeats, floorLabel) => {
    const maxRow = Math.max(...floorSeats.map((seat) => seat.rowNo));
    const maxCol = 5; // Dựa trên dữ liệu (cột 1, 3, 5)

    const grid = Array.from({ length: maxRow }, () => Array(maxCol).fill(null));

    floorSeats.forEach((seat) => {
      const rowIndex = seat.rowNo - (floorLabel === "Tầng dưới" ? 1 : 8);
      const colIndex = seat.columnNo - 1;
      grid[rowIndex][colIndex] = seat;
    });

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{floorLabel}</h3>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${maxCol}, 40px)` }}
        >
          {grid.map((row, rowIndex) =>
            row.map((seat, colIndex) => (
              <div
                key={`${floorLabel}-${rowIndex}-${colIndex}`}
                className="w-10 h-10 flex items-center justify-center"
              >
                {seat ? (
                  <button
                    onClick={() => handleSeatClick(seat)}
                    className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-medium
                          ${
                            seat.bookStatus === 1
                              ? "bg-gray-400 cursor-not-allowed"
                              : seat.inSelect === 1
                              ? "bg-blue-200 border-blue-500"
                              : "bg-white border-gray-300 hover:bg-blue-100"
                          }`}
                    disabled={seat.bookStatus === 1}
                  >
                    {seat.chair}
                  </button>
                ) : (
                  <div className="w-8 h-8"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex space-x-4 mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-400 mr-2"></div>
          <span>Đã đặt</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border border-gray-300 mr-2"></div>
          <span>Còn trống</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-200 border border-blue-500 mr-2"></div>
          <span>Đang chọn</span>
        </div>
      </div>

      <div className="flex space-x-4">
        {renderSeats(floor1Seats, "Tầng dưới")}
        {renderSeats(floor2Seats, "Tầng trên")}
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p>Đã chọn: {selectedSeats.length} ghế</p>
          <p>Tổng: {totalPrice.toLocaleString()} VNĐ</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded text-white ${
              selectedSeats.length > 0
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={selectedSeats.length === 0}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatPanel;
