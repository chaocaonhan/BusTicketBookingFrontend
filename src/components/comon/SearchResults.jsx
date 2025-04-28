import React, { useState, useEffect } from "react";

const SearchResults = ({ results }) => {
  const [filteredResults, setFilteredResults] = useState(results);
  const [timeFilters, setTimeFilters] = useState({
    morningEarly: false,
    morning: false,
    afternoon: false,
    evening: false,
  });
  const [typeFilters, setTypeFilters] = useState({
    seat: false,
    bed: false,
    limousine: false,
  });
  const [rowFilters, setRowFilters] = useState({
    front: false,
    middle: false,
    back: false,
  });
  const [floorFilters, setFloorFilters] = useState({
    upper: false,
    lower: false,
  });
  const [showFilters, setShowFilters] = useState(true);

  // Hàm chuyển đổi thời gian (gioKhoiHanh: "HH:mm:ss") thành giờ số
  const parseTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  // Tính thời gian di chuyển (gioKetThuc - gioKhoiHanh)
  const calculateDuration = (startTime, endTime) => {
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    let duration = end - start;
    if (duration < 0) duration += 24; // Xử lý trường hợp qua ngày
    return `${Math.floor(duration)} giờ`;
  };

  // Lọc kết quả dựa trên các bộ lọc
  useEffect(() => {
    let filtered = [...results];

    // Lọc theo thời gian khởi hành
    const timeFiltered = filtered.filter((trip) => {
      const time = parseTime(trip.gioKhoiHanh);
      const timeChecks = [
        timeFilters.morningEarly && time >= 0 && time < 6,
        timeFilters.morning && time >= 6 && time < 12,
        timeFilters.afternoon && time >= 12 && time < 18,
        timeFilters.evening && time >= 18 && time <= 24,
      ];

      if (
        !timeFilters.morningEarly &&
        !timeFilters.morning &&
        !timeFilters.afternoon &&
        !timeFilters.evening
      ) {
        return true;
      }

      return timeChecks.some((check) => check);
    });

    // Lọc theo loại xe
    filtered = timeFiltered.filter((trip) => {
      const type = trip.tenLoaiXe?.toLowerCase() || "";
      const typeChecks = [
        typeFilters.seat && type.includes("economy"), // Giả sử "ECONOMY" là Ghế
        typeFilters.bed && type.includes("bed"), // Giả sử có "BED"
        typeFilters.limousine && type.includes("limousine"), // Giả sử có "LIMOUSINE"
      ];

      if (!typeFilters.seat && !typeFilters.bed && !typeFilters.limousine) {
        return true;
      }

      return typeChecks.some((check) => check);
    });

    // Lọc theo hàng ghế và tầng (hiện tại API không có dữ liệu này, để trống logic lọc)
    // Bạn có thể thêm logic nếu API được cập nhật với thông tin về hàng ghế hoặc tầng

    setFilteredResults(filtered);
  }, [timeFilters, typeFilters, rowFilters, floorFilters, results]);

  const handleTimeFilterChange = (filter) => {
    setTimeFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleTypeFilterChange = (filter) => {
    setTypeFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleRowFilterChange = (filter) => {
    setRowFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleFloorFilterChange = (filter) => {
    setFloorFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setTimeFilters({
      morningEarly: false,
      morning: false,
      afternoon: false,
      evening: false,
    });
    setTypeFilters({
      seat: false,
      bed: false,
      limousine: false,
    });
    setRowFilters({
      front: false,
      middle: false,
      back: false,
    });
    setFloorFilters({
      upper: false,
      lower: false,
    });
  };

  return (
    <div className=" py-4 max-w-6xl mx-auto">
      <div className="flex">
        {/* Filter Panel */}
        <div className="w-1/4 p-6 bg-white rounded-lg shadow mr-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">BỘ LỌC TÌM KIẾM</h3>
            <div className="flex">
              <button
                onClick={resetFilters}
                className="text-red-500 mr-2 flex items-center"
              >
                Bỏ lọc
                <span className="ml-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Time filters */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Giờ đi</h4>
            <div className="flex flex-col gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={timeFilters.morningEarly}
                  onChange={() => handleTimeFilterChange("morningEarly")}
                />
                <span>Sáng sớm 00:00 - 06:00</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={timeFilters.morning}
                  onChange={() => handleTimeFilterChange("morning")}
                />
                <span>Buổi sáng 06:00 - 12:00</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={timeFilters.afternoon}
                  onChange={() => handleTimeFilterChange("afternoon")}
                />
                <span>Buổi chiều 12:00 - 18:00</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={timeFilters.evening}
                  onChange={() => handleTimeFilterChange("evening")}
                />
                <span>Buổi tối 18:00 - 24:00</span>
              </label>
            </div>
          </div>

          {/* Vehicle type filters */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Loại xe</h4>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-md ${
                  typeFilters.seat
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100"
                }`}
                onClick={() => handleTypeFilterChange("seat")}
              >
                Ghế
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  typeFilters.bed
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100"
                }`}
                onClick={() => handleTypeFilterChange("bed")}
              >
                Giường
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  typeFilters.limousine
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100"
                }`}
                onClick={() => handleTypeFilterChange("limousine")}
              >
                Limousine
              </button>
            </div>
          </div>

          {/* Row filters */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Hàng ghế</h4>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-md ${
                  rowFilters.front
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100"
                }`}
                onClick={() => handleRowFilterChange("front")}
              >
                Hàng đầu
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  rowFilters.middle
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100"
                }`}
                onClick={() => handleRowFilterChange("middle")}
              >
                Hàng giữa
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  rowFilters.back
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100"
                }`}
                onClick={() => handleRowFilterChange("back")}
              >
                Hàng cuối
              </button>
            </div>
          </div>

          {/* Floor filters */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Tầng</h4>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-md ${
                  floorFilters.upper
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100"
                }`}
                onClick={() => handleFloorFilterChange("upper")}
              >
                Tầng trên
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  floorFilters.lower
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100"
                }`}
                onClick={() => handleFloorFilterChange("lower")}
              >
                Tầng dưới
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="w-3/4">
          {/* Route Header */}
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              {results[0]?.diemDi} - {results[0]?.diemDen} (
              {filteredResults.length})
            </h2>
            <div className="flex mt-2 gap-2">
              <button className="flex items-center bg-orange-100 text-orange-500 px-3 py-2 rounded-md">
                <span className="mr-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                </span>
                Giá rẻ bất ngờ
              </button>
              <button className="flex items-center bg-orange-100 text-orange-500 px-3 py-2 rounded-md">
                <span className="mr-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                  </svg>
                </span>
                Giờ khởi hành
              </button>
              <button className="flex items-center bg-gray-100 text-gray-800 px-3 py-2 rounded-md">
                <span className="mr-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4 18v3h3v-3h10v3h3v-6H4v3zm15-8h3v3h-3v-3zM2 10h3v3H2v-3zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z" />
                  </svg>
                </span>
                Ghế trống
              </button>
            </div>
          </div>

          {/* Trip Results */}
          <div className="space-y-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((trip, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4 ">
                      {/* thẻ bên trái */}
                      <div className="flex flex-col w-2/3 pr-4">
                        <div className="flex items-center">
                          <div className="flex items-center text-xl font-bold">
                            <span>{trip.gioKhoiHanh.slice(0, 5)}</span>
                            <span className="mx-2 text-green-500">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-gray-600">
                              {calculateDuration(
                                trip.gioKhoiHanh,
                                trip.gioKetThuc
                              )}
                              <span className="mx-1 text-gray-400">
                                (Asian/Hồ Chí Minh)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center ml-auto">
                            <div className="text-xl font-bold mr-2">
                              {trip.gioKetThuc.slice(0, 5)}
                            </div>
                            <div className="text-orange-500 mr-2">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="flex mb-4">
                          <div className="w-1/2">
                            <div className="font-medium">{trip.diemDi}</div>
                          </div>
                          <div className="w-1/2 text-right">
                            <div className="font-medium">{trip.diemDen}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-auto w-1/3">
                        <div className="flex items-center justify-end mb-1">
                          <span className="mr-2 text-gray-500">
                            {trip.tenLoaiXe}
                          </span>
                          <span className="text-green-600">
                            {trip.soGheTrong} chỗ trống
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-orange-500">
                          {trip.giaVe.toLocaleString()}đ
                        </div>
                      </div>
                    </div>

                    <div className="flex border-t pt-4">
                      <div className="flex space-x-4">
                        <button className="px-4 py-2 text-blue-600 font-medium">
                          Chọn ghế
                        </button>
                        <button className="px-4 py-2 text-blue-600 font-medium">
                          Lịch trình
                        </button>
                        <button className="px-4 py-2 text-blue-600 font-medium">
                          Trung chuyển
                        </button>
                        <button className="px-4 py-2 text-blue-600 font-medium">
                          Chính sách
                        </button>
                      </div>
                      <div className="ml-auto">
                        <button className="bg-orange-100 text-orange-500 font-medium px-6 py-2 rounded-lg">
                          Chọn chuyến
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Không tìm thấy chuyến xe nào phù hợp.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
