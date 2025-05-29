import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { showSuccess, showError } from "../../utils/toastConfig";

const Discount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);

  const [formData, setFormData] = useState({
    maKhuyenMai: "",
    moTa: "",
    phanTramGiam: "",
    ngayBatDau: "",
    ngayKetThuc: "",
  });

  const token = localStorage.getItem("token");

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/api/khuyen-mai/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.code === 200) {
        setDiscounts(data.result);
      } else throw new Error(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDiscount = () => {
    setEditingDiscount(null);
    setFormData({
      maKhuyenMai: "",
      moTa: "",
      phanTramGiam: "",
      ngayBatDau: "",
      ngayKetThuc: "",
    });
    setShowModal(true);
  };

  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount);
    setFormData({
      maKhuyenMai: discount.maKhuyenMai,
      moTa: discount.moTa || "",
      phanTramGiam: discount.phanTramGiam,
      ngayBatDau: discount.ngayBatDau,
      ngayKetThuc: discount.ngayKetThuc,
    });
    setShowModal(true);
  };

  const handleDeleteDiscount = async (id) => {
    if (!window.confirm("Xác nhận xoá mã khuyến mãi?")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/khuyen-mai/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.code === 200) {
        showSuccess("Xóa mã khuyến mãi thành công!");
        fetchDiscounts();
      } else {
        throw new Error(data.message || "Xóa thất bại");
      }
    } catch (err) {
      showError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url, method, body;
      if (editingDiscount) {
        url = `http://localhost:8081/api/khuyen-mai/${editingDiscount.id}`;
        method = "PUT";
        body = JSON.stringify(formData);
      } else {
        url = "http://localhost:8081/api/khuyen-mai/addMa";
        method = "POST";
        body = JSON.stringify({
          maKhuyenMai: formData.maKhuyenMai,
          moTa: formData.moTa || null,
          phanTramGiam: Number(formData.phanTramGiam),
          ngayBatDau: formData.ngayBatDau,
          ngayKetThuc: formData.ngayKetThuc,
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

      const data = await res.json();
      if (data.code === 200) {
        showSuccess(
          editingDiscount
            ? "Cập nhật mã khuyến mãi thành công!"
            : "Thêm mã khuyến mãi mới thành công!"
        );
        setShowModal(false);
        fetchDiscounts();
      } else {
        throw new Error(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
        <button
          onClick={handleAddDiscount}
          className="px-4 py-2 bg-green-100 text-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Thêm khuyến mãi
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
                <th className="w-32 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Mã KM
                </th>
                <th className="w-48 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="w-24 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Giảm (%)
                </th>
                <th className="w-32 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Ngày bắt đầu
                </th>
                <th className="w-32 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Ngày kết thúc
                </th>
                <th className="w-32 py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr
                  key={discount.id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                >
                  <td className="py-2 px-4">{discount.id}</td>
                  <td className="py-2 px-4">{discount.maKhuyenMai}</td>
                  <td className="py-2 px-4">{discount.moTa || "-"}</td>
                  <td className="py-2 px-4">{discount.phanTramGiam}%</td>
                  <td className="py-2 px-4">{discount.ngayBatDau}</td>
                  <td className="py-2 px-4">{discount.ngayKetThuc}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleEditDiscount(discount)}
                      className="text-orange-400 hover:text-orange-600"
                      title="Chỉnh sửa"
                    >
                      <Pencil />
                    </button>
                    <button
                      onClick={() => handleDeleteDiscount(discount.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Xóa"
                    >
                      <Trash2 />
                    </button>
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
                {editingDiscount ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi"}
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
                <label className="text-sm text-gray-600">Mã khuyến mãi</label>
                <input
                  name="maKhuyenMai"
                  value={formData.maKhuyenMai}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Mô tả</label>
                <input
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Phần trăm giảm (%)
                </label>
                <input
                  name="phanTramGiam"
                  type="number"
                  value={formData.phanTramGiam}
                  onChange={handleInputChange}
                  required
                  min={1}
                  max={100}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Ngày bắt đầu</label>
                <input
                  name="ngayBatDau"
                  type="date"
                  value={formData.ngayBatDau}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Ngày kết thúc</label>
                <input
                  name="ngayKetThuc"
                  type="date"
                  value={formData.ngayKetThuc}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                />
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
                  {editingDiscount ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discount;
