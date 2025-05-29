// SearchResults.jsx
import React, { useState, useEffect, useMemo } from "react";
import FilterPanel from "./FilterPanel";
import ResultsHeader from "./ResultsHeader";
import TripItem from "./TripItem";
import { parseTime, calculateDuration } from "@/lib/timeUtils";
import TripNotFound from "./TripNotFound";

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
              <>
                <TripNotFound />
                <p className="text-orange-500 font-bold text-right ">
                  Tiếp tục đặt vé một chiều
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
