"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TuyenDuong = () => {
  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8081/api/tuyen-xe");
      const result = await response.json();
      if (result.code === 200 && Array.isArray(result.result)) {
        setData(result.result);
        setRecords(result.result);
      } else {
        console.error("Dữ liệu API không hợp lệ:", result);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setRecords(
      data.filter((row) =>
        row.tinhDi.tenTinhThanh.toLowerCase().includes(value)
      )
    );
  };

  const handleEndFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setRecords(
      data.filter((row) =>
        row.tinhDen.tenTinhThanh.toLowerCase().includes(value)
      )
    );
  };

  const handleSearchRouteClick = (route) => {
    const today = new Date();
    const queryParams = new URLSearchParams();
    queryParams.append("departure", route.tinhDi.tenTinhThanh);
    queryParams.append("destination", route.tinhDen.tenTinhThanh);
    queryParams.append("departureDate", formatDate(today));
    queryParams.append("returnDate", "");
    queryParams.append("isReturn", "false");

    navigate(`/dat-ve?${queryParams.toString()}`);
  };

  const handleViewScheduleClick = (route) => {
    navigate(`/route-schedule/${route.id}`, { state: { route } });
  };

  return (
    <section className="container mx-auto my-9 w-[80%] min-h-svh">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="text-2xl font-bold text-[#00613d] mb-4">
          Các chuyến đi phổ biến
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            onChange={handleStartFilter}
            placeholder="Tìm kiếm điểm đi"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="text"
            onChange={handleEndFilter}
            placeholder="Tìm kiếm điểm đến"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="border-b mb-4"></div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full hidden md:table">
              <thead>
                <tr>
                  <th className="text-orange-400 font-bold text-lg text-center py-3">
                    Tuyến đường
                  </th>
                  <th className="text-orange-400 font-bold text-lg text-center py-3">
                    Quãng đường
                  </th>
                  <th className="text-orange-400 font-bold text-lg text-center py-3">
                    Thời gian đi
                  </th>
                  <th className="text-orange-400 font-bold text-lg text-center py-3">
                    Giá vé
                  </th>
                  <th className="text-orange-400 font-bold text-lg text-center py-3">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-2 text-center">{row.tenTuyen}</td>
                    <td className="py-4 px-2 text-center">
                      {row.khoangCach} km
                    </td>
                    <td className="py-4 px-2 text-center">
                      {row.thoiGianDiChuyen}
                    </td>
                    <td className="py-4 px-2 text-center">---</td>
                    <td className="py-4 px-2">
                      <div className="flex flex-row justify-center gap-2">
                        <button
                          className="px-3 py-2 rounded-lg text-white bg-orange-400 font-semibold hover:bg-orange-500 transition-colors text-sm"
                          onClick={() => handleSearchRouteClick(row)}
                        >
                          Tìm tuyến xe
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg text-white bg-orange-400 font-semibold hover:bg-orange-500 transition-colors text-sm"
                          onClick={() => handleViewScheduleClick(row)}
                        >
                          Xem lịch trình
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {records.map((row, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <div className="text-orange-400 font-bold text-sm mb-1">
                        Tuyến đường
                      </div>
                      <div className="text-gray-800">{row.tenTuyen}</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-bold text-sm mb-1">
                        Quãng đường
                      </div>
                      <div className="text-gray-800">{row.khoangCach} km</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-bold text-sm mb-1">
                        Thời gian đi
                      </div>
                      <div className="text-gray-800">
                        {row.thoiGianDiChuyen}
                      </div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-bold text-sm mb-1">
                        Giá vé
                      </div>
                      <div className="text-gray-800">---</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      className="px-4 py-2 rounded-lg text-white bg-orange-400 font-semibold hover:bg-orange-500 transition-colors text-sm w-full"
                      onClick={() => handleSearchRouteClick(row)}
                    >
                      Tìm tuyến xe
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-white bg-orange-400 font-semibold hover:bg-orange-500 transition-colors text-sm w-full"
                      onClick={() => handleViewScheduleClick(row)}
                    >
                      Xem lịch trình
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {records.length === 0 && !isLoading && (
              <div className="text-center py-10 text-gray-500">
                <div className="text-lg">Không tìm thấy tuyến đường nào</div>
                <div className="text-sm mt-2">
                  Vui lòng thử lại với từ khóa khác
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TuyenDuong;
