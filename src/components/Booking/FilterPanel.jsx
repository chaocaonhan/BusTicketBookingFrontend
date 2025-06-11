// components/FilterPanel.jsx
import React from "react";
import { FunnelX } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const FilterPanel = ({
  timeFilters,
  typeFilters,
  rowFilters,
  floorFilters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="w-1/4 p-6 bg-white rounded-lg shadow sticky top-20 h-fit max-h-[calc(100vh-2rem)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#00613d]">BỘ LỌC</h3>
        <button onClick={onReset} className="text-red-500">
          <FunnelX className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto">
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
    </div>
  );
};

const FilterSection = ({ title, filters, onChange, type, options }) => (
  <div className="mb-6 max-h-36">
    <h4 className="font-medium mb-2">{title}</h4>
    <div
      className={
        type === "checkbox" ? "flex flex-col gap-2" : "flex flex-wrap gap-2"
      }
    >
      {options.map(({ id, label }) =>
        type === "checkbox" ? (
          <div key={id} className="flex items-center">
            <Checkbox
              id={id}
              checked={filters[id]}
              onCheckedChange={() => onChange(id)}
              className="mr-2"
            />
            <Label htmlFor={id}>{label}</Label>
          </div>
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
