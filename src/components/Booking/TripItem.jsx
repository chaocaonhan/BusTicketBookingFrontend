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
  <div className="grid grid-cols-3 items-center w-full mb-2">
    <div className="justify-self-start">
      <span className="text-xl font-bold">{start.slice(0, 5)}</span>
    </div>

    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center">
        <div className="h-px w-4 bg-gray-300"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-500 mx-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="h-px w-4 bg-gray-300"></div>
      </div>
      <span className="text-xs text-gray-500 mt-1">{duration}</span>
    </div>

    <div className="justify-self-end">
      <span className="text-xl font-bold">{end.slice(0, 5)}</span>
    </div>
  </div>
);

const TripLocations = ({ from, to }) => (
  <div className="flex mb-4">
    <div className="w-1/2 font-medium text-gray-700">{from}</div>
    <div className="w-1/2 text-right font-medium text-gray-700">{to}</div>
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
    <div className="flex space-x-4">
      <button className="px-4 py-2 text-orange-600 font-medium">
        Chọn ghế
      </button>
      <button className="px-4 py-2 text-orange-600 font-medium">
        Lịch trình
      </button>
      <button className="px-4 py-2 text-orange-600 font-medium">
        Trung chuyển
      </button>
      <button className="px-4 py-2 text-orange-600 font-medium">
        Chính sách
      </button>
    </div>
    <div className="ml-auto">
      <button className="bg-orange-100 text-orange-500 font-medium px-6 py-2 rounded-lg">
        Chọn chuyến
      </button>
    </div>
  </div>
);

export default TripItem;
