import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BusSearch from "@/components/comon/BusSearch";
import SearchResults from "@/components/comon/SearchResults";
import { toast } from "react-toastify";

const BookingPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [searchParams, setSearchParams] = useState({
    departure: queryParams.get("departure") || "",
    destination: queryParams.get("destination") || "",
    departureDate: queryParams.get("departureDate") || "",
    returnDate: queryParams.get("returnDate") || "",
    tripType: queryParams.get("isReturn") === "true" ? "roundTrip" : "oneWay",
  });

  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hàm xử lý tìm kiếm
  const handleSearch = (departure, destination, departureDate, returnDate) => {
    setSearchParams({ departure, destination, departureDate, returnDate });
  };

  // Fetch dữ liệu chuyến xe
  useEffect(() => {
    const fetchResults = async () => {
      if (
        !searchParams.departure ||
        !searchParams.destination ||
        !searchParams.departureDate
      ) {
        setSearchResults([]);
        return;
      }

      setLoading(true);

      try {
        const apiUrl = new URL("http://localhost:8081/api/chuyenxe/search");
        apiUrl.searchParams.append("tinhDi", searchParams.departure);
        apiUrl.searchParams.append("tinhDen", searchParams.destination);
        apiUrl.searchParams.append("ngayDi", searchParams.departureDate);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Lỗi API:", error);
        toast.error("Không thể tải dữ liệu chuyến xe", {
          position: "top-right",
          autoClose: 3000,
        });
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  // Simple loading spinner component
  const LoadingSpinner = () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Đang tìm kiếm chuyến xe...</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen">
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
          className="p-6 rounded-lg shadow-lg bg-white"
          searchParams={searchParams}
          onSearch={handleSearch}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : searchResults ? (
          searchResults.length > 0 ? (
            <SearchResults results={searchResults} />
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">
                Không tìm thấy chuyến xe phù hợp
              </p>
              <button
                onClick={() => setSearchResults(null)}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
              >
                Thử lại
              </button>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default BookingPage;
