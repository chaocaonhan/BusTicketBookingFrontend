import React, { useState } from "react";
import BusSearch from "../components/feature/Hero/BusSearch";
import PopularRoutes from "../components/feature/Hero/PopularRoutes";
import BusFeatures from "../components/feature/Hero/BusFeatures";
import SearchResults from "../components/feature/Hero/SearchResults";

const Home = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [searchParams, setSearchParams] = useState({
    departure: "",
    destination: "",
    departureDate: "",
    returnDate: "",
  });

  const handleSearch = (departure, destination, departureDate, returnDate) => {
    console.log("Received from BusSearch:");
    console.log("Departure:", departure);
    console.log("Destination:", destination);
    console.log("Departure Date:", departureDate);
    console.log("Return Date:", returnDate);

    setSearchParams({ departure, destination, departureDate, returnDate });

    fetch(
      `http://localhost:8081/api/chuyenxe/search?tinhDi=${encodeURIComponent(
        departure
      )}&tinhDen=${encodeURIComponent(destination)}&ngayDi=${encodeURIComponent(
        departureDate
      )}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Không tìm thấy chuyến xe");
        return response.json();
      })
      .then((data) => {
        setSearchResults(data); // Lưu kết quả từ API
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setSearchResults([]);
      });
  };

  return (
    <div className="relative w-full min-h-screen">
      <div
        className="w-full grid place-items-center"
        style={{
          minHeight: "500px",
          backgroundImage:
            "url('https://cuscoperu.b-cdn.net/wp-content/uploads/2024/08/Carretera.jpg')", // URL ảnh
          backgroundSize: "cover", // Đảm bảo ảnh phủ toàn bộ div
          backgroundPosition: "center", // Căn giữa ảnh
          backgroundRepeat: "no-repeat", // Không lặp lại ảnh
        }}
      >
        <BusSearch
          className=" p-6 rounded-lg shadow-lg"
          onSearch={handleSearch}
          searchParams={searchParams}
        />
      </div>
      {searchResults ? (
        <SearchResults results={searchResults} />
      ) : (
        <>
          <PopularRoutes className="px-3" />
          <BusFeatures />
        </>
      )}
    </div>
  );
};

export default Home;
