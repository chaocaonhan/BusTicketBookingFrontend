import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    <section className="py-12 px-10 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Tiêu đề và mô tả */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Tuyến đường phổ biến
          </h2>
          <p className="text-gray-500 mt-2">
            Nhiều tuyến đường được khách hàng tin tưởng và lựa chọn nhiều nhất
          </p>
        </div>

        {/* Danh sách tuyến đường */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route) => (
            <Card key={route.id} className="relative">
              {/* Hình ảnh tuyến đường */}
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${route.tinhDen.anh1})` }}
              >
                <div className="absolute top-2 left-2 bg-white text-gray-800 text-sm font-semibold px-2 py-1 rounded">
                  {route.khoangCach}km - {route.thoiGianDiChuyen}
                </div>
              </div>

              {/* Thông tin tuyến đường */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="font-semibold">
                      {route.tinhDi.tenTinhThanh}
                    </span>
                    <span className="mx-2">→</span>
                    <span className="font-semibold">
                      {route.tinhDen.tenTinhThanh}
                    </span>
                  </div>
                </div>
                {/* Nút Đặt vé */}
                <button
                  onClick={() => handleBooking(route)}
                  className="w-full bg-orange-300 text-white font-semibold py-2 rounded-lg hover:bg-orange-400 transition"
                >
                  Đặt vé ngay →
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;
