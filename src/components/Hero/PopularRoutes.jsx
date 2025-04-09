import React from "react";

// Component Card đơn giản (tự định nghĩa vì bạn chưa cài @/components/ui/card)
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const PopularRoutes = () => {
  // Dữ liệu giả lập cho các tuyến đường
  const routes = [
    {
      from: "Hà Nội",
      to: "Sài Gòn",
      price: "800,000đ",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
    },
    {
      from: "Hà Nội",
      to: "Đà Nẵng",
      price: "550,000đ",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
    },
    {
      from: "Sài Gòn",
      to: "Nha Trang",
      price: "350,000đ",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
    },
    {
      from: "Sài Gòn",
      to: "Đà Lạt",
      price: "250,000đ",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
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
          {routes.map((route, index) => (
            <Card key={index} className="relative">
              {/* Hình ảnh tuyến đường */}
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${route.image})` }}
              >
                <div className="absolute top-2 left-2 bg-white text-gray-800 text-sm font-semibold px-2 py-1 rounded">
                  Chỉ từ {route.price}
                </div>
              </div>

              {/* Thông tin tuyến đường */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-semibold">{route.from}</span>
                    <span className="mx-2">→</span>
                    <span className="font-semibold">{route.to}</span>
                  </div>
                  <div className="text-gray-500">
                    <svg
                      className="w-5 h-5 inline-block"
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
                  </div>
                </div>
                {/* Nút Xem lịch trình */}
                <button className="mt-4 w-full bg-blue-50 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-100 transition">
                  Xem lịch trình →
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
