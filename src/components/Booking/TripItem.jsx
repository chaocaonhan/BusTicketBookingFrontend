// components/TripItem.jsx
import React from "react";

const TripItem = ({ trip, calculateDuration }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Trip details */}
        <div className="w-2/3 pr-4">
          <TripTime
            start={trip.gioKhoiHanh}
            end={trip.gioKetThuc}
            duration={calculateDuration(trip.gioKhoiHanh, trip.gioKetThuc)}
          />
          <TripLocations from={trip.diemDi} to={trip.diemDen} />
        </div>

        <TripPrice
          price={trip.giaVe}
          type={trip.tenLoaiXe}
          seats={trip.soGheTrong}
        />
      </div>

      <TripActions />
    </div>
  );
};

const TripTime = ({ start, end, duration }) => (
  <div className="flex items-center">
    <span className="text-xl font-bold">{start.slice(0, 5)}</span>
    {/* Icon và duration */}
    <span className="text-xl font-bold ml-auto">{end.slice(0, 5)}</span>
  </div>
);

const TripLocations = ({ from, to }) => (
  <div className="flex mb-4">
    <div className="w-1/2 font-medium">{from}</div>
    <div className="w-1/2 text-right font-medium">{to}</div>
  </div>
);

const TripPrice = ({ price, type, seats }) => (
  <div className="text-right">
    <div className="mb-1">
      <span className="text-gray-500">{type}</span>
      <span className="text-green-600 ml-2">{seats} chỗ trống</span>
    </div>
    <div className="text-2xl font-bold text-orange-500">
      {price.toLocaleString()}đ
    </div>
  </div>
);

const TripActions = () => (
  <div className="flex border-t pt-4">
    {/* Các action buttons */}
    <button className="bg-orange-100 text-orange-500 font-medium px-6 py-2 rounded-lg">
      Chọn chuyến
    </button>
  </div>
);

export default TripItem;
