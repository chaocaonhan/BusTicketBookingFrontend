"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import driverIcon from "../../assets/driver.png";
import axios from "axios";
import authService from "../../services/authService";

export default function DriverSchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [scheduleData, setScheduleData] = useState({});
  const location = useLocation();
  const { driver } = location.state || {};

  // Function to fetch schedule data from the API
  const fetchScheduleData = async (date) => {
    try {
      const token = authService.getToken();
      const response = await axios.get(
        `http://localhost:8081/api/taiXe/${driver.id}/lich-lam-viec`,
        {
          params: {
            ngayYeuCau: date.toISOString().split("T")[0],
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.code === 200) {
        const formattedData = formatScheduleData(response.data.result);
        setScheduleData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  };

  // Format the API response to match the existing data structure
  const formatScheduleData = (apiData) => {
    const formatted = {};
    apiData.forEach((entry) => {
      formatted[entry.ngay] = entry.caLamViec.map((ca) => ({
        time: ca.thoiGian,
        route: ca.tenTuyen,
        vehicle: ca.xe,
        status: "scheduled", // Assuming all are scheduled
      }));
    });
    return formatted;
  };

  useEffect(() => {
    fetchScheduleData(currentWeek);
  }, [currentWeek]);

  // Tính toán ngày đầu tuần (Thứ 2)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // Tạo array 7 ngày trong tuần
  const getWeekDays = (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekStart = getWeekStart(currentWeek);
  const weekDays = getWeekDays(weekStart);
  const dayNames = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const formatDateKey = (date) => {
    return date.toISOString().split("T")[0];
  };

  const formatWeekRange = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return `${startDate.getDate()}/${
      startDate.getMonth() + 1
    } - ${endDate.getDate()}/${
      endDate.getMonth() + 1
    }/${endDate.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-16">
      <div className="max-w-full mx-auto">
        {driver && (
          <div className="mb-6 flex items-center space-x-4">
            <img
              src={driver?.anh || driverIcon}
              alt="driver"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-[#00613d]">
                {driver.hoTen}
              </h2>
              <p className="text-gray-600">{driver.sdt}</p>
              <p className="text-gray-600">{driver.email}</p>
            </div>
          </div>
        )}

        <div className="text-2xl font-bold text-[#00613d] mb-4">
          <h2>Lịch làm việc của tài xế</h2>
        </div>

        {/* Week Navigator */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("prev")}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Tuần trước
              </Button>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-400" />
                <span className="text-lg font-semibold text-[#00613d]">
                  Tuần {formatWeekRange(weekStart)}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("next")}
                className="flex items-center gap-2"
              >
                Tuần sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dateKey = formatDateKey(day);
            const daySchedule = scheduleData[dateKey] || [];
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div key={`day-${index}`} className="flex flex-col">
                <div
                  className={`p-3 text-center rounded-t-lg bg-orange-100 text-orange-600`}
                >
                  <p className={`font-medium `}>
                    {dayNames[index]} {day.getDate()}/{day.getMonth() + 1}
                  </p>
                </div>

                {/* Schedule content */}
                <div className="h-full min-h-[200px] bg-white border-l border-r border-b rounded-b-lg p-2 overflow-y-auto">
                  {daySchedule.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-20 text-gray-400">
                      <Calendar className="w-6 h-6 mb-1" />
                      <p className="text-xs">Không có lịch</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {daySchedule.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="p-2 border border-orange-300 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3 text-orange-400 flex-shrink-0" />
                            <span className="text-xs font-medium truncate">
                              {schedule.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-1">
                            <MapPin className="w-3 h-3 text-green-600 flex-shrink-0" />
                            <span className="text-xs text-gray-700 truncate">
                              {schedule.route}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Truck className="w-3 h-3 text-gray-600 flex-shrink-0" />
                            <span className="text-xs text-gray-600 truncate">
                              {schedule.vehicle}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
