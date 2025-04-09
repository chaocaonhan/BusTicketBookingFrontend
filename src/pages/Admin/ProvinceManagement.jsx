import { useEffect, useState } from "react";

const ProvinceManagement = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // lưu vị trí và ID tỉnh bị click chuột phải

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/tinhthanh", {
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

  const handleRightClick = (e, provinceId) => {
    e.preventDefault(); // ngăn menu mặc định của trình duyệt
    e.stopPropagation(); // ngăn click ra ngoài

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      provinceId,
    });
  };

  const handleDelete = async (provinceId) => {
    console.log("Xoá tỉnh có ID:", provinceId);
    // TODO: gọi API xoá ở đây nếu cần
    setContextMenu(null);
  };

  const handleClickOutside = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    fetchProvinces();
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 mt-16 relative min-h-screen">
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
              onContextMenu={(e) => handleRightClick(e, province.id)}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
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
        </div>
      )}

      {/* Menu Xoá */}
      {contextMenu && (
        <div
          className="absolute bg-white border border-gray-300 rounded shadow-md z-50"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            width: 120,
          }}
        >
          <button
            onClick={() => handleDelete(contextMenu.provinceId)}
            className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
          >
            Xoá
          </button>
        </div>
      )}
    </div>
  );
};

export default ProvinceManagement;
