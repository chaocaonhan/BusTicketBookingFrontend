import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BusSearch({ className, onSearch, searchParams }) {
  const [locations, setLocations] = useState([]);
  const [departure, setDeparture] = useState(searchParams?.departure || "");
  const [destination, setDestination] = useState(
    searchParams?.destination || ""
  );
  const [date, setDate] = useState(searchParams?.date || "");
  const [tickets, setTickets] = useState(1); // Số lượng vé

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
    if (departure && destination && date && tickets > 0) {
      onSearch(departure, destination, date, tickets); // Gọi hàm onSearch với số lượng vé
    } else {
      alert("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      className={`w-full bg-[url("./assets/herobg.png")] flex justify-center h-auto bg-cover bg-no-repeat bg-top ${className}`}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.85, ease: "easeInOut" }}
    >
      <div className="bg-white bg-opacity-90 p-4 rounded-xl mt-20 shadow-lg max-w-4xl w-full mx-4 max-h-fit">
        <div className="flex flex-col justify-center items-center max-h-fit mt-1 md:flex-row gap-4 p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto">
          {/* Dropdown Điểm Đi */}
          <select
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Dropdown Điểm Đến */}
          <select
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Input Ngày */}
          <input
            type="date"
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
          />

          {/* Input Số Vé */}
          <input
            type="number"
            className="p-2 border rounded-lg w-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tickets}
            onChange={(e) => setTickets(Number(e.target.value))}
            min="1"
            placeholder="Số vé"
          />

          {/* Nút Tìm Kiếm */}
          <button
            className="bg-orange-500 text-white p-3 w-96 rounded-full hover:bg-orange-600 transition"
            onClick={handleSearch}
          >
            Tìm chuyến xe
          </button>
        </div>
      </div>
    </motion.div>
  );
}
