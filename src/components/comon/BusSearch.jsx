"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function BusSearch({ className, onSearch, searchParams }) {
  const [locations, setLocations] = useState([]);
  const [departureStations, setDepartureStations] = useState({});
  const [destinationStations, setDestinationStations] = useState({});
  const [expandedProvinces, setExpandedProvinces] = useState({});

  const [departure, setDeparture] = useState(searchParams?.departure || "");
  const [destination, setDestination] = useState(
    searchParams?.destination || ""
  );
  const [from, setFrom] = useState(searchParams?.from || ""); // Thêm state cho from (ID điểm đi)
  const [to, setTo] = useState(searchParams?.to || ""); // Thêm state cho to (ID điểm đến)
  const [departureProvince, setDepartureProvince] = useState("");
  const [destinationProvince, setDestinationProvince] = useState("");

  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  const departureRef = useRef(null);
  const destinationRef = useRef(null);

  const parseDateFromDisplayFormat = (displayDate) => {
    if (!displayDate) return "";
    const parts = displayDate.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const [departureDate, setDepartureDate] = useState(
    searchParams?.departureDate
      ? parseDateFromDisplayFormat(searchParams.departureDate)
      : ""
  );

  const [returnDate, setReturnDate] = useState(
    searchParams?.returnDate && searchParams.returnDate !== "null"
      ? parseDateFromDisplayFormat(searchParams.returnDate)
      : ""
  );

  const [isReturn, setIsReturn] = useState(
    searchParams?.isReturn === true || searchParams?.isReturn === "true"
  );

  const variants = {
    hidden: { opacity: 0, y: -800 },
    visible: { opacity: 1, y: 0 },
  };

  // Fetch provinces from API
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

  // Fetch stations by province
  const fetchStationsByProvince = async (provinceName, type) => {
    try {
      const encodedProvince = encodeURIComponent(provinceName);
      const response = await fetch(
        `http://localhost:8081/api/Station/getByProvince?province=${encodedProvince}`
      );

      if (!response.ok) throw new Error("API response không OK");

      const data = await response.json();
      if (data.code === 200 && Array.isArray(data.result)) {
        const stations = data.result.filter(
          (station) => station.trangThai === 1
        );

        if (type === "departure") {
          setDepartureStations((prev) => ({
            ...prev,
            [provinceName]: stations,
          }));
        } else {
          setDestinationStations((prev) => ({
            ...prev,
            [provinceName]: stations,
          }));
        }
      }
    } catch (error) {
      console.error("Lỗi khi gọi API stations:", error);
    }
  };

  // Handle province expansion
  const toggleProvince = async (provinceName, type) => {
    const key = `${type}_${provinceName}`;
    const isExpanded = expandedProvinces[key];

    const newExpandedProvinces = {};
    Object.keys(expandedProvinces).forEach((existingKey) => {
      if (!existingKey.startsWith(`${type}_`)) {
        newExpandedProvinces[existingKey] = expandedProvinces[existingKey];
      }
    });

    if (!isExpanded) {
      newExpandedProvinces[key] = true;
      const stations =
        type === "departure"
          ? departureStations[provinceName]
          : destinationStations[provinceName];
      if (!stations) {
        await fetchStationsByProvince(provinceName, type);
      }
    }

    setExpandedProvinces(newExpandedProvinces);
  };

  // Handle station selection
  const handleStationSelect = (station, provinceName, type) => {
    if (type === "departure") {
      setDeparture(station.tenDiemDon);
      setFrom(station.id); // Gán ID của điểm đi vào from
      setDepartureProvince(provinceName);
      setShowDepartureDropdown(false);
    } else {
      setDestination(station.tenDiemDon);
      setTo(station.id); // Gán ID của điểm đến vào to
      setDestinationProvince(provinceName);
      setShowDestinationDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        departureRef.current &&
        !departureRef.current.contains(event.target)
      ) {
        setShowDepartureDropdown(false);
      }
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target)
      ) {
        setShowDestinationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search logic
  const handleSearch = () => {
    if (departure && destination && departureDate && from && to) {
      if (isReturn === true && !returnDate) {
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
        isReturn === true && returnDate ? formatDate(returnDate) : null;

      onSearch(
        departure,
        destination,
        formattedDepartureDate,
        isReturn === true && returnDate ? formattedReturnDate : "",
        isReturn,
        from, // Truyền ID điểm đi
        to // Truyền ID điểm đến
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

  // Custom Dropdown Component
  const CustomDropdown = ({
    value,
    placeholder,
    type,
    dropdownRef,
    showDropdown,
    setShowDropdown,
  }) => (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer bg-white flex items-center justify-between"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span
          className={
            (value ? "text-gray-900" : "text-gray-500") +
            " truncate max-w-[140px] block"
          }
          title={value}
        >
          {value || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 transition-transform" />
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {locations.map((province) => (
            <div key={province.id}>
              <div
                className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                onClick={() => toggleProvince(province.tenTinhThanh, type)}
              >
                <span className="font-medium text-gray-900">
                  {province.tenTinhThanh}
                </span>
                {expandedProvinces[`${type}_${province.tenTinhThanh}`] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>

              {expandedProvinces[`${type}_${province.tenTinhThanh}`] && (
                <div className="bg-gray-50">
                  {(type === "departure"
                    ? departureStations[province.tenTinhThanh]
                    : destinationStations[province.tenTinhThanh]
                  )?.map((station) => (
                    <div
                      key={station.id}
                      className="flex items-center p-3 pl-2 hover:bg-orange-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      onClick={() =>
                        handleStationSelect(
                          station,
                          province.tenTinhThanh,
                          type
                        )
                      }
                    >
                      <div>
                        <div className="text-gray-900">
                          {station.tenDiemDon}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="p-3 pl-8 text-sm text-gray-500">
                      Đang tải...
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
          <div className="flex items-center gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                checked={isReturn === false}
                onChange={() => setIsReturn(false)}
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
                checked={isReturn === true}
                onChange={() => setIsReturn(true)}
                className="mr-2 accent-orange-500"
              />
              <span className="text-base font-medium text-gray-800">
                Khứ hồi
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Điểm đi
              </label>
              <CustomDropdown
                value={departure}
                placeholder="Chọn điểm đi"
                type="departure"
                dropdownRef={departureRef}
                showDropdown={showDepartureDropdown}
                setShowDropdown={setShowDepartureDropdown}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Điểm đến
              </label>
              <CustomDropdown
                value={destination}
                placeholder="Chọn điểm đến"
                type="destination"
                dropdownRef={destinationRef}
                showDropdown={showDestinationDropdown}
                setShowDropdown={setShowDestinationDropdown}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Ngày đi</label>
              <input
                type="date"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={today}
              />
            </div>

            {isReturn === true && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Ngày về</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || today}
                />
              </div>
            )}
          </div>

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
