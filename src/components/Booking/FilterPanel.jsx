"use client";

import React from "react";

import FilterPanel from "../components/FilterPanel";

export default function Page() {
  const [timeFilters, setTimeFilters] = React.useState({
    morningEarly: false,
    morning: false,
    afternoon: false,
    evening: false,
  });

  const [typeFilters, setTypeFilters] = React.useState({
    seat: false,
    bed: false,
    limousine: false,
  });

  const [rowFilters, setRowFilters] = React.useState({
    row1: false,
    row2: false,
    row3: false,
  });

  const [floorFilters, setFloorFilters] = React.useState({
    floor1: false,
    floor2: false,
  });

  const handleTimeFilterChange = (id) => {
    setTimeFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTypeFilterChange = (id) => {
    setTypeFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRowFilterChange = (id) => {
    setRowFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFloorFilterChange = (id) => {
    setFloorFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetFilters = () => {
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
      row1: false,
      row2: false,
      row3: false,
    });
    setFloorFilters({
      floor1: false,
      floor2: false,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Bus Ticket Filters</h1>
      <FilterPanel
        timeFilters={timeFilters}
        typeFilters={typeFilters}
        rowFilters={rowFilters}
        floorFilters={floorFilters}
        onTimeFilterChange={handleTimeFilterChange}
        onTypeFilterChange={handleTypeFilterChange}
        onRowFilterChange={handleRowFilterChange}
        onFloorFilterChange={handleFloorFilterChange}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
