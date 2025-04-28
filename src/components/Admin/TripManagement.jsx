import { useState, useEffect } from "react";
import TableActions from "./TableActions";
import Select from "react-select";

const TripManagement = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingTrip, setEditingTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [startStations, setStartStations] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [endStations, setEndStations] = useState([]);
  const [formData, setFormData] = useState({
    tenTuyen: "",
    bienSoXe: "",
    taiXe: "",
    diemDi: "",
    diemDen: "",
    ngayKhoiHanh: "2025-04-18", // LocalDate
    gioKhoiHanh: { hour: 0, minute: 0, second: 0, nano: 0 }, // Sẽ chuyển thành LocalTime
    gioKetThuc: { hour: 0, minute: 0, second: 0, nano: 0 }, // Sẽ chuyển thành LocalTime
    giaVe: 0,
  });

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8081/api/chuyenxe/getAllChuyenXe",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách chuyến xe");
      }

      const data = await response.json();
      if (data.code === 200) {
        setTrips(data.result);
      } else {
        throw new Error(data.message || "Lỗi khi lấy danh sách chuyến xe");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8081/api/Xe/getAllLoaiXe",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách loại xe");
      }

      const data = await response.json();
      if (data.code === 200) {
        setVehicleTypes(data.result);
      } else {
        throw new Error(data.message || "Lỗi khi lấy danh sách loại xe");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/Xe/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách xe");
      }

      const data = await response.json();
      if (data.code === 200) {
        setVehicles(data.result);
      } else {
        throw new Error(data.message || "Lỗi khi lấy danh sách xe");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/tuyen-xe", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách tuyến xe");
      }

      const data = await response.json();
      if (data.code === 200) {
        setRoutes(data.result);
      } else {
        throw new Error(data.message || "Lỗi khi lấy danh sách tuyến xe");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8081/api/nguoidung/danhSachTaiXe",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách tài xế");
      }

      const data = await response.json();
      if (data.code === 200) {
        setDrivers(data.result);
      } else {
        throw new Error(data.message || "Lỗi khi lấy danh sách tài xế");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStations = async (provinceName, isStart) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/Station/getByProvince?province=${encodeURIComponent(
          provinceName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách bến xe");
      }

      const data = await response.json();
      if (data.code === 200) {
        if (isStart) {
          setStartStations(data.result);
        } else {
          setEndStations(data.result);
        }
      } else {
        throw new Error(data.message || "Lỗi khi lấy danh sách bến xe");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchVehicleTypes();
    fetchVehicles();
    fetchRoutes();
    fetchDrivers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "tenTuyen") {
      const selectedRoute = routes.find((route) => route.tenTuyen === value);
      if (selectedRoute) {
        fetchStations(selectedRoute.tinhDi.tenTinhThanh, true); // Lấy danh sách bến xe điểm đi
        fetchStations(selectedRoute.tinhDen.tenTinhThanh, false); // Lấy danh sách bến xe điểm đến
        setFormData((prev) => ({
          ...prev,
          diemDi: "",
          diemDen: "",
        }));
      }
    }
  };

  const handleTimeChange = (e, field, part) => {
    const value = parseInt(e.target.value) || 0;
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [part]: value,
      },
    });
  };

  const handleAddTrip = () => {
    setEditingTrip(null);
    setFormData({
      tenTuyen: "",
      bienSoXe: "",
      taiXe: "",
      diemDi: "",
      diemDen: "",
      ngayKhoiHanh: "2025-04-18",
      gioKhoiHanh: { hour: 0, minute: 0, second: 0, nano: 0 },
      gioKetThuc: { hour: 0, minute: 0, second: 0, nano: 0 },
      giaVe: 0,
      loaiXe: "",
    });
    setShowModal(true);
  };

  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    const selectedRoute = routes.find(
      (route) =>
        route.tinhDi.tenTinhThanh === trip.diemDi.split(" ")[2] &&
        route.tinhDen.tenTinhThanh === trip.diemDen.split(" ")[2]
    );
    if (selectedRoute) {
      fetchStations(selectedRoute.tinhDi.id, true);
      fetchStations(selectedRoute.tinhDen.id, false);
    }
    setFormData({
      tenTuyen: selectedRoute ? selectedRoute.tenTuyen : "",
      bienSoXe: trip.bienSoXe || "",
      taiXe: trip.taiXe || "",
      diemDi: trip.diemDi,
      diemDen: trip.diemDen,
      ngayKhoiHanh: trip.ngayKhoiHanh || "2025-04-18",
      gioKhoiHanh: {
        hour: parseInt(trip.gioKhoiHanh.split(":")[0]),
        minute: parseInt(trip.gioKhoiHanh.split(":")[1]),
        second: parseInt(trip.gioKhoiHanh.split(":")[2]),
        nano: 0,
      },
      gioKetThuc: {
        hour: parseInt(trip.gioKetThuc.split(":")[0]),
        minute: parseInt(trip.gioKetThuc.split(":")[1]),
        second: parseInt(trip.gioKetThuc.split(":")[2]),
        nano: 0,
      },
      giaVe: trip.giaVe,
      loaiXe: trip.tenLoaiXe,
    });
    setShowModal(true);
  };

  const padTime = (num) => num.toString().padStart(2, "0");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        gioKhoiHanh: `${padTime(formData.gioKhoiHanh.hour)}:${padTime(
          formData.gioKhoiHanh.minute
        )}:00`,
        gioKetThuc: `${padTime(formData.gioKetThuc.hour)}:${padTime(
          formData.gioKetThuc.minute
        )}:00`,
        giaVe: parseInt(formData.giaVe),
      };

      console.log("Dữ liệu gửi đi:", payload); // Kiểm tra dữ liệu

      const token = localStorage.getItem("token");
      const url = editingTrip
        ? `http://localhost:8081/api/chuyenxe/${formData.id}`
        : "http://localhost:8081/api/chuyenxe/TaoChuyenXe";

      const method = editingTrip ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Không thể ${editingTrip ? "cập nhật" : "thêm"} chuyến xe`
        );
      }

      setShowModal(false);
      setSuccessMessage(
        editingTrip
          ? "Cập nhật chuyến xe thành công!"
          : "Thêm chuyến xe mới thành công!"
      );
      fetchTrips();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) => vehicle.loaiXe === formData.loaiXe
  );

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, "0"),
  }));

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, "0"),
  }));

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý chuyến xe</h1>
        <button
          onClick={handleAddTrip}
          className="px-4 py-2 bg-green-100 text-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Thêm chuyến xe
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

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
                  Điểm đi
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Điểm đến
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Ngày đi
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Giờ khởi hành
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Giờ kết thúc
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Giá vé
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Loại xe
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Số ghế trống
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.map((trip, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {trip.diemDi}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {trip.diemDen}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {trip.ngayKhoiHanh}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {trip.gioKhoiHanh}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {trip.gioKetThuc}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {trip.giaVe.toLocaleString()} VNĐ
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {trip.tenLoaiXe}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {trip.soGheTrong}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <TableActions
                      onEdit={() => handleEditTrip(trip)}
                      onDelete={() => {}}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-visible">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingTrip ? "Chỉnh sửa chuyến xe" : "Thêm chuyến xe mới"}
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

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Tên tuyến</label>
                  <select
                    name="tenTuyen"
                    value={formData.tenTuyen}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    required
                  >
                    <option value="">Chọn tuyến xe</option>
                    {routes.map((route) => (
                      <option key={route.id} value={route.tenTuyen}>
                        {route.tenTuyen}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Loại xe</label>
                  <select
                    name="loaiXe"
                    value={formData.loaiXe}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    required
                  >
                    <option value="">Chọn loại xe</option>
                    {vehicleTypes.map((type) => (
                      <option key={type.id} value={type.tenLoaiXe}>
                        {type.tenLoaiXe}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Biển số xe</label>
                  <select
                    name="bienSoXe"
                    value={formData.bienSoXe}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    required
                    disabled={!formData.loaiXe}
                  >
                    <option value="">Chọn biển số xe</option>
                    {filteredVehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.bienSo}>
                        {vehicle.bienSo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Tài xế</label>
                  <select
                    name="taiXe"
                    value={formData.taiXe}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    required
                  >
                    <option value="">Chọn tài xế</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.hoTen}>
                        {driver.hoTen}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Điểm đi</label>
                  <select
                    name="diemDi"
                    value={formData.diemDi}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    required
                    disabled={!formData.tenTuyen}
                  >
                    <option value="">Chọn điểm đi</option>
                    {startStations.map((station) => (
                      <option key={station.id} value={station.tenDiemDon}>
                        {station.tenDiemDon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Điểm đến</label>
                  <select
                    name="diemDen"
                    value={formData.diemDen}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    required
                    disabled={!formData.tenTuyen}
                  >
                    <option value="">Chọn điểm đến</option>
                    {endStations.map((station) => (
                      <option key={station.id} value={station.tenDiemDon}>
                        {station.tenDiemDon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Ngày khởi hành
                  </label>
                  <input
                    type="date"
                    name="ngayKhoiHanh"
                    value={formData.ngayKhoiHanh}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Giờ khởi hành</label>
                  <div className="flex gap-2">
                    <Select
                      options={hourOptions}
                      placeholder="Giờ"
                      onChange={(selectedOption) =>
                        handleTimeChange(
                          { target: { value: selectedOption.value } },
                          "gioKhoiHanh",
                          "hour"
                        )
                      }
                    />

                    <Select
                      options={minuteOptions}
                      placeholder="Phút"
                      onChange={(selectedOption) =>
                        handleTimeChange(
                          { target: { value: selectedOption.value } },
                          "gioKhoiHanh",
                          "minute"
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Giờ kết thúc</label>
                  <div className="flex gap-2">
                    <Select
                      options={hourOptions}
                      placeholder="Giờ"
                      onChange={(selectedOption) =>
                        handleTimeChange(
                          { target: { value: selectedOption.value } },
                          "gioKetThuc",
                          "hour"
                        )
                      }
                    />

                    <Select
                      options={minuteOptions}
                      placeholder="Phút"
                      onChange={(selectedOption) =>
                        handleTimeChange(
                          { target: { value: selectedOption.value } },
                          "gioKetThuc",
                          "minute"
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Giá vé</label>
                  <input
                    type="number"
                    name="giaVe"
                    value={formData.giaVe}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                    required
                  />
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
                  {editingTrip ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripManagement;
