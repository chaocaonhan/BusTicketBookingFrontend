import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import {
  MoveLeft,
  Info,
  BadgeDollarSign,
  PhoneCall,
  Clock,
  Map,
} from "lucide-react";
import authService from "../../services/authService";

const RouteSchedule = () => {
  const { routeId } = useParams();
  const { state } = useLocation();
  const [route, setRoute] = useState(state?.route || null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rendered, setRendered] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Lấy vai trò  như trong Login.jsx
  const role = authService.getUserRole();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
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

        const resStops = await fetch(
          `http://localhost:8081/api/diem-dung/tuyen/${routeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dataStops = await resStops.json();
        if (dataStops.code === 200) {
          const sortedStops = dataStops.result.sort(
            (a, b) => a.thoiGianTuDiemDau - b.thoiGianTuDiemDau
          );
          setStops(sortedStops);
        } else {
          setStops([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setRendered(true);
        }, 100);
      }
    };

    if (routeId) {
      fetchData();
    }
  }, [routeId, route, token]);

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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div
          className={`mb-6 transition-all duration-700 ease-out ${
            rendered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Nút quay lại bên trái */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-orange-400 transition-colors duration-300"
            >
              <MoveLeft />
              <span className="ml-1">Quay lại</span>
            </button>
            <h1 className="text-xl font-bold text-[#00613d] flex-1 text-center">
              Tuyến xe {route?.tenTuyen || ""}
            </h1>
            {/* Nút sửa chỉ hiển thị nếu là ADMIN */}
            {role === "ADMIN" && (
              <button
                onClick={() => {
                  navigate(`/admin/route-schedule/${route?.id}/edit`, {
                    state: { tenTuyen: route?.tenTuyen },
                  });
                }}
                className="px-4 py-2 bg-orange-100 text-orange-600 rounded hover:bg-orange-200 font-medium ml-2"
                title="Sửa tuyến xe"
              >
                Sửa lịch trình
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3 mt-2 text-gray-600 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-orange-600 mr-1" />
              <span>{route?.thoiGianDiChuyen || "N/A"} phút</span>
            </div>
            <div className="flex items-center">
              <Map className="w-4 h-4 text-orange-500 mr-1" />
              <span>{route?.khoangCach || "N/A"} km</span>
            </div>
          </div>
        </div>

        {/* Timeline dùng MUI để tạo */}
        <div className="relative pb-6">
          {stops.length === 0 ? (
            <p className="text-center text-gray-500">Không có điểm dừng</p>
          ) : (
            <Timeline
              sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                },
              }}
            >
              {stops.map((stop, index) => (
                <TimelineItem
                  key={stop.id}
                  sx={{
                    transition: `all 700ms ease-out ${index * 150}ms`,
                    opacity: rendered ? 1 : 0,
                    transform: rendered ? "translateY(0)" : "translateY(8px)",
                  }}
                >
                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        backgroundColor: "#ff9100",
                        transform: rendered ? "scale(1)" : "scale(0)",
                        position: "relative",
                        "&:before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: "50%",
                          backgroundColor: "orange", // Orange pulse effect
                          opacity: 0.4,
                          animation: rendered
                            ? "pulse 1s infinite ease-in-out"
                            : "none",
                          zIndex: -1,
                        },
                        "@keyframes pulse": {
                          "0%": { transform: "scale(3.5)", opacity: 0.4 },
                          "50%": { transform: "scale(1.5)", opacity: 0 },
                          "100%": { transform: "scale(1)", opacity: 0.4 },
                        },
                      }}
                    />
                    {index < stops.length - 1 && (
                      <TimelineConnector
                        sx={{
                          backgroundColor: rendered ? "#f97316" : "transparent", // Orange connector
                          transition: `background-color 1000ms ease-out ${
                            index * 150 + 300
                          }ms`,
                        }}
                      />
                    )}
                  </TimelineSeparator>
                  <TimelineContent>
                    <div
                      className={`bg-white border ${
                        index === stops.length - 1
                          ? "border-orange-100"
                          : "border-gray-100"
                      } rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 relative`}
                    >
                      <div
                        className={`absolute right-2 top-2 text-sm font-semibold ${
                          index === stops.length - 1
                            ? "text-orange-600"
                            : "text-orange-400"
                        } transition-all duration-700 ease-out`}
                        style={{
                          transitionDelay: `${index * 150 + 200}ms`,
                          opacity: rendered ? 1 : 0,
                          transform: rendered
                            ? "translateX(0)"
                            : "translateX(4px)",
                        }}
                      >
                        {/* Hiển thị số km từ điểm đầu */}
                        {stop.khoangCachToiDiemDau != null
                          ? `${stop.khoangCachToiDiemDau} km`
                          : ""}
                      </div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {stop.tenDiemDon}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {stop.diaChi}
                      </p>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </div>

        {/* Footer Info Boxes */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 transition-all duration-700 ease-out ${
            rendered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 "
          }`}
          style={{ transitionDelay: `${stops.length * 150 + 300}ms` }}
        >
          <div className="bg-whiteborder border border-orange-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 ">
            <div className="flex items-center text-orange-400 mb-2 text-center">
              <Info className="w-5 h-5 mr-2" />
              <span className="font-medium">Thông tin tuyến</span>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Tuyến chạy qua các điểm trên tuyến <br /> Nội Bài - Lào Cai
            </p>
          </div>
          <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center text-orange-400 mb-2">
              <BadgeDollarSign className="w-5 h-5 mr-2" />
              <span className="font-medium">Giá vé</span>
            </div>
            <p className="text-sm text-gray-600">Chỉ từ 1000đ / 1 km / Người</p>
          </div>
          <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 ">
            <div className="flex items-center text-orange-400 mb-2">
              <PhoneCall className="w-5 h-5 mr-2" />
              <span className="font-medium">Hỗ trợ</span>
            </div>
            <p className="text-sm text-gray-600">Hotline: 1900 1234</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteSchedule;
