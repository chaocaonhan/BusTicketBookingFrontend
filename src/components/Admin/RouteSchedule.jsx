import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

const RouteSchedule = () => {
  const { routeId } = useParams();
  const { state } = useLocation();
  const [route, setRoute] = useState(state?.route || null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rendered, setRendered] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Nếu không có route từ state, fetch thông tin tuyến
        if (!route) {
          const resRoute = await fetch(
            `http://localhost:8081/api/tuyenxe/${routeId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const dataRoute = await resRoute.json();
          if (dataRoute.code === 200) {
            setRoute(dataRoute.result);
          } else {
            throw new Error(dataRoute.message);
          }
        }

        // Lấy điểm dừng
        const resStops = await fetch(
          `http://localhost:8081/api/diem-dung/tuyen/${routeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dataStops = await resStops.json();
        if (dataStops.code === 200) {
          setStops(dataStops.result);
        } else {
          setStops([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        // Set a slight delay before animation starts
        setTimeout(() => {
          setRendered(true);
        }, 100);
      }
    };

    if (routeId) {
      fetchData();
    }
  }, [routeId, route, token]);

  // Function to format time based on minutes (for display purposes)
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  if (!routeId)
    return (
      <div className="py-4 text-center text-gray-500">
        Không tìm thấy tuyến xe
      </div>
    );
  if (loading)
    return (
      <div className="py-4 text-center text-gray-500">
        ⏳ Đang tải lịch trình tuyến...
      </div>
    );
  if (error)
    return <div className="text-red-500 py-4 text-center">Lỗi: {error}</div>;

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg p-6 mt-16">
      {/* Main Content */}
      {/* mx-auto để căn giữa */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Route Title with Fade In Animation */}

        <div
          className={`mb-6 transition-all duration-700 ease-out ${
            rendered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">
              Tuyến xe {route?.tenTuyen || ""}
            </h1>
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Quay lại</span>
            </button>
          </div>
          <div className="flex items-center space-x-3 mt-2 text-gray-600 text-sm">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-500 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{route?.thoiGianDiChuyen || "N/A"} phút</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-500 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span>{route?.khoangCach || "N/A"} km</span>
            </div>
          </div>
        </div>

        {/* Timeline with Staggered Animation */}
        <div className="relative pb-6">
          {stops.length === 0 ? (
            <p className="text-center text-gray-500">Không có điểm dừng</p>
          ) : (
            stops.map((stop, index) => (
              <div
                key={stop.id}
                className={`relative mb-6 transition-all duration-700 ease-out ${
                  rendered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`, // Staggered delay for each item
                }}
              >
                {/* Line connecting dots with animation */}
                {index < stops.length - 1 && (
                  <div
                    className={`absolute left-2 top-4 w-0.5 bg-blue-100 transition-all duration-1000 ease-out ${
                      rendered ? "h-full" : "h-0"
                    }`}
                    style={{ transitionDelay: `${index * 150 + 300}ms` }}
                  ></div>
                )}

                {/* Dot with pulse animation */}
                <div
                  className={`absolute left-0 w-4 h-4 rounded-full mt-1.5 ${
                    index === 0
                      ? "bg-blue-600"
                      : index === stops.length - 1
                      ? "bg-green-600"
                      : "bg-blue-600"
                  } transition-all duration-500 ease-out ${
                    rendered ? "scale-100" : "scale-0"
                  }`}
                  style={{ transitionDelay: `${index * 150 + 100}ms` }}
                >
                  {/* Pulse effect for dots */}
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      index === stops.length - 1
                        ? "bg-green-400"
                        : "bg-blue-400"
                    }`}
                  />
                </div>

                {/* Content */}
                <div
                  className={`ml-8 bg-white border ${
                    index === stops.length - 1
                      ? "border-green-100"
                      : "border-gray-100"
                  } rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300`}
                >
                  <h3 className="text-base font-semibold text-gray-800">
                    {stop.tenDiemDon}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{stop.diaChi}</p>
                </div>

                {/* Time */}
                <div
                  className={`absolute right-2 top-2 text-blue-600 font-semibold transition-all duration-700 ease-out ${
                    rendered
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: `${index * 150 + 200}ms` }}
                >
                  {formatTime(stop.thoiGianTuDiemDau)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Info Boxes with Animation */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 transition-all duration-700 ease-out ${
            rendered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: `${stops.length * 150 + 300}ms` }}
        >
          {/* Trip Info */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center text-blue-600 mb-2">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Thông tin chuyến</span>
            </div>
            <p className="text-sm text-gray-600">
              Xe giường nằm cao cấp, 40 chỗ, có WiFi miễn phí và ổ cắm điện.
            </p>
          </div>

          {/* Price */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center text-blue-600 mb-2">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Giá vé</span>
            </div>
            <p className="text-sm text-gray-600">350.000 VNĐ/người/chiều</p>
          </div>

          {/* Support */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center text-blue-600 mb-2">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="font-medium">Hỗ trợ</span>
            </div>
            <p className="text-sm text-gray-600">Hotline: 1900 xxxx</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteSchedule;
