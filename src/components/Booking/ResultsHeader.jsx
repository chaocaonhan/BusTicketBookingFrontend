// components/ResultsHeader.jsx
import React from "react";

const ResultsHeader = ({
  from,
  to,
  count,
  isReturn,
  departureDate,
  returnDate,
  activeTab,
  setActiveTab,
  sortBy,
  onSortChange,
}) => (
  <div className="mb-4">
    <h2 className="text-xl font-bold text-[#00613d]">
      {activeTab === "outbound"
        ? `${from} - ${to} ( ${count} )`
        : `${to} -  ${from} ( ${count}    )`}
    </h2>

    <div className="flex mt-2 gap-2">
      <div className="flex mt-2 gap-2">
        <button
          className={`flex items-center px-3 py-2 rounded-md ${
            sortBy === "price"
              ? "bg-orange-500 text-white"
              : "bg-orange-100 text-orange-500"
          }`}
          onClick={() => onSortChange("price")}
        >
          <span className="mr-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          </span>
          Giá rẻ bất ngờ
        </button>
        <button
          className={`flex items-center px-3 py-2 rounded-md ${
            sortBy === "time"
              ? "bg-orange-500 text-white"
              : "bg-orange-100 text-orange-500"
          }`}
          onClick={() => onSortChange("time")}
        >
          <span className="mr-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
            </svg>
          </span>
          Giờ khởi hành
        </button>
        <button
          className={`flex items-center px-3 py-2 rounded-md ${
            sortBy === "seats"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => onSortChange("seats")}
        >
          <span className="mr-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 18v3h3v-3h10v3h3v-6H4v3zm15-8h3v3h-3v-3zM2 10h3v3H2v-3zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z" />
            </svg>
          </span>
          Ghế trống
        </button>
      </div>
    </div>
    {isReturn === true && (
      <div className="flex min-w-full justify-center mt-4 mb-2 gap-2">
        <button
          className={`w-1/2 py-2 font-semibold rounded-t ${
            activeTab === "outbound"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("outbound")}
        >
          Chiều đi {departureDate ? `- ${departureDate}` : ""}
        </button>
        <button
          className={`w-1/2  py-2 font-semibold rounded-t ${
            activeTab === "return"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("return")}
        >
          Chiều về {returnDate ? `- ${returnDate}` : ""}
        </button>
      </div>
    )}
  </div>
);

export default ResultsHeader;
