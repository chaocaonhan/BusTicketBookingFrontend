// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BusSearch from "../components/comon/BusSearch";
import PopularRoutes from "../components/comon/PopularRoutes";
import BusFeatures from "../components/comon/BusFeatures";
import vanChuyenHangHoa from "../assets/vanChuyenHangHoa.png";

const Home = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleSearch = (
    departure,
    destination,
    departureDate,
    returnDate,
    isReturn
  ) => {
    // Đảm bảo isReturn là false nếu không có returnDate
    if (!returnDate || returnDate === "null") {
      isReturn = false;
    }

    console.log("Search triggered with:", {
      departure,
      destination,
      departureDate,
      returnDate,
      isReturn,
    });

    // Tạo query string từ các tham số tìm kiếm
    const queryParams = new URLSearchParams({
      departure,
      destination,
      departureDate,
      returnDate: returnDate, // Đặt null nếu không có returnDate
      isReturn: isReturn ? "true" : "false",
    }).toString();

    // Điều hướng đến BookingPage với query string
    navigate(`/dat-ve?${queryParams}`);
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Phần BusSearch */}
      <div
        className="w-full grid place-items-center"
        style={{
          minHeight: "500px",
          backgroundImage:
            "url('https://cuscoperu.b-cdn.net/wp-content/uploads/2024/08/Carretera.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <BusSearch
          className="p-6 rounded-lg shadow-lg"
          onSearch={handleSearch} // Truyền handleSearch vào BusSearch
        />
      </div>

      {/* Phần PopularRoutes và BusFeatures */}
      <PopularRoutes className="px-3 " />
      <div>
        <img
          src={vanChuyenHangHoa}
          alt="Van Chuyen Hang Hoa"
          className="w-full h-auto object-cover"
        />
      </div>
      {/* Hotline dịch vụ */}
      <section className="max-[80%] mx-auto bg-white rounded-xl shadow-md my-10 px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Cột trái: Ảnh */}
          <div className="flex-1 flex justify-center">
            <img
              loading="lazy"
              decoding="async"
              width="400"
              height="335"
              src="https://xesaoviet.com.vn/wp-content/uploads/2023/12/xe-sao-viet-1900-6746.png"
              alt="Xe Sao Việt"
              className="rounded-lg max-w-full h-auto"
            />
          </div>
          {/* Cột phải: Thông tin hotline */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-orange-500 mb-2">
              Hotline dịch vụ
            </h2>
            <p className="mb-4 text-gray-700">
              Hotline dịch vụ của Sao Việt hoạt động 24/7. Chúng tôi luôn sẵn
              sàng phục vụ khách hàng
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                  {/* SVG icon */}
                  <svg width="28" height="28" viewBox="0 0 384 384" fill="none">
                    <circle cx="192" cy="192" r="192" fill="#f9943b" />
                    <path
                      d="M355.3 292.9c-.1-.1-.2-.2-.3-.2-.4-.4-40.2-40.3-40.7-40.8-.4-.4-.8-.9-1.2-1.3-.4-.4-184.7-184.8-185.1-185.2-4.5-4.3-10.3-7-16.6-7.4-7.7-.5-15.3 2.4-20.7 7.9l-22.8 22.8c-9.8 9.8-33.5 49.9 71.8 155.4.2.2 124.4 124.4 124.6 124.6.1.1.2.2.3.3 37.6-15.5 69.2-42.6 90.4-76.9z"
                      fill="#f48124"
                    />
                    <path
                      d="M325.7 273c-.5-7.7-4.3-14.9-10.4-19.6l-35.7-27.8c-9.8-7.7-23.5-7.7-33.3 0l-7.9 6.3c-6.3 5-15.3 4.5-21-1.2l-63.8-63.9c-5.7-5.7-6.2-14.7-1.2-21l6.3-7.9c7.7-9.8 7.7-23.5 0-33.3l-27.8-35.7c-5.1-6.1-12.2-9.9-19.9-10.4-7.7-.5-15.3 2.4-20.7 7.9l-22.8 22.8c-9.8 9.8-33.5 49.9 71.8 155.4 66.9 67 107.6 81.1 130 81.1 13.3 0 21-4.9 25.1-9l22.8-22.8c5.5-5.5 8.4-13.1 7.9-20.8zm-15.7 12.9l-22.8 22.8c-2.6 2.6-7.7 5.7-17.3 5.7-16.6 0-54.6-10-122.2-77.7-78-78.2-87.5-124.1-71.9-139.7l22.8-22.8c3-3 7.1-4.7 11.3-4.7.3 0 .6 0 .9.1 4.5.3 8.7 2.5 11.5 6.1l27.8 35.7c4.5 5.8 4.5 13.8 0 19.6l-6.3 7.9c-8.5 10.7-7.6 26.1 2.1 35.8l63.8 63.9c9.7 9.7 25.1 10.6 35.8 2.1l7.9-6.3c5.8-4.5 13.8-4.5 19.6 0l35.7 27.8c3.6 2.8 5.8 7 6.1 11.5.3 4.5-1.2 8.7-4.7 11.3z"
                      fill="#f6f6f6"
                    />
                  </svg>
                </span>
                <span className="font-medium text-lg">
                  Hotline đặt vé:{" "}
                  <span className="text-orange-500">1900 6746</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                  <svg width="28" height="28" viewBox="0 0 384 384" fill="none">
                    <circle cx="192" cy="192" r="192" fill="#f9943b" />
                    <path
                      d="M355.3 292.9c-.1-.1-.2-.2-.3-.2-.4-.4-40.2-40.3-40.7-40.8-.4-.4-.8-.9-1.2-1.3-.4-.4-184.7-184.8-185.1-185.2-4.5-4.3-10.3-7-16.6-7.4-7.7-.5-15.3 2.4-20.7 7.9l-22.8 22.8c-9.8 9.8-33.5 49.9 71.8 155.4.2.2 124.4 124.4 124.6 124.6.1.1.2.2.3.3 37.6-15.5 69.2-42.6 90.4-76.9z"
                      fill="#f48124"
                    />
                    <path
                      d="M325.7 273c-.5-7.7-4.3-14.9-10.4-19.6l-35.7-27.8c-9.8-7.7-23.5-7.7-33.3 0l-7.9 6.3c-6.3 5-15.3 4.5-21-1.2l-63.8-63.9c-5.7-5.7-6.2-14.7-1.2-21l6.3-7.9c7.7-9.8 7.7-23.5 0-33.3l-27.8-35.7c-5.1-6.1-12.2-9.9-19.9-10.4-7.7-.5-15.3 2.4-20.7 7.9l-22.8 22.8c-9.8 9.8-33.5 49.9 71.8 155.4 66.9 67 107.6 81.1 130 81.1 13.3 0 21-4.9 25.1-9l22.8-22.8c5.5-5.5 8.4-13.1 7.9-20.8zm-15.7 12.9l-22.8 22.8c-2.6 2.6-7.7 5.7-17.3 5.7-16.6 0-54.6-10-122.2-77.7-78-78.2-87.5-124.1-71.9-139.7l22.8-22.8c3-3 7.1-4.7 11.3-4.7.3 0 .6 0 .9.1 4.5.3 8.7 2.5 11.5 6.1l27.8 35.7c4.5 5.8 4.5 13.8 0 19.6l-6.3 7.9c-8.5 10.7-7.6 26.1 2.1 35.8l63.8 63.9c9.7 9.7 25.1 10.6 35.8 2.1l7.9-6.3c5.8-4.5 13.8-4.5 19.6 0l35.7 27.8c3.6 2.8 5.8 7 6.1 11.5.3 4.5-1.2 8.7-4.7 11.3z"
                      fill="#f6f6f6"
                    />
                  </svg>
                </span>
                <span className="font-medium text-lg">
                  Hotline gửi hàng:{" "}
                  <span className="text-orange-500">1900 0257</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                  <svg width="28" height="28" viewBox="0 0 384 384" fill="none">
                    <circle cx="192" cy="192" r="192" fill="#f9943b" />
                    <path
                      d="M355.3 292.9c-.1-.1-.2-.2-.3-.2-.4-.4-40.2-40.3-40.7-40.8-.4-.4-.8-.9-1.2-1.3-.4-.4-184.7-184.8-185.1-185.2-4.5-4.3-10.3-7-16.6-7.4-7.7-.5-15.3 2.4-20.7 7.9l-22.8 22.8c-9.8 9.8-33.5 49.9 71.8 155.4.2.2 124.4 124.4 124.6 124.6.1.1.2.2.3.3 37.6-15.5 69.2-42.6 90.4-76.9z"
                      fill="#f48124"
                    />
                    <path
                      d="M325.7 273c-.5-7.7-4.3-14.9-10.4-19.6l-35.7-27.8c-9.8-7.7-23.5-7.7-33.3 0l-7.9 6.3c-6.3 5-15.3 4.5-21-1.2l-63.8-63.9c-5.7-5.7-6.2-14.7-1.2-21l6.3-7.9c7.7-9.8 7.7-23.5 0-33.3l-27.8-35.7c-5.1-6.1-12.2-9.9-19.9-10.4-7.7-.5-15.3 2.4-20.7 7.9l-22.8 22.8c-9.8 9.8-33.5 49.9 71.8 155.4 66.9 67 107.6 81.1 130 81.1 13.3 0 21-4.9 25.1-9l22.8-22.8c5.5-5.5 8.4-13.1 7.9-20.8zm-15.7 12.9l-22.8 22.8c-2.6 2.6-7.7 5.7-17.3 5.7-16.6 0-54.6-10-122.2-77.7-78-78.2-87.5-124.1-71.9-139.7l22.8-22.8c3-3 7.1-4.7 11.3-4.7.3 0 .6 0 .9.1 4.5.3 8.7 2.5 11.5 6.1l27.8 35.7c4.5 5.8 4.5 13.8 0 19.6l-6.3 7.9c-8.5 10.7-7.6 26.1 2.1 35.8l63.8 63.9c9.7 9.7 25.1 10.6 35.8 2.1l7.9-6.3c5.8-4.5 13.8-4.5 19.6 0l35.7 27.8c3.6 2.8 5.8 7 6.1 11.5.3 4.5-1.2 8.7-4.7 11.3z"
                      fill="#f6f6f6"
                    />
                  </svg>
                </span>
                <span className="font-medium text-lg">
                  Chăm sóc khách hàng:{" "}
                  <span className="text-orange-500">1900 6746</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                  <svg width="28" height="28" viewBox="0 0 384 384" fill="none">
                    <circle cx="192" cy="192" r="192" fill="#f9943b" />
                    <path
                      d="M355.3 292.9c-.1-.1-.2-.2-.3-.2-.4-.4-40.2-40.3-40.7-40.8-.4-.4-.8-.9-1.2-1.3-.4-.4-184.7-184.8-185.1-185.2-4.5-4.3-10.3-7-16.6-7.4-7.7-.5-15.3 2.4-20.7 7.9l-22.8 22.8c-9.8 9.8-33.5 49.9 71.8 155.4.2.2 124.4 124.4 124.6 124.6.1.1.2.2.3.3 37.6-15.5 69.2-42.6 90.4-76.9z"
                      fill="#f48124"
                    />
                    <path
                      d="M325.7 273c-.5-7.7-4.3-14.9-10.4-19.6l-35.7-27.8c-9.8-7.7-23.5-7.7-33.3 0l-7.9 6.3c-6.3 5-15.3 4.5-21-1.2l-63.8-63.9c-5.7-5.7-6.2-14.7-1.2-21l6.3-7.9c7.7-9.8 7.7-23.5 0-33.3l-27.8-35.7c-5.1-6.1-12.2-9.9-19.9-10.4-7.7-.5-15.3 2.4-20.7 7.9l-22.8 22.8c-9.8 9.8-33.5 49.9 71.8 155.4 66.9 67 107.6 81.1 130 81.1 13.3 0 21-4.9 25.1-9l22.8-22.8c5.5-5.5 8.4-13.1 7.9-20.8zm-15.7 12.9l-22.8 22.8c-2.6 2.6-7.7 5.7-17.3 5.7-16.6 0-54.6-10-122.2-77.7-78-78.2-87.5-124.1-71.9-139.7l22.8-22.8c3-3 7.1-4.7 11.3-4.7.3 0 .6 0 .9.1 4.5.3 8.7 2.5 11.5 6.1l27.8 35.7c4.5 5.8 4.5 13.8 0 19.6l-6.3 7.9c-8.5 10.7-7.6 26.1 2.1 35.8l63.8 63.9c9.7 9.7 25.1 10.6 35.8 2.1l7.9-6.3c5.8-4.5 13.8-4.5 19.6 0l35.7 27.8c3.6 2.8 5.8 7 6.1 11.5.3 4.5-1.2 8.7-4.7 11.3z"
                      fill="#f6f6f6"
                    />
                  </svg>
                </span>
                <span className="font-medium text-lg">
                  Xử lý khiếu nại:{" "}
                  <span className="text-orange-500">02439 937 099</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <BusFeatures />
    </div>
  );
};

export default Home;
