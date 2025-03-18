import { useState, useEffect } from "react";

export default function BusSearch() {
  const [locations, setLocations] = useState([]);
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

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

  const handleSearch = () => {
    console.log("Tìm kiếm chuyến xe từ", departure, "đến", destination, "vào ngày", date);
  };

  const today = new Date().toISOString().split("T")[0];
  console.log("Today's date:", today);

  return (
    <div className="flex flex-col justify-center items-center mt-40 md:flex-row gap-4 p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto">
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
          <option value="" disabled>Đang tải...</option>
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
          <option value="" disabled>Đang tải...</option>
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
  );
}