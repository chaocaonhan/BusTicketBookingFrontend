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

  const outboundTrips = useMemo(
    () => results.filter((trip) => trip.ngayKhoiHanh === departureDate),
    [results, departureDate]
  );
  const returnTrips = useMemo(
    () => results.filter((trip) => trip.ngayKhoiHanh === returnDate),
    [results, returnDate]
  );

  const [activeTab, setActiveTab] = useState("outbound"); // "outbound" hoặc "return"

  const tripsToShow = useMemo(
    () =>
      isReturn
        ? activeTab === "outbound"
          ? outboundTrips
          : returnTrips
        : outboundTrips,
    [isReturn, activeTab, outboundTrips, returnTrips]
  );

  // Filter logic
  useEffect(() => {
    let filtered = [...tripsToShow];

    // Time filter
    filtered = filtered.filter((trip) => {
      const time = parseTime(trip.gioKhoiHanh);
      const timeChecks = [
        timeFilters.morningEarly && time >= 0 && time < 6,
        timeFilters.morning && time >= 6 && time < 12,
        timeFilters.afternoon && time >= 12 && time < 18,
        timeFilters.evening && time >= 18 && time <= 24,
      ];

      if (Object.values(timeFilters).every((v) => !v)) return true;
      return timeChecks.some(Boolean);
    });

    // Type filter
    filtered = filtered.filter((trip) => {
      const type = trip.tenLoaiXe?.toLowerCase() || "";
      const typeChecks = [
        typeFilters.seat && type.includes("economy"),
        typeFilters.bed && type.includes("bed"),
        typeFilters.limousine && type.includes("limousine"),
      ];

      if (Object.values(typeFilters).every((v) => !v)) return true;
      return typeChecks.some(Boolean);
    });

    setFilteredResults(filtered);
    // eslint-disable-next-line
  }, [timeFilters, typeFilters, rowFilters, floorFilters, tripsToShow]);

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
          />
          <div className="space-y-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((trip) => (
                <TripItem
                  key={trip.id}
                  trip={trip}
                  calculateDuration={calculateDuration}
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Không tìm thấy chuyến xe phù hợp
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
