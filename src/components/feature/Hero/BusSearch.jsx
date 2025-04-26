import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function BusSearch({ className, onSearch, searchParams }) {
  const [locations, setLocations] = useState([]);
  const [departure, setDeparture] = useState(searchParams?.departure || "");
  const [destination, setDestination] = useState(
    searchParams?.destination || ""
  );
  const [departureDate, setDepartureDate] = useState(searchParams?.date || "");
  const [returnDate, setReturnDate] = useState(searchParams?.returnDate || "");
  const [tripType, setTripType] = useState("oneWay"); // "oneWay" or "roundTrip"

  const variants = {
    hidden: { opacity: 0, y: -800 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    fetch("http://localhost:8081/api/tinhthanh")
      .then((response) => {
        if (!response.ok) throw new Error("API response không OK");
        return response.json();
      })
      .then((data) => {
        if (data.code === 200 && Array.isArray(data.result)) {
          setLocations(data.result);
        } else {
          console.error("Dữ liệu API không hợp lệ:", data);
        }
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  }, []);

  const handleSearch = () => {
    if (departure && destination && departureDate) {
      if (tripType === "roundTrip" && !returnDate) {
        toast.error("Vui lòng chọn ngày về!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const formattedDepartureDate = formatDate(departureDate);
      const formattedReturnDate =
        tripType === "roundTrip" && returnDate ? formatDate(returnDate) : null;

      console.log("Departure:", departure || "Không có giá trị");
      console.log("Destination:", destination || "Không có giá trị");
      console.log("Departure Date:", departureDate || "Không có giá trị");
      console.log("Return Date:", formattedReturnDate);

      onSearch(
        departure,
        destination,
        formattedDepartureDate,
        formattedReturnDate
      );
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const currentDayName = new Date().toLocaleDateString("vi-VN", {
    weekday: "short",
  });

  const formatDateWithDay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.toLocaleDateString("vi-VN", { weekday: "short" });
    return `${dateStr.split("-").reverse().join("/")} \n${day}`;
  };

  return (
    <motion.div
      className="w-full flex justify-center h-auto"
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.85, ease: "easeInOut" }}
    >
      <div className="bg-white bg-opacity-70 rounded-xl mt-3 shadow-lg w-full max-w-4xl mx-4 p-6 border border-gray-100">
        <div className="flex flex-col gap-6">
          {/* Trip Type Selection */}
          <div className="flex items-center gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                checked={tripType === "oneWay"}
                onChange={() => setTripType("oneWay")}
                className="mr-2 accent-orange-500"
              />
              <span className="text-base font-medium text-gray-800">
                Một chiều
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                checked={tripType === "roundTrip"}
                onChange={() => setTripType("roundTrip")}
                className="mr-2 accent-orange-500"
              />
              <span className="text-base font-medium text-gray-800">
                Khứ hồi
              </span>
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Departure Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Điểm đi
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                >
                  <option value="">Chọn điểm đi</option>
                  {locations.length > 0 ? (
                    locations.map((loc) => (
                      <option key={loc.id} value={loc.tenTinhThanh}>
                        {loc.tenTinhThanh}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Đang tải...
                    </option>
                  )}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Destination Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Điểm đến
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500  appearance-none"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="">Chọn điểm đến</option>
                  {locations.length > 0 ? (
                    locations.map((loc) => (
                      <option key={loc.id} value={loc.tenTinhThanh}>
                        {loc.tenTinhThanh}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Đang tải...
                    </option>
                  )}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Departure Date Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium ">Ngày đi</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={today}
                />
                {departureDate && (
                  <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600"></div>
                )}
              </div>
            </div>

            {/* Return Date Field - Only shown for Round Trip */}
            {tripType === "roundTrip" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium ">Ngày về</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departureDate || today}
                  />
                  {!returnDate && (
                    <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="flex justify-center mt-2">
            <button
              className="bg-orange-500 text-white py-3 px-6 rounded-full hover:bg-orange-600 transition font-medium w-64"
              onClick={handleSearch}
            >
              Tìm chuyến xe
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
