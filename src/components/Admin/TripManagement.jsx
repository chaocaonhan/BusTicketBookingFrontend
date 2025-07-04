import { useState, useEffect } from "react";
import TableActions from "./TableActions";
import Select from "react-select";
import ConfirmDialog from "../comon/ConfirmDialog";
import { format } from "date-fns";
import { CalendarIcon, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { showSuccess, showError } from "../../utils/toastConfig";
import { useNavigate } from "react-router-dom";

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
    ngayKhoiHanh: "",
    gioKhoiHanh: { hour: 0, minute: 0, second: 0, nano: 0 },
    gioKetThuc: { hour: 0, minute: 0, second: 0, nano: 0 },
    giaVe: "",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("SCHEDULED");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const fetchTrips = async (
    page = currentPage,
    size = pageSize,
    date = selectedDate,
    status = activeTab
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = `http://localhost:8081/api/chuyenxe/getPage?page=${page}&size=${size}&trangThaiChuyenXe=${status}`;

      if (date) {
        const formattedDate = format(date, "yyyy-MM-dd");
        url = `http://localhost:8081/api/chuyenxe/searchWithPageAndDate?keyword=${formattedDate}&page=${page}&size=${size}&trangThaiChuyenXe=${status}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách chuyến xe");
      }

      const data = await response.json();
      if (data.content) {
        setTrips(data.content);
        setTotalPages(data.totalPages);
      } else {
        throw new Error("Lỗi khi lấy danh sách chuyến xe");
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTrip = (trip) => {
    navigate(`/admin/trip-details`, { state: { trip } });
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
      showError(err.message);
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
      showError(err.message);
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
      showError(err.message);
    }
  };

  const fetchDrivers = async (ngayKhoiHanh, gioKhoiHanh) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/taiXe/taiXeTrongLich/${ngayKhoiHanh}/${gioKhoiHanh}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách tài xế trống lịch");
      }

      const data = await response.json();
      if (data.code === 200) {
        setDrivers(data.result);
      } else {
        throw new Error(
          data.message || "Lỗi khi lấy danh sách tài xế trống lịch"
        );
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
        setFormData((prev) => ({
          ...prev,
          tenTuyen: selectedRoute.tenTuyen,
          diemDi: "",
          diemDen: "",
        }));
      }
    }

    if (name === "ngayKhoiHanh" || name === "gioKhoiHanh") {
      const ngayKhoiHanh = formData.ngayKhoiHanh || "";
      const gioKhoiHanh = `${padTime(formData.gioKhoiHanh.hour)}:${padTime(
        formData.gioKhoiHanh.minute
      )}`;
      if (
        ngayKhoiHanh &&
        formData.gioKhoiHanh.hour !== undefined &&
        formData.gioKhoiHanh.minute !== undefined
      ) {
        fetchDrivers(ngayKhoiHanh, gioKhoiHanh);
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
      ngayKhoiHanh: "",
      gioKhoiHanh: { hour: 0, minute: 0, second: 0, nano: 0 },
      gioKetThuc: { hour: 0, minute: 0, second: 0, nano: 0 },
      giaVe: 0,
      loaiXe: "",
    });
    setShowModal(true);
  };

  const handleEditTrip = (trip) => {
    setEditingTrip(trip);

    setFormData({
      tenTuyen: trip.tenTuyen || "",
      bienSoXe: trip.bienSo || "",
      taiXe: trip.taiXe || "",
      diemDi: trip.diemDi || "",
      diemDen: trip.diemDen || "",
      // Chuyển ngày về dạng yyyy-MM-dd nếu cần
      ngayKhoiHanh: formatDateToInput(trip.ngayKhoiHanh),
      gioKhoiHanh: parseTime(trip.gioKhoiHanh),
      gioKetThuc: parseTime(trip.gioKetThuc),
      giaVe: trip.giaVe || 0,
      loaiXe: trip.tenLoaiXe || "",
    });
    setShowModal(true);
  };

  // Hàm chuyển ngày "25/12/23" => "2023-12-25"
  function formatDateToInput(dateStr) {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // Hàm chuyển "06:00" => { hour: 6, minute: 0, second: 0, nano: 0 }
  function parseTime(timeStr) {
    if (!timeStr) return { hour: 0, minute: 0, second: 0, nano: 0 };
    const [hour, minute] = timeStr.split(":");
    return {
      hour: parseInt(hour),
      minute: parseInt(minute),
      second: 0,
      nano: 0,
    };
  }

  const selectedRoute = routes.find(
    (route) => route.tenTuyen === formData.tenTuyen
  );
  const padTime = (num) => num.toString().padStart(2, "0");

  const handleDriverSelectClick = () => {
    const ngayKhoiHanh = formData.ngayKhoiHanh || "";
    const gioKhoiHanh = `${padTime(formData.gioKhoiHanh.hour)}:${padTime(
      formData.gioKhoiHanh.minute
    )}`;
    if (
      ngayKhoiHanh &&
      formData.gioKhoiHanh.hour !== undefined &&
      formData.gioKhoiHanh.minute !== undefined
    ) {
      fetchDrivers(ngayKhoiHanh, gioKhoiHanh);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        tenTuyen: selectedRoute.id,
        bienSoXe: formData.bienSoXe,
        taiXe: formData.taiXe,
        diemDi: formData.diemDi,
        diemDen: formData.diemDen,
        ngayKhoiHanh: formData.ngayKhoiHanh,
        gioKhoiHanh: `${padTime(formData.gioKhoiHanh.hour)}:${padTime(
          formData.gioKhoiHanh.minute
        )}`,
        gioKetThuc: `${padTime(formData.gioKetThuc.hour)}:${padTime(
          formData.gioKetThuc.minute
        )}`,
        giaVe: parseInt(formData.giaVe),
      };

      console.log("Dữ liệu gửi đi:", payload); // Kiểm tra dữ liệu

      const token = localStorage.getItem("token");
      let response;
      if (editingTrip) {
        // Gọi API cập nhật
        response = await fetch(
          `http://localhost:8081/api/chuyenxe/editChuyenXe?id=${editingTrip.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Gọi API tạo mới (giữ nguyên như cũ)
        response = await fetch(
          "http://localhost:8081/api/chuyenxe/TaoChuyenXe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      }

      const data = await response.json();
      if (!response.ok || data.code !== 200) {
        throw new Error(data.message || "Có lỗi xảy ra!");
      }

      setShowModal(false);
      showSuccess(
        editingTrip
          ? "Cập nhật chuyến xe thành công!"
          : "Thêm chuyến xe mới thành công!"
      );
      fetchTrips();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDeleteTrip = (trip) => {
    setTripToDelete(trip);
    setConfirmDialogOpen(true);
  };

  const confirmDeleteTrip = async () => {
    if (tripToDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8081/api/chuyenxe/huyChuyen/${tripToDelete.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok || data.code !== 200) {
          throw new Error(data.message || "Có lỗi xảy ra khi hủy chuyến xe!");
        }

        showSuccess("Hủy chuyến xe thành công!");
        fetchTrips();
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        showError(err.message);
      } finally {
        setConfirmDialogOpen(false);
        setTripToDelete(null);
      }
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

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      fetchTrips(newPage, pageSize, selectedDate, activeTab);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      0,
      Math.min(
        currentPage - Math.floor(maxVisiblePages / 2),
        totalPages - maxVisiblePages
      )
    );
    startPage = Math.max(0, startPage);

    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý chuyến xe</h1>

        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          <div className="flex rounded-md bg-gray-100 overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "SCHEDULED"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                setActiveTab("SCHEDULED");
                setSelectedDate(null);
                fetchTrips(currentPage, pageSize, null, "SCHEDULED");
              }}
            >
              Lịch trình
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "DEPARTED"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                setActiveTab("DEPARTED");
                setSelectedDate(null);
                fetchTrips(currentPage, pageSize, null, "DEPARTED");
              }}
            >
              Đang chạy
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "COMPLETED"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                setActiveTab("COMPLETED");
                setSelectedDate(null);
                fetchTrips(currentPage, pageSize, null, "COMPLETED");
              }}
            >
              Hoàn thành
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "CANCELED"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                setActiveTab("CANCELED");
                setSelectedDate(null);
                fetchTrips(currentPage, pageSize, null, "CANCELED");
              }}
            >
              Đã huỷ
            </button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Lọc theo ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setCurrentPage(0);
                  fetchTrips(0, pageSize, date, activeTab);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <button
          onClick={handleAddTrip}
          className="px-4 py-2 bg-green-100 text-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Tạo chuyến xe
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
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
                {[
                  "ID",
                  "Tuyến",
                  "Ngày đi",
                  "Giờ khởi hành",
                  "Giờ kết thúc",
                  "Giá vé",
                  "Loại xe",
                  "Số ghế trống",
                  "Thao tác",
                ].map((header) => (
                  <th
                    key={header}
                    className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {(trips || []).map((trip, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{trip.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {trip.tenTuyen}
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

                  <td className=" flex flex-row py-3 px-4 text-sm text-gray-900">
                    {activeTab === "SCHEDULED" && (
                      <TableActions
                        onEdit={() => handleEditTrip(trip)}
                        onDelete={() => handleDeleteTrip(trip)}
                      />
                    )}
                    <Eye
                      className="h-7 w-7 text-orange-400 ml-1"
                      onClick={() => handleViewTrip(trip)}
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
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Tên tuyến</label>
                  {editingTrip ? (
                    <div className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-800">
                      {formData.tenTuyen}
                    </div>
                  ) : (
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
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Ngày khởi hành
                  </label>
                  {editingTrip ? (
                    <div className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-800">
                      {formData.ngayKhoiHanh}
                    </div>
                  ) : (
                    <input
                      type="date"
                      name="ngayKhoiHanh"
                      value={formData.ngayKhoiHanh}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Giờ khởi hành</label>
                  <div className="flex gap-2">
                    <Select
                      options={hourOptions}
                      placeholder="Giờ"
                      value={hourOptions.find(
                        (opt) => opt.value === formData.gioKhoiHanh.hour
                      )}
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
                      value={minuteOptions.find(
                        (opt) => opt.value === formData.gioKhoiHanh.minute
                      )}
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
                  <label className="text-sm text-gray-600">Loại xe</label>
                  {editingTrip ? (
                    <div className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-800">
                      {formData.loaiXe}
                    </div>
                  ) : (
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
                  )}
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
                    onClick={handleDriverSelectClick}
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

                {editingTrip && (
                  <>
                    <div>
                      <label className="text-sm text-gray-600">Điểm đi</label>
                      <div className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-800">
                        {formData.diemDi || "—"}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Điểm đến</label>
                      <div className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-800">
                        {formData.diemDen || "—"}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">
                        Giờ kết thúc
                      </label>
                      <div className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-800">
                        {`${formData.gioKetThuc?.hour || "00"}:${
                          formData.gioKetThuc?.minute || "00"
                        }`}
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
                  </>
                )}
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

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Xác nhận hủy chuyến"
        description="Bạn có chắc chắn muốn hủy chuyến xe này?"
        cancelText="Hủy"
        confirmText="Xác nhận"
        onCancel={() => setConfirmDialogOpen(false)}
        onConfirm={confirmDeleteTrip}
      />

      {totalPages > 0 && (
        <div className="flex justify-center items-center mt-6">
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
              className={`px-3 py-1 rounded ${
                currentPage === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              «
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`px-3 py-1 rounded ${
                currentPage === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              ‹
            </button>

            {generatePageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              ›
            </button>
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripManagement;
