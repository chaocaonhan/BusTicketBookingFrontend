import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BusSearch from "@/components/comon/BusSearch";
import SearchResults from "../components/Booking/SearchResults";
import TripNotFound from "@/components/Booking/TripNotFound";
import { showSuccess, showError } from "../utils/toastConfig";
import busSearchBG from "../assets/busSearchBG.jpg";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const [searchParams, setSearchParams] = useState({
    departure: queryParams.get("departure") || "",
    destination: queryParams.get("destination") || "",
    from: queryParams.get("from") || "", // ID điểm đi
    to: queryParams.get("to") || "", // ID điểm đến
    departureDate: queryParams.get("departureDate") || "",
    returnDate: queryParams.get("returnDate") || "",
    isReturn: queryParams.get("isReturn") === "true",
  });

  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    outboundTrip: null,
    returnTrip: null,
  });
  const [activeTab, setActiveTab] = useState("outbound");

  const handleSearch = (
    departure,
    destination,
    departureDate,
    returnDate,
    isReturn,
    from,
    to
  ) => {
    const updatedParams = {
      departure,
      destination,
      departureDate,
      returnDate,
      isReturn: !!isReturn,
      from,
      to,
    };

    setSearchParams(updatedParams);

    const newQueryParams = new URLSearchParams({
      ...updatedParams,
      isReturn: isReturn ? "true" : "false",
    });
    navigate(`?${newQueryParams.toString()}`);
  };

  const handleContinueBooking = (tripInfo, currentTab) => {
    if (searchParams.isReturn) {
      if (currentTab === "outbound") {
        setBookingInfo((prev) => ({
          ...prev,
          outboundTrip: tripInfo,
        }));
        setActiveTab("return");
      } else {
        setBookingInfo((prev) => ({
          ...prev,
          returnTrip: tripInfo,
        }));
        navigate("/BookingDetail", {
          state: {
            bookingInfo: {
              ...bookingInfo,
              returnTrip: tripInfo,
            },
          },
        });
      }
    } else {
      setBookingInfo({
        outboundTrip: tripInfo,
      });
      navigate("/BookingDetail", {
        state: {
          bookingInfo: {
            outboundTrip: tripInfo,
          },
        },
      });
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (
        !searchParams.departure ||
        !searchParams.destination ||
        !searchParams.departureDate ||
        !searchParams.from ||
        !searchParams.to
      ) {
        setSearchResults([]);
        return;
      }

      setLoading(true);

      try {
        const apiUrl = new URL("http://localhost:8081/api/chuyenxe/search");
        apiUrl.searchParams.append("idDiemDi", searchParams.from); // Sử dụng from thay vì departure
        apiUrl.searchParams.append("idDiemDen", searchParams.to); // Sử dụng to thay vì destination
        apiUrl.searchParams.append("ngayDi", searchParams.departureDate);
        apiUrl.searchParams.append("ngayVe", searchParams.returnDate);
        apiUrl.searchParams.append("khuHoi", searchParams.isReturn);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Lỗi API:", error);
        showError("Không thể tải dữ liệu chuyến xe");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const LoadingSpinner = () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Vui lòng đợi</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-orange-100">
      <div
        className="w-full grid place-items-center"
        style={{
          minHeight: "500px",
          backgroundImage: `url(${busSearchBG})`,
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
            <SearchResults
              fromProvince={searchParams.departure}
              toProvince={searchParams.destination}
              results={searchResults}
              isReturn={!!searchParams.isReturn}
              departureDate={searchParams.departureDate}
              returnDate={searchParams.returnDate}
              onContinueBooking={handleContinueBooking}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ) : (
            <TripNotFound />
          )
        ) : null}
      </div>
    </div>
  );
};

export default BookingPage;
