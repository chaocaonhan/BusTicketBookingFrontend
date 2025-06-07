import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Thêm Link
import TableActions from "./TableActions";
import { toast } from "react-toastify";
import ConfirmDialog from "../comon/ConfirmDialog";

const RoutesManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);

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

  const handleDeleteRoute = (route) => {
    setRouteToDelete(route);
    setConfirmDialogOpen(true);
  };

  const confirmDeleteRoute = async () => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/tuyen-xe/${routeToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        toast.success("Xoá tuyến xe thành công!");
      } else {
        throw new Error("Xoá thất bại");
      }
      fetchRoutes();
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmDialogOpen(false);
      setRouteToDelete(null);
    }
  };

  const cancelDeleteRoute = () => {
    setConfirmDialogOpen(false);
    setRouteToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url, method, body;
      if (editingRoute) {
        const tinhDi = provinces.find(
          (p) => p.id === Number(formData.tinhDiId)
        );
        const tinhDen = provinces.find(
          (p) => p.id === Number(formData.tinhDenId)
        );
        url = `http://localhost:8081/api/tuyen-xe/suaThongTinTuyen/${editingRoute.id}`;
        method = "PUT";
        body = JSON.stringify({
          id: editingRoute.id,
          tenTuyen: formData.tenTuyen,
          tinhDi: tinhDi ? tinhDi.tenTinhThanh : "",
          tinhDen: tinhDen ? tinhDen.tenTinhThanh : "",
          khoangCach: Number(formData.khoangCach),
          thoiGianDiChuyen: formData.thoiGianDiChuyen,
          tinhDenUrl: "",
        });
      } else {
        url = "http://localhost:8081/api/tuyen-xe/taoTuyen";
        method = "POST";
        // Tìm tên tỉnh đi và tỉnh đến từ provinces
        const tinhDi = provinces.find(
          (p) => p.id === Number(formData.tinhDiId)
        );
        const tinhDen = provinces.find(
          (p) => p.id === Number(formData.tinhDenId)
        );
        body = JSON.stringify({
          id: 0,
          tenTuyen: formData.tenTuyen,
          tinhDi: tinhDi ? tinhDi.tenTinhThanh : "",
          tinhDen: tinhDen ? tinhDen.tenTinhThanh : "",
          khoangCach: Number(formData.khoangCach),
          thoiGianDiChuyen: formData.thoiGianDiChuyen,
          tinhDenUrl: "",
        });
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!res.ok) throw new Error("Lưu thất bại");
      setShowModal(false);
      toast.success(
        editingRoute
          ? "Cập nhật tuyến xe thành công!"
          : "Thêm tuyến xe thành công!"
      );
      fetchRoutes();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
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
                      onDelete={() => handleDeleteRoute(route)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingRoute ? "Chỉnh sửa tuyến xe" : "Thêm tuyến xe"}
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

            {/* Form ngang */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Tên tuyến</label>
                  <input
                    name="tenTuyen"
                    value={formData.tenTuyen}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Tỉnh đi</label>
                  <select
                    name="tinhDiId"
                    value={formData.tinhDiId}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  >
                    <option value="">Chọn tỉnh đi</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.tenTinhThanh}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Tỉnh đến</label>
                  <select
                    name="tinhDenId"
                    value={formData.tinhDenId}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  >
                    <option value="">Chọn tỉnh đến</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.tenTinhThanh}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Khoảng cách (km)
                  </label>
                  <input
                    name="khoangCach"
                    type="number"
                    value={formData.khoangCach}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Thời gian di chuyển
                  </label>
                  <input
                    name="thoiGianDiChuyen"
                    value={formData.thoiGianDiChuyen}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Trạng thái</label>
                  <select
                    name="trangThai"
                    value={formData.trangThai}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                  </select>
                </div>
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
                  {editingRoute ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Xác nhận xoá tuyến xe"
        description={`Xác nhận xoá tuyến ${
          routeToDelete ? routeToDelete.tenTuyen : ""
        } không?`}
        cancelText="Hủy"
        confirmText="Xác nhận"
        onCancel={cancelDeleteRoute}
        onConfirm={confirmDeleteRoute}
      />
    </div>
  );
};

export default RoutesManagement;
