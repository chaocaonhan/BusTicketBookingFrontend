// components/ResultsHeader.jsx
import React from "react";

const ResultsHeader = ({ from, to, count }) => (
  <div className="mb-4">
    <h2 className="text-xl font-bold">
      {from} - {to} ({count})
    </h2>
    <div className="flex mt-2 gap-2">{/* Các filter buttons */}</div>
  </div>
);

export default ResultsHeader;
