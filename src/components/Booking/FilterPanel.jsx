// components/FilterPanel.jsx
import React from "react";

const FilterPanel = ({
  timeFilters,
  typeFilters,
  rowFilters,
  floorFilters,
  onTimeFilterChange,
  onTypeFilterChange,
  onRowFilterChange,
  onFloorFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="w-1/4 p-6 bg-white rounded-lg shadow mr-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">BỘ LỌC TÌM KIẾM</h3>
        <button
          onClick={onResetFilters}
          className="text-red-500 mr-2 flex items-center"
        >
          Bỏ lọc
          {/* Icon SVG giữ nguyên */}
        </button>
      </div>

      <FilterSection
        title="Giờ đi"
        filters={timeFilters}
        onChange={onTimeFilterChange}
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
        onChange={onTypeFilterChange}
        type="button"
        options={[
          { id: "eco", label: "ECONOMY" },
          { id: "vip", label: "VIP" },
          { id: "royal", label: "ROYAL" },
        ]}
      />

      {/* Tương tự cho các filter sections khác */}
    </div>
  );
};

const FilterSection = ({ title, filters, onChange, type, options }) => (
  <div className="mb-6">
    <h4 className="font-medium mb-2">{title}</h4>
    <div className={type === "checkbox" ? "flex flex-col gap-2" : "flex gap-2"}>
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
              filters[id] ? "bg-blue-100 border border-blue-500" : "bg-gray-100"
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
