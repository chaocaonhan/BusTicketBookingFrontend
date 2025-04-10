import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProvinceManagement = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [pickupPoints, setPickupPoints] = useState([]);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/tinhthanh", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.code === 200) {
        setProvinces(data.result);
      } else {
        throw new Error(data.message || "Lỗi khi lấy tỉnh thành");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPickupPoints = async (provinceName) => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/Station/getByProvince",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: new URLSearchParams({ province: provinceName }),
        }
      );

      const data = await response.json();
      if (data.code === 200) {
        setPickupPoints(data.result);
      } else {
        throw new Error(data.message || "Không thể lấy điểm đón");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProvinceClick = async (province) => {
    setSelectedProvince(province);
    await fetchPickupPoints(province.tenTinhThanh);
  };

  const handleBack = () => {
    setSelectedProvince(null);
    setPickupPoints([]);
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  return (
    <div className="p-6 mt-16 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {selectedProvince
          ? `Danh sách điểm đón tại ${selectedProvince.tenTinhThanh}`
          : "Danh sách tỉnh thành"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <>
          <AnimatePresence>
            {!selectedProvince && (
              <motion.div
                key="provinces"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {provinces.map((province) => (
                  <div
                    key={province.id}
                    className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleProvinceClick(province)}
                  >
                    <img
                      src={`https://picsum.photos/400/200?random=${province.id}`}
                      alt={province.tenTinhThanh}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {province.tenTinhThanh}
                      </h2>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedProvince && (
              <motion.div
                key="pickupPoints"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <button
                  onClick={handleBack}
                  className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                >
                  ← Quay lại
                </button>

                {pickupPoints.length > 0 ? (
                  pickupPoints.map((point) => (
                    <div
                      key={point.id}
                      className="bg-white shadow rounded-lg p-4 border border-gray-200"
                    >
                      <h3 className="text-lg font-bold text-gray-800">
                        {point.tenDiemDon}
                      </h3>
                      <p className="text-gray-600">{point.diaChi}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Không có điểm đón nào.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default ProvinceManagement;
