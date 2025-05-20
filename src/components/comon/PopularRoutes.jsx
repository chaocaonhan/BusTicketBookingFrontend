import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pickup from "../../assets/pickup.svg";
import station from "../../assets/station.svg";
import arrow from "../../assets/arrow.png";

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const PopularRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/tuyen-xe/top5-popular"
        );
        const data = await response.json();
        if (data.code === 200) {
          setRoutes(data.result);
        }
      } catch (error) {
        console.error("Error fetching popular routes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRoutes();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleBooking = (route) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const queryParams = new URLSearchParams();
    queryParams.append("departure", route.tinhDi.tenTinhThanh);
    queryParams.append("destination", route.tinhDen.tenTinhThanh);
    queryParams.append("departureDate", formatDate(today));
    queryParams.append("returnDate", "");
    queryParams.append("isReturn", "false");

    navigate(`/dat-ve?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <section className="py-12 px-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Tuyến đường phổ biến
            </h2>
            <p className="text-gray-500 mt-2">Đang tải dữ liệu...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full mx-auto p-4 px-14 bg-amber-50">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Tuyến đường phổ biến
        </h2>
        <p className="text-gray-500 mt-2">
          Nhiều tuyến đường được khách hàng tin tưởng và lựa chọn nhiều nhất
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            {/* Image */}
            <div className="relative h-48 w-full">
              <img
                src={route.tinhDen.anh1 || "/placeholder.svg"}
                alt={`${route.tinhDi.tenTinhThanh} to ${route.tinhDen.tenTinhThanh}`}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>

            {/* Route Information */}
            <div>
              <div className="flex w-full border-b border-dashed border-orange-200 p-2">
                {/* hiển thị điểm đi điểm đến */}
                <div class=" w-1/2 p-2 border-r border-dashed border-orange-500">
                  <div className="flex flex-col">
                    <div class="flex-1 ">
                      <div className="flex flex-row items-center">
                        <div class="w-1/3 ">
                          <img src={pickup} alt="station" className="w-5 h-5" />
                        </div>
                        <div class="w-2/3  ">{route.tinhDi.tenTinhThanh}</div>
                      </div>
                    </div>

                    <div class="flex-1 ">
                      <div className="flex flex-row items-center">
                        <div class="w-1/3 ">
                          <img src={arrow} alt="station" className="w-5 h-5" />
                        </div>
                        <div class="w-2/3  "></div>
                      </div>
                    </div>

                    <div class="flex-1 ">
                      <div className="flex flex-row items-center">
                        <div class="w-1/3  ">
                          <img
                            src={station}
                            alt="station"
                            className="w-5 h-5"
                          />
                        </div>
                        <div class="w-2/3">{route.tinhDen.tenTinhThanh}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* hiển thị giá */}
                <div class=" w-1/2 pl-2 my-auto">
                  <p className="w-full font-bold text-orange-400">
                    Từ{" "}
                    {(Number(route.khoangCach) * 1000).toLocaleString("vi-VN")}{" "}
                    đ
                  </p>
                </div>
              </div>

              {/* tgian + khoảng cách*/}
              <div className="pt-2 flex flex-row">
                <div className="flex w-2/3 justify-between pl-4 text-sl text-gray-600 ">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span>Thời gian: {route.thoiGianDiChuyen}</span>
                    </div>
                    <div className="flex items-center">
                      <span>Khoảng cách: {route.khoangCach}km</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(route)}
                  className=" flex w-1/3 bg-orange-300 ml-auto self-end h-full hover:bg-orange-400 text-center py-2 px-4  transition-colors"
                >
                  Đặt vé
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularRoutes;
