// components/FilterPanel.jsx
import React from "react";
import { FunnelX } from "lucide-react";

const FilterPanel = ({
  timeFilters,
  typeFilters,
  rowFilters,
  floorFilters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="w-1/4 p-6 bg-white rounded-lg shadow mr-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">BỘ LỌC </h3>
        <button
          onClick={onReset}
          className="text-red-500 mr-2 flex items-center"
        >
          <FunnelX />
        </button>
      </div>

      <FilterSection
        title="Giờ đi"
        filters={timeFilters}
        onChange={(id) => onFilterChange("time", id)}
        type="checkbox"
        options={[
          { id: "morningEarly", label: "Sáng sớm 00:00 - 06:00" },
          { id: "morning", label: "Buổi sáng 06:00 - 12:00" },
          { id: "afternoon", label: "Buổi chiều 12:00 - 18:00" },
          { id: "evening", label: "Buổi tối 18:00 - 24:00" },
        ]}
      />

      <FilterSection
        title="Loại xe"
        filters={typeFilters}
        onChange={(id) => onFilterChange("type", id)}
        type="button"
        options={[
          { id: "seat", label: "ECONOMY" },
          { id: "bed", label: "VIP" },
          { id: "limousine", label: "ROYAL" },
        ]}
      />
    </div>
  );
};

const FilterSection = ({ title, filters, onChange, type, options }) => (
  <div className="mb-6">
    <h4 className="font-medium mb-2">{title}</h4>
    <div
      className={
        type === "checkbox" ? "flex flex-col gap-2" : "flex flex-wrap gap-2"
      }
    >
      {options.map(({ id, label }) =>
        type === "checkbox" ? (
          <label key={id} className="flex items-center">
            <input
              type="checkbox"
              checked={filters[id]}
              onChange={() => onChange(id)}
              className="mr-2"
            />
            {label}
          </label>
        ) : (
          <button
            key={id}
            className={`px-4 py-2 rounded-md ${
              filters[id]
                ? "bg-orange-400 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        )
      )}
    </div>
  </div>
);

export default FilterPanel;
