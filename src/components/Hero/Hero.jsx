import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BusSearchHero({ className }) {
  const [locations, setLocations] = useState([]);
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  // Variants for animation
  const variants = {
    hidden: { opacity: 0, y: -800 },
    visible: { opacity: 1, y: 0 },
  };

  // Fetch locations on component mount
  useEffect(() => {
    fetch("http://localhost:8081/api/tinhthanh")
      .then((response) => {
        if (!response.ok) throw new Error("API response không OK");
        return response.json();
      })
      .then((data) => {
        console.log("Dữ liệu API:", data);
        setLocations(data);
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  }, []);

  // Search handler
  const handleSearch = () => {
    console.log(
      "Tìm kiếm chuyến xe từ",
      departure,
      "đến",
      destination,
      "vào ngày",
      date
    );
  };

  // Get today's date for min date attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      className={`w-full bg-[url("./assets/herobg.png")] flex  justify-center h-screen bg-cover bg-no-repeat bg-top ${className}`}
      initial="hidden"
      animate="visible"
      variants={variants}
      exit="hidden"
      transition={{ duration: 0.85, ease: "easeInOut" }}
    >
      <div className="this-clag bg-white bg-opacity-90 p-4 rounded-xl mt-20 shadow-lg max-w-4xl w-full mx-4 max-h-fit">
        <div className="flex flex-col justify-center items-center max-h-fit  mt-1 md:flex-row gap-4 p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto">
          {/* Dropdown Điểm Đi */}
          <select
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 relative"
            value={departure}
            onChange={(e) => {
              console.log("Điểm đi đã chọn:", e.target.value);
              setDeparture(e.target.value);
            }}
          >
            <option value="">Chọn điểm đi</option>
            {locations.length === 0 ? (
              <option value="" disabled>
                Đang tải...
              </option>
            ) : (
              locations.map((loc) => (
                <option key={loc.id} value={loc.tenTinhThanh}>
                  {loc.tenTinhThanh}
                </option>
              ))
            )}
          </select>
          {/* Dropdown Điểm Đến */}
          <select
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 relative"
            value={destination}
            onChange={(e) => {
              console.log("Điểm đến đã chọn:", e.target.value);
              setDestination(e.target.value);
            }}
          >
            <option value="">Chọn điểm đến</option>
            {locations.length === 0 ? (
              <option value="" disabled>
                Đang tải...
              </option>
            ) : (
              locations.map((loc) => (
                <option key={loc.id} value={loc.tenTinhThanh}>
                  {loc.tenTinhThanh}
                </option>
              ))
            )}
          </select>
          {/* Chọn ngày */}
          <input
            type="date"
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 relative"
            value={date}
            onChange={(e) => {
              console.log("Ngày đã chọn:", e.target.value);
              setDate(e.target.value);
            }}
            onClick={() => console.log("Input date được click!")}
            min={today} // Giới hạn từ hôm nay
          />
          {/* Nút Tìm Kiếm */}
          <button
            className="bg-orange-500 text-white p-3 w-96 rounded-full hover:bg-orange-600 transition"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </motion.div>
  );
}
