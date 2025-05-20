// SearchResults.jsx
import React, { useState, useEffect, useMemo } from "react";
import FilterPanel from "./FilterPanel";
import ResultsHeader from "./ResultsHeader";
import TripItem from "./TripItem";
import { parseTime, calculateDuration } from "@/utils/timeUtils";

const SearchResults = ({
  fromProvince,
  toProvince,
  results,
  isReturn,
  departureDate,
  returnDate,
  onContinueBooking,
  activeTab,
  setActiveTab,
}) => {
  const [filteredResults, setFilteredResults] = useState(results);
  const [timeFilters, setTimeFilters] = useState({
    morningEarly: false,
    morning: false,
    afternoon: false,
    evening: false,
  });
  const [typeFilters, setTypeFilters] = useState({
    seat: false,
    bed: false,
    limousine: false,
  });
  const [rowFilters, setRowFilters] = useState({
    front: false,
    middle: false,
    back: false,
  });
  const [floorFilters, setFloorFilters] = useState({
    upper: false,
    lower: false,
  });
  const [openSeatMapId, setOpenSeatMapId] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const outboundTrips = useMemo(
    () => results.filter((trip) => trip.ngayKhoiHanh === departureDate),
    [results, departureDate]
  );
  const returnTrips = useMemo(
    () => results.filter((trip) => trip.ngayKhoiHanh === returnDate),
    [results, returnDate]
  );

  const tripsToShow = useMemo(
    () =>
      isReturn
        ? activeTab === "outbound"
          ? outboundTrips
          : returnTrips
        : outboundTrips,
    [isReturn, activeTab, outboundTrips, returnTrips]
  );

  // Reset openSeatMapId when switching tabs
  useEffect(() => {
    setOpenSeatMapId(null);
  }, [activeTab]);

  // Sort and filter logic
  useEffect(() => {
    let filtered = [...tripsToShow];

    // Time filter
    if (Object.values(timeFilters).some(Boolean)) {
      filtered = filtered.filter((trip) => {
        const time = parseTime(trip.gioKhoiHanh);
        return (
          (timeFilters.morningEarly && time >= 0 && time < 6) ||
          (timeFilters.morning && time >= 6 && time < 12) ||
          (timeFilters.afternoon && time >= 12 && time < 18) ||
          (timeFilters.evening && time >= 18 && time <= 24)
        );
      });
    }

    // Type filter
    if (Object.values(typeFilters).some(Boolean)) {
      filtered = filtered.filter((trip) => {
        const type = trip.tenLoaiXe?.toLowerCase() || "";
        return (
          (typeFilters.seat && type.includes("economy")) ||
          (typeFilters.bed && type.includes("vip")) ||
          (typeFilters.limousine && type.includes("royal"))
        );
      });
    }

    // Sort results
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "price":
            return a.giaVe - b.giaVe;
          case "time":
            return parseTime(a.gioKhoiHanh) - parseTime(b.gioKhoiHanh);
          case "seats":
            return b.soGheTrong - a.soGheTrong;
          default:
            return 0;
        }
      });
    }

    setFilteredResults(filtered);
  }, [timeFilters, typeFilters, rowFilters, floorFilters, tripsToShow, sortBy]);

  // Filter handlers
  const handleFilterChange = (filterType, filterName) => {
    const setters = {
      time: setTimeFilters,
      type: setTypeFilters,
      row: setRowFilters,
      floor: setFloorFilters,
    };

    setters[filterType]((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortBy === sortType ? null : sortType);
  };

  const handleSeatMapToggle = (tripId) => {
    // Nếu click vào chuyến xe đang mở, đóng nó lại
    if (openSeatMapId === tripId) {
      setOpenSeatMapId(null);
    } else {
      // Nếu click vào chuyến xe khác, đóng chuyến xe cũ và mở chuyến xe mới
      setOpenSeatMapId(tripId);
    }
  };

  const resetFilters = () => {
    setTimeFilters({
      morningEarly: false,
      morning: false,
      afternoon: false,
      evening: false,
    });
    setTypeFilters({
      seat: false,
      bed: false,
      limousine: false,
    });
    setRowFilters({
      front: false,
      middle: false,
      back: false,
    });
    setFloorFilters({
      upper: false,
      lower: false,
    });
    setSortBy(null);
  };

  return (
    <div className="py-4 max-w-6xl mx-auto">
      <div className="flex">
        <FilterPanel
          timeFilters={timeFilters}
          typeFilters={typeFilters}
          rowFilters={rowFilters}
          floorFilters={floorFilters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />

        <div className="w-3/4">
          <ResultsHeader
            from={fromProvince || "Điểm đi"}
            to={toProvince || "Điểm đến"}
            count={filteredResults.length}
            isReturn={isReturn}
            departureDate={departureDate}
            returnDate={returnDate}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
          <div className="space-y-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((trip) => (
                <TripItem
                  key={trip.id}
                  trip={trip}
                  calculateDuration={calculateDuration}
                  isSeatMapOpen={openSeatMapId === trip.id}
                  onSeatMapToggle={handleSeatMapToggle}
                  isReturn={isReturn}
                  activeTab={activeTab}
                  onContinueBooking={onContinueBooking}
                />
              ))
            ) : (
              <div className="w-full text-center flex flex-col items-center justify-center py-8">
                <hr className="w-full mb-4" />
                <p className="font-bold text-2xl mb-2">
                  Không tìm thấy chuyến xe
                </p>
                <p className="text-gray-600 text-sm mb-4 max-w-lg mx-auto">
                  Hiện tại, hệ thống chưa tìm thấy chuyến đi theo yêu cầu của
                  quý khách, quý khách có thể thử:
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      {/* SVG icon 1 */}
                      <svg
                        width="15"
                        height="16"
                        viewBox="0 0 15 16"
                        fill="none"
                      >
                        <path
                          d="M6.66667 15.5V10.5H8.33333V12.1667H15V13.8333H8.33333V15.5H6.66667ZM0 13.8333V12.1667H5V13.8333H0ZM3.33333 10.5V8.83333H0V7.16667H3.33333V5.5H5V10.5H3.33333ZM6.66667 8.83333V7.16667H15V8.83333H6.66667ZM10 5.5V0.5H11.6667V2.16667H15V3.83333H11.6667V5.5H10ZM0 3.83333V2.16667H8.33333V3.83333H0Z"
                          fill="#005BD3"
                        ></path>
                      </svg>
                    </span>
                    <span>Chọn lại các tiêu chí đặt vé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      {/* SVG icon 2 */}
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                      >
                        <path
                          d="M10.5 19.1667V17.5001H16.3333V16.6667H13V10.0001H16.3333V9.16675C16.3333 7.55564 15.7639 6.18064 14.625 5.04175C13.4861 3.90286 12.1111 3.33341 10.5 3.33341C8.88889 3.33341 7.51389 3.90286 6.375 5.04175C5.23611 6.18064 4.66667 7.55564 4.66667 9.16675V10.0001H8V16.6667H4.66667C4.20833 16.6667 3.81597 16.5036 3.48958 16.1772C3.16319 15.8508 3 15.4584 3 15.0001V9.16675C3 8.13897 3.19792 7.17022 3.59375 6.2605C3.98958 5.35078 4.52778 4.55564 5.20833 3.87508C5.88889 3.19453 6.68403 2.65633 7.59375 2.2605C8.50347 1.86466 9.47222 1.66675 10.5 1.66675C11.5278 1.66675 12.4965 1.86466 13.4062 2.2605C14.316 2.65633 15.1111 3.19453 15.7917 3.87508C16.4722 4.55564 17.0104 5.35078 17.4062 6.2605C17.8021 7.17022 18 8.13897 18 9.16675V17.5001C18 17.9584 17.8368 18.3508 17.5104 18.6772C17.184 19.0036 16.7917 19.1667 16.3333 19.1667H10.5Z"
                          fill="#005BD3"
                        ></path>
                      </svg>
                    </span>
                    <span>
                      Liên hệ tổng đài <b>19003368</b>, <b>0962 35 45 55</b> để
                      được hỗ trợ tư vấn và đặt vé
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img
                    src="https://static.vexere.com/webnx/prod/img/route-no-schedule-2.png"
                    alt=""
                    className="max-w-xs w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
