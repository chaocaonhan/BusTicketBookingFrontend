import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import defaultProvinceImage from "../../assets/defaultProvinImg.jpg";

const ProvinceManagement = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProvinceName, setNewProvinceName] = useState("");

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
        `http://localhost:8081/api/Station/getByProvince?province=${encodeURIComponent(
          provinceName
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const onUpload = async () => {
    if (!file || !selectedProvinceId) return;
    try {
      const form = new FormData();
      form.append("id", selectedProvinceId);
      form.append("file", file);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8081/api/tinhthanh/themAnh",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        toast.success("Thêm ảnh thành công!");
        setShowImageModal(false);
        setFile(null);
        setPreview("");
        fetchProvinces(); // Refresh danh sách tỉnh thành
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi thêm ảnh");
    }
  };

  const handleProvinceOptions = (provinceId, event) => {
    event.stopPropagation();
    setShowOptions(showOptions === provinceId ? null : provinceId);
  };

  const handleAddProvince = async () => {
    if (!newProvinceName.trim()) {
      toast.error("Vui lòng nhập tên tỉnh thành!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8081/api/tinhthanh/createTinhThanh",
        newProvinceName,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        toast.success("Thêm tỉnh thành thành công!");
        setShowAddModal(false);
        setNewProvinceName("");
        fetchProvinces(); // Refresh danh sách
      } else {
        throw new Error(response.data.message || "Thêm tỉnh thành thất bại");
      }
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi thêm tỉnh thành");
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  return (
    <div className="p-6 mt-16 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {selectedProvince
            ? `Danh sách điểm đón tại ${selectedProvince.tenTinhThanh}`
            : "Danh sách tỉnh thành"}
        </h1>
        {!selectedProvince && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Thêm tỉnh thành
          </button>
        )}
      </div>

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
                    className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer relative"
                    onClick={() => handleProvinceClick(province)}
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => handleProvinceOptions(province.id, e)}
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {showOptions === province.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProvinceId(province.id);
                              setShowImageModal(true);
                              setShowOptions(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Đổi ảnh
                          </button>
                        </div>
                      )}
                    </div>
                    <img
                      src={province.anh1 || defaultProvinceImage}
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

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Thay đổi ảnh tỉnh thành
              </h3>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setFile(null);
                  setPreview("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="mb-4"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="max-w-[300px] rounded-lg mb-4"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowImageModal(false);
                    setFile(null);
                    setPreview("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={onUpload}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Tải lên
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Province Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Thêm tỉnh thành mới
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewProvinceName("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tỉnh thành
                </label>
                <input
                  type="text"
                  value={newProvinceName}
                  onChange={(e) => setNewProvinceName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Nhập tên tỉnh thành"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewProvinceName("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddProvince}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvinceManagement;
