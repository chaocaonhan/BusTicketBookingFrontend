import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BusSearch from "@/components/comon/BusSearch";
import SearchResults from "../components/Booking/SearchResults";
import { toast } from "react-toastify";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const [searchParams, setSearchParams] = useState({
    departure: queryParams.get("departure") || "",
    destination: queryParams.get("destination") || "",
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

  // Hàm xử lý tìm kiếm
  const handleSearch = (
    departure,
    destination,
    departureDate,
    returnDate,
    isReturn
  ) => {
    const updatedParams = {
      departure,
      destination,
      departureDate,
      returnDate,
      isReturn: !!isReturn,
    };

    setSearchParams(updatedParams);

    const newQueryParams = new URLSearchParams({
      ...updatedParams,
      isReturn: isReturn ? "true" : "false",
    });
    navigate(`?${newQueryParams.toString()}`);
  };

  // Hàm xử lý khi chọn ghế và tiếp tục
  const handleContinueBooking = (tripInfo, currentTab) => {
    if (searchParams.isReturn) {
      if (currentTab === "outbound") {
        // Lưu thông tin chuyến đi và chuyển sang tab chiều về
        setBookingInfo((prev) => ({
          ...prev,
          outboundTrip: tripInfo,
        }));
        // Chuyển sang tab chiều về
        setActiveTab("return");
      } else {
        // Lưu thông tin chuyến về và chuyển sang trang đặt vé
        setBookingInfo((prev) => ({
          ...prev,
          returnTrip: tripInfo,
        }));
        // Chuyển sang trang đặt vé với thông tin đã lưu
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
      // Chuyến một chiều, lưu thông tin và chuyển sang trang đặt vé
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
      <p className="mt-4 text-gray-600">Vui lòng đợi</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-orange-100">
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

      <div className="max-w-7xl mx-auto px-4 py-8 ">
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
            <div className="w-full text-center flex flex-col items-center justify-center py-8 ">
              <hr className="w-full mb-4" />
              <p className="font-bold text-2xl mb-2">
                Không tìm thấy chuyến xe
              </p>
              <p className="text-gray-600 text-sm mb-4 max-w-lg mx-auto">
                Hiện tại, hệ thống chưa tìm thấy chuyến đi theo yêu cầu của quý
                khách, vui lòng nhập thông tin khác hoặc thử lại sau.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-4">
                <div className="flex items-center gap-2"></div>
              </div>
              <div className="flex justify-center">
                <img
                  src="https://static.vexere.com/webnx/prod/img/route-no-schedule-2.png"
                  alt=""
                  className="max-w-xs w-full"
                />
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default BookingPage;
