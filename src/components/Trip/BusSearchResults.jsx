import { useState } from "react";
import { Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function BusBookingInterface() {
  const [expandedBus, setExpandedBus] = useState(null);
  const [selectedTab, setSelectedTab] = useState("seats");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const busOptions = [
    {
      id: 1,
      type: "ROYAL 24 CABIN",
      price: 330000,
      departureTime: "05:45",
      arrivalTime: "10:15",
      duration: "4h30p",
      departureStation: "Trung chuyển: Bến xe Mỹ Đình, Hà Nội",
      midStation: "Buýt Đầu, Kim Chung, Hà Nội",
      arrivalStation: "BXTT Lào Cai",
      availableSeats: 18,
      date: "20/04",
      amenities: ["bed", "wifi", "charging", "snacks", "toilet", "tv"],
      company: "",
    },
    {
      id: 2,
      type: "ECONOMY 34 CHỖ",
      price: 260000,
      departureTime: "05:50",
      arrivalTime: "10:30",
      duration: "4h40p",
      departureStation: "Trung chuyển: Bến xe Mỹ Đình, Hà Nội",
      midStation: "Buýt Đầu, Kim Chung, Hà Nội",
      arrivalStation: "BXTT Lào Cai",
      availableSeats: 14,
      date: "20/04",
      amenities: ["bed", "wifi", "charging", "snacks", "toilet", "tv"],
      company: "FUTA HÀ SƠN",
    },
    {
      id: 3,
      type: "ECONOMY 34 CHỖ",
      price: 260000,
      departureTime: "06:00",
      arrivalTime: "11:00",
      duration: "5h0p",
      departureStation: "Bến xe Mỹ Đình, Hà Nội",
      midStation: "Bến xe Mỹ Đình, Hà Nội",
      arrivalStation: "BXTT Lào Cai",
      availableSeats: 22,
      date: "20/04",
      amenities: ["bed", "wifi", "charging", "snacks", "toilet", "tv"],
      company: "FUTA HÀ SƠN",
    },
  ];

  const route = [
    {
      time: "19:35",
      location: "Bến xe Giáp Bát, Hà Nội",
      address: "BX Giáp Bát, đường Giải Phóng, P.Hoàng Liệt, Q.Hoàng Mai",
    },
    {
      time: "20:30",
      location: "Buyt Đầu, Kim Chung, Hà Nội",
      address: "Buýt Đầu, Kim Chung, Hà Nội",
    },
    {
      time: "20:40",
      location: "VP Kim Anh Nội Bài, Hà Nội",
      address:
        "Ngã 3 kim anh, 30 Thạch Lỗi, Thanh Xuân, Sóc Sơn, Hanoi, Vietnam",
    },
    {
      time: "21:00",
      location: "Km 14 Bình Xuyên, Vĩnh Phúc",
      address: "IC 3 Bình Xuyên, Vĩnh Phúc",
    },
    {
      time: "21:10",
      location: "Km 25 Tam Đảo, Vĩnh Phúc",
      address: "IC 4 Vĩnh Phúc",
    },
    {
      time: "21:50",
      location: "Km 40 Vân Quán, Vĩnh Phúc",
      address: "IC 6 Vân Quán, Vĩnh Phúc",
    },
    {
      time: "22:00",
      location: "KM 49 Việt Trì, Phú Thọ",
      address: "KM 49 Việt Trì, Phú Thọ",
    },
    {
      time: "22:05",
      location: "Km 55 Phù Ninh, Phú Thọ",
      address: "IC8 Phù Ninh, Phú Thọ",
    },
  ];

  const handleSeatSelection = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatStatus = (seatId) => {
    const takenSeats = ["C1-2", "A1-2", "A2-5"];
    if (takenSeats.includes(seatId)) return "taken";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  const renderAmenities = (amenities) => {
    return (
      <div className="flex space-x-2">
        {amenities.map((amenity, index) => (
          <div key={index} className="text-gray-600">
            {amenity === "bed" && (
              <span className="inline-block w-5 h-5">🛏️</span>
            )}
            {amenity === "wifi" && (
              <span className="inline-block w-5 h-5">📶</span>
            )}
            {amenity === "charging" && (
              <span className="inline-block w-5 h-5">🔌</span>
            )}
            {amenity === "snacks" && (
              <span className="inline-block w-5 h-5">🍪</span>
            )}
            {amenity === "toilet" && (
              <span className="inline-block w-5 h-5">🚽</span>
            )}
            {amenity === "tv" && (
              <span className="inline-block w-5 h-5">📺</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSeats = () => {
    const floor1Seats = [
      ["C1-1", "B1-1", "A1-1"],
      ["C1-2", "B1-2", "A1-2"],
      ["C1-3", "B1-3", "A1-3"],
      ["C1-4", "B1-4", "A1-4"],
      ["C1-5", "B1-5", "A1-5"],
      ["C1-6", "B1-6", "A1-6"],
    ];

    const floor2Seats = [
      ["C2-1", "B2-1", "A2-1"],
      ["C2-2", "B2-2", "A2-2"],
      ["C2-3", "B2-3", "A2-3"],
      ["C2-4", "B2-4", "A2-4"],
      ["C2-5", "B2-5", "A2-5"],
      ["C2-6", "B2-6", "A2-6"],
    ];

    return (
      <div className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Tầng 1</h3>
            <div className="border rounded-lg p-4">
              <div className="flex justify-start mb-4">
                <div className="p-2 rounded-full bg-gray-200">
                  <span className="inline-block w-6 h-6">🚗</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {floor1Seats.map((row, rowIndex) =>
                  row.map((seat, colIndex) => {
                    const status = getSeatStatus(seat);
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`p-2 border rounded text-sm ${
                          status === "taken"
                            ? "bg-gray-400 cursor-not-allowed"
                            : status === "selected"
                            ? "bg-orange-500 text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          status !== "taken" && handleSeatSelection(seat)
                        }
                        disabled={status === "taken"}
                      >
                        {seat}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Tầng 2</h3>
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-3 gap-2">
                {floor2Seats.map((row, rowIndex) =>
                  row.map((seat, colIndex) => {
                    const status = getSeatStatus(seat);
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`p-2 border rounded text-sm ${
                          status === "taken"
                            ? "bg-gray-400 cursor-not-allowed"
                            : status === "selected"
                            ? "bg-orange-500 text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          status !== "taken" && handleSeatSelection(seat)
                        }
                        disabled={status === "taken"}
                      >
                        {seat}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4 space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border rounded"></div>
            <span className="text-sm">Ghế trống</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm">Đang chọn</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm">Đã đặt</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="ml-2 text-sm">
              Tôi đồng ý với điều khoản của Futa Hà Sơn
            </label>
          </div>
          <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
            Xác nhận
          </Button>
        </div>
      </div>
    );
  };

  const renderRoute = () => {
    return (
      <div className="pt-4">
        <div className="relative">
          {route.map((stop, index) => (
            <div key={index} className="flex mb-4">
              <div className="relative flex flex-col items-center mr-4">
                <div className="w-4 h-4 bg-orange-500 rounded-full z-10"></div>
                {index < route.length - 1 && (
                  <div className="h-full w-0.5 bg-gray-300 absolute top-4"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold">
                  {stop.time} • {stop.location}
                </div>
                <div className="text-sm text-gray-600">{stop.address}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      {/* Left Column: Search Filters */}
      <div className="w-1/4 p-4 bg-white">
        <div className="bg-white p-4 rounded-lg border mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-medium">Hà Nội - Lào Cai</h2>
            <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm">
              Thay đổi
            </button>
          </div>
          <div className="text-sm text-gray-600 mb-4">20/04/2025</div>
          <button className="w-full bg-orange-500 text-white py-2 rounded text-sm">
            Thêm lộ trình
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Lọc kết quả</h3>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Giờ xuất bến</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all-time"
                  name="departure-time"
                  className="mr-2"
                  checked
                />
                <label htmlFor="all-time" className="text-sm">
                  Tất cả
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="early-morning"
                  name="departure-time"
                  className="mr-2"
                />
                <label htmlFor="early-morning" className="text-sm">
                  Sớm nhất - muộn nhất
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="late-morning"
                  name="departure-time"
                  className="mr-2"
                />
                <label htmlFor="late-morning" className="text-sm">
                  Muộn nhất - sớm nhất
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Giá vé</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all-price"
                  name="price"
                  className="mr-2"
                  checked
                />
                <label htmlFor="all-price" className="text-sm">
                  Tất cả
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="price-up"
                  name="price"
                  className="mr-2"
                />
                <label htmlFor="price-up" className="text-sm">
                  Tăng dần
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="price-down"
                  name="price"
                  className="mr-2"
                />
                <label htmlFor="price-down" className="text-sm">
                  Giảm dần
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Ưu đãi</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all-promo"
                  name="promo"
                  className="mr-2"
                  checked
                />
                <label htmlFor="all-promo" className="text-sm">
                  Tất cả
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="has-promo"
                  name="promo"
                  className="mr-2"
                />
                <label htmlFor="has-promo" className="text-sm">
                  Có ưu đãi
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="no-promo"
                  name="promo"
                  className="mr-2"
                />
                <label htmlFor="no-promo" className="text-sm">
                  Không có ưu đãi
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Hạng xe</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all-class"
                  name="class"
                  className="mr-2"
                  checked
                />
                <label htmlFor="all-class" className="text-sm">
                  Tất cả
                </label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="royal" name="class" className="mr-2" />
                <label htmlFor="royal" className="text-sm">
                  Royal
                </label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="vip" name="class" className="mr-2" />
                <label htmlFor="vip" className="text-sm">
                  VIP
                </label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="eco" name="class" className="mr-2" />
                <label htmlFor="eco" className="text-sm">
                  ECO
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Giờ chạy</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all-hours"
                  name="hours"
                  className="mr-2"
                  checked
                />
                <label htmlFor="all-hours" className="text-sm">
                  Tất cả
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="morning-hours"
                  name="hours"
                  className="mr-2"
                />
                <label htmlFor="morning-hours" className="text-sm">
                  00:00 - 12:00
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="afternoon-hours"
                  name="hours"
                  className="mr-2"
                />
                <label htmlFor="afternoon-hours" className="text-sm">
                  12:00 - 18:00
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="evening-hours"
                  name="hours"
                  className="mr-2"
                />
                <label htmlFor="evening-hours" className="text-sm">
                  18:00 - 24:00
                </label>
              </div>
            </div>
          </div>

          <button className="w-full bg-orange-500 text-white py-2 rounded">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Middle Column: Bus Results */}
      <div className="w-full md:w-1/2 p-4 bg-gray-50 overflow-y-auto">
        {busOptions.map((bus) => (
          <div key={bus.id} className="bg-white rounded-lg mb-4 shadow border">
            <div className="p-4">
              {/* Bus Header */}
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    bus.type.includes("ROYAL")
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {bus.type}
                </span>
                <div className="flex flex-col items-end gap-1">
                  {bus.company && (
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 text-xs rounded">
                      {bus.company}
                    </span>
                  )}
                  <span className="text-gray-800 font-semibold">
                    Từ {bus.price.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>

              {/* Bus Route Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="font-bold text-lg">{bus.departureTime}</div>
                  <div className="text-xs text-gray-600">
                    {bus.departureStation}
                  </div>
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className="text-xs text-gray-600">{bus.duration}</span>
                  <div className="w-20 h-0.5 bg-gray-300 relative my-1">
                    <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-black"></div>
                    <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-black"></div>
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <div className="font-bold text-lg">{bus.arrivalTime}</div>
                  <div className="text-xs text-gray-600">
                    {bus.arrivalStation}
                  </div>
                </div>
              </div>

              {/* Amenities and Seats */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm font-medium mb-2">Tiện ích</div>
                  {renderAmenities(bus.amenities)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-1">🚌</span>
                  <span>{bus.availableSeats} chỗ trống</span>
                </div>
              </div>

              {/* Departure Info and Button */}
              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs text-gray-600">
                  <Clock size={12} className="mr-1" />
                  <span>
                    Khởi hành {bus.departureTime} ({bus.date})
                    {bus.id === 2 && <span className="ml-1">tới Bắc Ninh</span>}
                  </span>
                </div>
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                  onClick={() => {
                    setExpandedBus(expandedBus === bus.id ? null : bus.id);
                    setSelectedTab("seats");
                  }}
                >
                  Chọn chỗ
                </button>
              </div>
            </div>

            {/* Expanded Section */}
            {expandedBus === bus.id && (
              <div className="border-t">
                <Tabs
                  defaultValue="seats"
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                >
                  <TabsList className="w-full rounded-none bg-white border-b flex">
                    <TabsTrigger
                      value="seats"
                      className="flex-1 py-2 text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      Chọn chỗ
                    </TabsTrigger>
                    <TabsTrigger
                      value="route"
                      className="flex-1 py-2 text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      Lộ trình
                    </TabsTrigger>
                    <TabsTrigger
                      value="bus-info"
                      className="flex-1 py-2 text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      Thông tin xe
                    </TabsTrigger>
                  </TabsList>
                  <div className="p-4">
                    <TabsContent value="seats">{renderSeats()}</TabsContent>
                    <TabsContent value="route">{renderRoute()}</TabsContent>
                    <TabsContent value="bus-info">
                      <div className="py-4">
                        <h3 className="font-medium text-lg mb-2">
                          Thông tin xe
                        </h3>
                        <p className="text-gray-600">
                          {bus.type} - {bus.availableSeats} chỗ
                        </p>
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Tiện ích</h4>
                          {renderAmenities(bus.amenities)}
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right Column: Cart Summary */}
      <div className="w-1/4 p-4">
        <div className="bg-white rounded-lg shadow border p-4 sticky top-4">
          <h3 className="font-medium border-b pb-2 mb-4">CHỖ ĐÃ CHỌN</h3>

          <div className="min-h-32">
            {/* Selected seats will be displayed here */}
            {selectedSeats.length === 0 && (
              <div className="text-gray-500 text-sm text-center my-8">
                Chưa có chỗ nào được chọn
              </div>
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="font-medium">Tổng cộng</div>
              <div className="font-bold">0 đ</div>
            </div>
            <button className="w-full bg-orange-500 text-white py-3 rounded">
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
