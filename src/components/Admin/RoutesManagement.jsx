import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Thêm Link
import TableActions from "./TableActions";

const RoutesManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    tenTuyen: "",
    tinhDiId: "",
    tinhDenId: "",
    khoangCach: "",
    thoiGianDiChuyen: "",
    trangThai: "ACTIVE",
  });

  const token = localStorage.getItem("token");

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/api/tuyen-xe", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.code === 200) {
        setRoutes(data.result);
      } else throw new Error(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/tinhthanh", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.code === 200) {
        setProvinces(data.result);
      }
    } catch (err) {
      console.error("Failed to fetch provinces", err);
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchProvinces();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRoute = () => {
    setEditingRoute(null);
    setFormData({
      tenTuyen: "",
      tinhDiId: "",
      tinhDenId: "",
      khoangCach: "",
      thoiGianDiChuyen: "",
      trangThai: "ACTIVE",
    });
    setShowModal(true);
  };

  const handleEditRoute = (route) => {
    setEditingRoute(route);
    setFormData({
      tenTuyen: route.tenTuyen,
      tinhDiId: route.tinhDi.id,
      tinhDenId: route.tinhDen.id,
      khoangCach: route.khoangCach,
      thoiGianDiChuyen: route.thoiGianDiChuyen,
      trangThai: route.trangThai || "ACTIVE",
    });
    setShowModal(true);
  };

  const handleDeleteRoute = async (id) => {
    if (!window.confirm("Xác nhận xoá tuyến xe?")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/tuyenxe/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xoá thất bại");
      fetchRoutes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingRoute ? "PUT" : "POST";
      const url = editingRoute
        ? `http://localhost:8081/api/tuyenxe/${editingRoute.id}`
        : "http://localhost:8081/api/tuyenxe";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Lưu thất bại");
      setShowModal(false);
      fetchRoutes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tuyến xe</h1>
        <button
          onClick={handleAddRoute}
          className="px-4 py-2 bg-green-100 text-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Thêm tuyến xe
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-16 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="w-40 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Tên tuyến
                </th>
                <th className="w-40 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Điểm đi
                </th>
                <th className="w-40 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Điểm đến
                </th>
                <th className="w-28 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Khoảng cách
                </th>
                <th className="w-28 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="w-32 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {routes.map((route) => (
                <tr
                  key={route.id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                >
                  <td className="py-2 px-4">{route.id}</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/admin/routes/${route.id}/schedule`}
                      state={{ route }} // Truyền dữ liệu tuyến xe qua state
                      className=" hover:underline"
                    >
                      {route.tenTuyen}
                    </Link>
                  </td>
                  <td className="py-2 px-4">{route.tinhDi.tenTinhThanh}</td>
                  <td className="py-2 px-4">{route.tinhDen.tenTinhThanh}</td>
                  <td className="py-2 px-4">{route.khoangCach} km</td>
                  <td className="py-2 px-4">{route.thoiGianDiChuyen}</td>
                  <td className="py-2 px-4">
                    <TableActions
                      onEdit={() => handleEditRoute(route)}
                      onDelete={() => handleDeleteRoute(route.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editingRoute ? "Chỉnh sửa tuyến xe" : "Thêm tuyến xe"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="tenTuyen"
                value={formData.tenTuyen}
                onChange={handleInputChange}
                placeholder="Tên tuyến"
                required
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="tinhDiId"
                value={formData.tinhDiId}
                onChange={handleInputChange}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Chọn tỉnh đi</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.tenTinhThanh}
                  </option>
                ))}
              </select>
              <select
                name="tinhDenId"
                value={formData.tinhDenId}
                onChange={handleInputChange}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Chọn tỉnh đến</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.tenTinhThanh}
                  </option>
                ))}
              </select>
              <input
                name="khoangCach"
                type="number"
                value={formData.khoangCach}
                onChange={handleInputChange}
                placeholder="Khoảng cách (km)"
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="thoiGianDiChuyen"
                value={formData.thoiGianDiChuyen}
                onChange={handleInputChange}
                placeholder="Thời gian di chuyển"
                required
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="trangThai"
                value={formData.trangThai}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingRoute ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesManagement;
