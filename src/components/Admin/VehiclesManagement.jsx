import { useState, useEffect } from "react";
import { showSuccess, showError } from "../../utils/toastConfig";
import { ListCollapse, Pencil, Trash2 } from "lucide-react";

const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]); // Danh sách phương tiện sau khi lọc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tenXe: "",
    bienSo: "",
    loaiXe: "ECONOMY",
    trangThai: "Active",
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/Xe/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách phương tiện");
      }

      const data = await response.json();
      if (data.code === 200) {
        setVehicles(data.result);
        setFilteredVehicles(data.result); // Hiển thị tất cả phương tiện ban đầu
      } else {
        throw new Error(data.message || "Lỗi khi lấy danh sách phương tiện");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Xử lý tìm kiếm
  useEffect(() => {
    const results = vehicles.filter(
      (vehicle) =>
        vehicle.tenXe.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.bienSo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVehicles(results);
  }, [searchTerm, vehicles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setFormData({
      tenXe: "",
      bienSo: "",
      loaiXe: "ECONOMY",
      trangThai: "Active",
    });
    setShowModal(true);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      tenXe: vehicle.tenXe,
      bienSo: vehicle.bienSo,
      loaiXe: vehicle.loaiXe,
      trangThai: vehicle.trangThai,
    });
    setShowModal(true);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phương tiện này?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8081/api/Xe/${vehicleId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể xóa phương tiện");
        }

        fetchVehicles(); // Refresh danh sách sau khi xóa
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingVehicle
        ? `http://localhost:8081/api/Xe/suaThongTinXe/${editingVehicle.id}`
        : "http://localhost:8081/api/Xe";

      const method = editingVehicle ? "PUT" : "POST";

      // Create XeDTO object
      const xeDTO = editingVehicle
        ? {
            id: editingVehicle.id,
            ...formData,
          }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(xeDTO),
      });

      const data = await response.json();

      if (data.code === 200) {
        showSuccess(
          editingVehicle ? "Cập nhật xe thành công!" : "Thêm xe mới thành công!"
        );
        setShowModal(false);
        fetchVehicles();
      } else {
        throw new Error(
          data.message ||
            `Không thể ${editingVehicle ? "cập nhật" : "thêm"} phương tiện`
        );
      }
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý phương tiện
        </h1>
        <button
          onClick={handleAddVehicle}
          className="px-4 py-2 bg-green-100 text-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Thêm phương tiện
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên xe hoặc biển số"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Tên xe
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Biển số
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Loại xe
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {vehicle.id}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {vehicle.tenXe}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {vehicle.bienSo}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {vehicle.loaiXe}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        vehicle.trangThai === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vehicle.trangThai}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm flex flex-row items-center space-x-2 text-orange-400">
                    <Pencil onClick={() => handleEditVehicle(vehicle)} />
                    <Trash2
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="text-red-500"
                    />
                    <ListCollapse />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingVehicle
                  ? "Chỉnh sửa phương tiện"
                  : "Thêm phương tiện mới"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Tên xe</label>
                <input
                  type="text"
                  name="tenXe"
                  value={formData.tenXe}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Biển số</label>
                <input
                  type="text"
                  name="bienSo"
                  value={formData.bienSo}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Loại xe</label>
                <select
                  name="loaiXe"
                  value={formData.loaiXe}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Trạng thái</label>
                <select
                  name="trangThai"
                  value={formData.trangThai}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                >
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Không hoạt động</option>
                </select>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-3 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-100 text-green-800 rounded ring ring-transparent hover:ring-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                >
                  {editingVehicle ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesManagement;
