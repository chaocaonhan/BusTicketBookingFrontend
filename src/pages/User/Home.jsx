import React, { useState } from "react";
import BusSearch from "../../components/feature/Hero/SearchBar";
import PopularRoutes from "../../components/feature/Hero/PopularRoutes";
import BusFeatures from "../../components/feature/Hero/BusFeatures";
import SearchResults from "../../components/feature/Hero/SearchResults";

const Home = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [searchParams, setSearchParams] = useState({
    departure: "",
    destination: "",
    date: "",
  });

  const handleSearch = (departure, destination, date) => {
    setSearchParams({ departure, destination, date });

    // Định dạng ngày theo API yêu cầu (d/M/yyyy)
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    // Gọi API /search
    fetch(
      `http://localhost:8081/api/chuyenxe/search?tinhDi=${encodeURIComponent(
        departure
      )}&tinhDen=${encodeURIComponent(destination)}&ngayDi=${formattedDate}`
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
      <BusSearch
        className=""
        onSearch={handleSearch}
        searchParams={searchParams}
      />
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
