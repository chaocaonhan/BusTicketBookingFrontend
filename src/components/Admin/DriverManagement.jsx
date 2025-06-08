import React, { useState, useEffect } from "react";
import axios from "axios";
import authService from "../../services/authService";
import driverIcon from "../../assets/driver.png";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = authService.getToken();
        const response = await axios.get(
          "http://localhost:8081/api/taiXe/getAll",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.code === 200) {
          setDrivers(response.data.result);
        } else {
          throw new Error(response.data.message || "Failed to fetch drivers");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const onUpload = async () => {
    if (!file || !selectedDriverId) return;
    try {
      const form = new FormData();
      form.append("id", selectedDriverId);
      form.append("file", file);

      const token = authService.getToken();
      const response = await axios.post(
        "http://localhost:8081/api/taiXe/themAnh",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        alert("Thêm ảnh thành công!");
        setShowImageModal(false);
        setFile(null);
        setPreview("");
        // Optionally refresh driver list
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra khi thêm ảnh");
    }
  };

  const handleDriverClick = (driver) => {
    navigate("/admin/driver-schedule", { state: { driver } });
  };

  return (
    <div className="p-6 mt-16 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-[#00613d] mb-4 text-center">
        Danh sách tài xế
      </h1>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="relative flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow cursor-pointer"
              onClick={() => handleDriverClick(driver)}
            >
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(
                      showOptions === driver.id ? null : driver.id
                    );
                  }}
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
                {showOptions === driver.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDriverId(driver.id);
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
                src={driver?.anh || driverIcon}
                alt="driver"
                className="w-20 h-20 mb-2 rounded-full object-cover"
              />
              <div className="text-lg font-medium text-gray-800 text-center mb-2">
                {driver.hoTen}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#00613d]">
                Thay đổi ảnh tài xế
              </h3>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setFile(null);
                  setPreview("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="mb-4 text-orange-400 "
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="max-w-[300px] rounded-lg mb-4 "
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
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-400 rounded-md hover:bg-orange-500"
                >
                  Tải lên
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
