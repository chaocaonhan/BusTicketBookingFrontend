// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BusSearch from "../components/comon/BusSearch";
import PopularRoutes from "../components/comon/PopularRoutes";
import BusFeatures from "../components/comon/BusFeatures";

const Home = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleSearch = (
    departure,
    destination,
    departureDate,
    returnDate,
    isReturn
  ) => {
    // Đảm bảo isReturn là false nếu không có returnDate
    if (!returnDate || returnDate === "null") {
      isReturn = false;
    }

    console.log("Search triggered with:", {
      departure,
      destination,
      departureDate,
      returnDate,
      isReturn,
    });

    // Tạo query string từ các tham số tìm kiếm
    const queryParams = new URLSearchParams({
      departure,
      destination,
      departureDate,
      returnDate: returnDate || "null", // Đặt null nếu không có returnDate
      isReturn: isReturn ? "true" : "false",
    }).toString();

    // Điều hướng đến BookingPage với query string
    navigate(`/dat-ve?${queryParams}`);
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Phần BusSearch */}
      <div
        className="w-full grid place-items-center"
        style={{
          minHeight: "500px",
          backgroundImage:
            "url('https://cuscoperu.b-cdn.net/wp-content/uploads/2024/08/Carretera.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <BusSearch
          className="p-6 rounded-lg shadow-lg"
          onSearch={handleSearch} // Truyền handleSearch vào BusSearch
        />
      </div>

      {/* Phần PopularRoutes và BusFeatures */}
      <PopularRoutes className="px-3" />
      <BusFeatures />
    </div>
  );
};

export default Home;
