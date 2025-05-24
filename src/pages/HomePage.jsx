import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BusSearch from "../components/comon/BusSearch";
import PopularRoutes from "../components/comon/PopularRoutes";
import BusFeatures from "../components/comon/BusFeatures";
import vanChuyenHangHoa from "../assets/vanChuyenHangHoa.png";
import { PhoneCall, BusFront, Bus, TramFront } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/danhGia");
        const data = await response.json();
        if (data.code === 200) {
          setRatings(data.result);
        }
      } catch (err) {
        setRatings([]);
      } finally {
        setLoadingRatings(false);
      }
    };
    fetchRatings();
  }, []);

  const renderStars = (rating) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );

  const handleSearch = (
    departure,
    destination,
    departureDate,
    returnDate,
    isReturn,
    from,
    to
  ) => {
    if (!returnDate || returnDate === "null") {
      isReturn = false;
    }

    console.log("Search triggered with:", {
      departure,
      destination,
      departureDate,
      returnDate,
      isReturn,
      from,
      to,
    });

    const queryParams = new URLSearchParams({
      departure,
      destination,
      departureDate,
      returnDate: returnDate || "",
      isReturn: isReturn ? "true" : "false",
      from, // ID của điểm đi
      to, // ID của điểm đến
    }).toString();

    navigate(`/dat-ve?${queryParams}`);
  };

  return (
    <div className="relative w-full min-h-screen">
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
          onSearch={handleSearch}
        />
      </div>

      <PopularRoutes className="px-3 " />

      <section className="max-[80%] mx-auto bg-white rounded-xl my-10 px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
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
                <span className="inline-flex items-center justify-center w-10 h-10 text-white bg-orange-400 rounded-full">
                  <PhoneCall />
                </span>
                <span className="font-medium text-lg">
                  Hotline đặt vé:{" "}
                  <span className="text-orange-500">1900 1212</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 text-white bg-orange-400 rounded-full">
                  <PhoneCall />
                </span>
                <span className="font-medium text-lg">
                  Xử lý khiếu nại:{" "}
                  <span className="text-orange-500">1900 1234</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-[90%] mx-auto bg-amber-50 rounded-xl shadow-md my-10 px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-1/2 text-2xl">
            <div className="pl-[200px]">
              <h2 className="text-2xl font-bold text-orange-500 mb-2">
                Đa dạng loại xe
              </h2>
              <p className="mb-4 text-gray-700">
                Cung cấp nhiều hạng xe với mức giá ưu đãi
              </p>
              <ul className="space-y-3 text-3xl">
                <li className="flex min-w-80 items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 text-white bg-orange-400 rounded-full">
                    <BusFront />
                  </span>
                  <span className="text-orange-500 text-lg">
                    Economy 34 ghế
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 text-white bg-orange-400 rounded-full">
                    <Bus />
                  </span>
                  <span className="font-medium text-orange-500 text-lg">
                    Vip 34 ghế
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 text-white bg-orange-400 rounded-full">
                    <TramFront />
                  </span>
                  <span className="font-medium text-orange-500 text-lg">
                    Royal 24 cabin
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-orange-500 mb-3">
              Trải nghiệm từ khách hàng?
            </h3>
            {loadingRatings ? (
              <div className="text-gray-400">Đang tải đánh giá...</div>
            ) : ratings.filter((r) => r.soSao === 5).length === 0 ? (
              <div className="text-gray-400">Chưa có đánh giá 5 sao</div>
            ) : (
              <div
                className="w-full space-y-4 max-h-96 overflow-y-auto pr-2"
                style={{ minWidth: 320 }}
              >
                {ratings
                  .filter((rating) => rating.soSao === 5)
                  .map((rating) => (
                    <div
                      key={rating.id}
                      className="bg-gray-50 rounded-lg p-4 shadow flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={rating.anhNguoiDung}
                          alt={rating.tenKhachHang}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">
                            {rating.tenKhachHang}
                          </div>
                          <div className="text-sm text-gray-500">
                            {rating.tenChuyenXe}
                          </div>
                        </div>
                      </div>
                      <div>{renderStars(rating.soSao)}</div>
                      <div className="text-gray-700 text-sm italic">
                        "{rating.noiDung || "Không có nội dung"}"
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <BusFeatures />
    </div>
  );
};

export default Home;
