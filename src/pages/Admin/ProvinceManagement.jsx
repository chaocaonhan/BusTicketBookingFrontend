import { useEffect, useState } from "react";

const ProvinceManagement = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/tinh-thanh", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách tỉnh thành");
      }

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

  useEffect(() => {
    fetchProvinces();
  }, []);

  return (
    <div className="p-6 mt-16">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Danh sách tỉnh thành
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {provinces.map((province) => (
            <div
              key={province.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={`https://source.unsplash.com/random/400x200/?city,${province.tenTinhThanh}`}
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
        </div>
      )}
    </div>
  );
};

export default ProvinceManagement;
