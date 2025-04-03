import { useState, useEffect } from "react";

export default function BusSearch() {
  const [locations, setLocations] = useState([]);
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Khai báo một biến để kiểm soát việc hủy request khi component unmount
    const abortController = new AbortController();

    const fetchLocations = async () => {
      try {
        setIsLoading(true);

        // Thêm signal để có thể hủy fetch khi cần
        const response = await fetch("http://localhost:8081/api/tinhthanh", {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`API response không OK: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dữ liệu API đã nhận:", data);

        // Kiểm tra cấu trúc dữ liệu
        if (data && data.code === 0 && Array.isArray(data.result)) {
          console.log(
            "Đang cập nhật locations với",
            data.result.length,
            "tỉnh thành"
          );
          setLocations(data.result);
        } else {
          console.error("Dữ liệu không đúng định dạng mong đợi:", data);
          setError("Định dạng dữ liệu không đúng");
        }
      } catch (err) {
        // Bỏ qua lỗi nếu request bị hủy
        if (err.name !== "AbortError") {
          console.error("Lỗi khi tải dữ liệu:", err);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();

    // Cleanup function - hủy request khi component unmount
    return () => abortController.abort();
  }, []);

  // Force re-render function (chỉ dùng trong trường hợp khẩn cấp)
  const forceLocationsRender = () => {
    console.log("Force re-render với locations:", locations);
    setLocations([...locations]);
  };

  const handleSearch = () => {
    console.log(
      "Tìm kiếm chuyến xe từ",
      departure,
      "đến",
      destination,
      "vào ngày",
      date
    );
    // Thực hiện tìm kiếm tại đây
  };

  // Get today's date for the date input min value
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col justify-center items-center mt-40 md:flex-row gap-4 p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto">
      {/* Dropdown Điểm Đi */}
      <div className="w-full md:w-auto">
        <label
          htmlFor="departure"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Điểm đi
        </label>
        <select
          id="departure"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Chọn điểm đi</option>
          {locations && locations.length > 0 ? (
            locations.map((loc) => (
              <option key={`dep-${loc.id}`} value={loc.tenTinhThanh}>
                {loc.tenTinhThanh}
              </option>
            ))
          ) : (
            <option value="" disabled>
              {isLoading
                ? "Đang tải..."
                : error
                ? `Lỗi: ${error}`
                : "Không có dữ liệu"}
            </option>
          )}
        </select>
      </div>

      {/* Dropdown Điểm Đến */}
      <div className="w-full md:w-auto">
        <label
          htmlFor="destination"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Điểm đến
        </label>
        <select
          id="destination"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Chọn điểm đến</option>
          {locations && locations.length > 0 ? (
            locations.map((loc) => (
              <option key={`dest-${loc.id}`} value={loc.tenTinhThanh}>
                {loc.tenTinhThanh}
              </option>
            ))
          ) : (
            <option value="" disabled>
              {isLoading
                ? "Đang tải..."
                : error
                ? `Lỗi: ${error}`
                : "Không có dữ liệu"}
            </option>
          )}
        </select>
      </div>

      {/* Chọn ngày */}
      <div className="w-full md:w-auto">
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Ngày đi
        </label>
        <input
          id="date"
          type="date"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={isLoading}
          min={today}
        />
      </div>

      {/* Nút Tìm Kiếm */}
      <div className="w-full md:w-auto mt-4 md:mt-6">
        <button
          className="w-full bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors"
          onClick={handleSearch}
          disabled={isLoading || !departure || !destination || !date}
        >
          {isLoading ? "Đang tải..." : "Tìm kiếm"}
        </button>
      </div>

      {/* Debug thông tin - Chỉ hiển thị trong development */}
      {process.env.NODE_ENV !== "production" && (
        <div className="mt-4 w-full">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer">Debug Info</summary>
            <div className="p-2 bg-gray-100 rounded mt-1">
              <p>Loading: {isLoading ? "True" : "False"}</p>
              <p>Error: {error || "None"}</p>
              <p>Locations count: {locations?.length || 0}</p>
              <button
                onClick={forceLocationsRender}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs mt-1"
              >
                Force Re-render
              </button>
              <details>
                <summary>Locations Data</summary>
                <pre className="bg-gray-800 text-white p-2 rounded mt-1 overflow-auto max-h-40">
                  {JSON.stringify(locations, null, 2)}
                </pre>
              </details>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
