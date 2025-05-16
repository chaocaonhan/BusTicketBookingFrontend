// components/FilterPanel.jsx
import React from "react";

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
        <h3 className="text-lg font-bold">BỘ LỌC TÌM KIẾM</h3>
        <button
          onClick={onReset}
          className="text-red-500 mr-2 flex items-center"
        >
          Bỏ lọc
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
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
