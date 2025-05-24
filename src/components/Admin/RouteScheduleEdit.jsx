"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoveLeft, X, Trash2 } from "lucide-react";
import authService from "../../services/authService";

// SortableItem component for rendering each stop
const SortableItem = ({ id, stop }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 mb-2 rounded-lg border border-gray-100 bg-white shadow-sm cursor-grab relative ${
        isDragging ? "bg-orange-50" : ""
      }`}
    >
      <div className="flex flex-col">
        {/* Hiển thị tên điểm đón và địa chỉ */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 ml-2">
            {stop.tenDiemDon}
          </span>
          <span className="ml-auto text-orange-500 font-medium">
            {stop.thoiGianTuDiemDau || 0} km
          </span>
        </div>
        <span className="text-gray-500 text-sm mt-1 ml-2">{stop.diaChi}</span>
      </div>
    </div>
  );
};

// Trash bin component
const TrashBin = ({ isActive }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "trash-bin",
  });

  return (
    <div
      ref={setNodeRef}
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 p-4 rounded-lg border-2 
        ${isOver ? "border-red-500 bg-red-100" : "border-gray-300 bg-white"} 
        shadow-lg transition-all duration-200 flex items-center justify-center
        ${
          isActive
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }
        z-50`}
      style={{ width: "200px", height: "80px" }}
    >
      <Trash2
        size={32}
        className={`${isOver ? "text-red-500" : "text-gray-400"} mr-2`}
      />
      <span
        className={`font-medium ${isOver ? "text-red-500" : "text-gray-500"}`}
      >
        Thả để xóa
      </span>
    </div>
  );
};

// Draggable item preview
const DragItemPreview = ({ stop }) => {
  return (
    <div className="p-4 rounded-lg border border-orange-200 bg-white shadow-md">
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 ml-2">
            {stop.tenDiemDon}
          </span>
          <span className="ml-auto text-orange-500 font-medium">
            {stop.thoiGianTuDiemDau || 0} km
          </span>
        </div>
        <span className="text-gray-500 text-sm mt-1 ml-2">{stop.diaChi}</span>
      </div>
    </div>
  );
};

// Add Station Form Component
const AddStationForm = ({ isOpen, onClose, onAdd, token }) => {
  const [provinces, setProvinces] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingStations, setLoadingStations] = useState(false);

  // Fetch provinces when form opens
  useEffect(() => {
    if (isOpen) {
      fetchProvinces();
    }
  }, [isOpen]);

  // Fetch stations when province changes
  useEffect(() => {
    if (selectedProvince) {
      fetchStations(selectedProvince);
    } else {
      setStations([]);
      setSelectedStation("");
    }
  }, [selectedProvince]);

  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const response = await fetch("http://localhost:8081/api/tinhthanh", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.code === 200) {
        setProvinces(data.result);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const fetchStations = async (provinceName) => {
    setLoadingStations(true);
    try {
      const response = await fetch(
        `http://localhost:8081/api/Station/getByProvince?province=${encodeURIComponent(
          provinceName
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.code === 200) {
        setStations(data.result);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    } finally {
      setLoadingStations(false);
    }
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedStation("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStation) {
      const station = stations.find((s) => s.id.toString() === selectedStation);
      if (station) {
        onAdd(station);
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setSelectedProvince("");
    setSelectedStation("");
    setStations([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Thêm điểm đón trả</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Province Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỉnh thành
            </label>
            <select
              value={selectedProvince}
              onChange={handleProvinceChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={loadingProvinces}
            >
              <option value="">
                {loadingProvinces ? "Đang tải..." : "Chọn tỉnh thành"}
              </option>
              {provinces.map((province) => (
                <option key={province.id} value={province.tenTinhThanh}>
                  {province.tenTinhThanh}
                </option>
              ))}
            </select>
          </div>

          {/* Station Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điểm đón
            </label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={!selectedProvince || loadingStations}
            >
              <option value="">
                {loadingStations
                  ? "Đang tải..."
                  : selectedProvince
                  ? "Chọn điểm đón"
                  : "Vui lòng chọn tỉnh thành trước"}
              </option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.tenDiemDon} - {station.diaChi}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!selectedStation}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main RouteScheduleEdit component
const RouteScheduleEdit = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [showTrashBin, setShowTrashBin] = useState(false);
  const location = useLocation();
  const tenTuyen = location.state?.tenTuyen || "";

  const token = localStorage.getItem("token");
  const role = authService.getUserRole();

  // Fetch stops from API
  useEffect(() => {
    const fetchStops = async () => {
      setLoading(true);
      setError(null);
      try {
        const resStops = await fetch(
          `http://localhost:8081/api/diem-dung/tuyen/${routeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dataStops = await resStops.json();
        if (dataStops.code === 200) {
          const sortedStops = dataStops.result.sort(
            (a, b) => a.thoiGianTuDiemDau - b.thoiGianTuDiemDau
          );
          setStops(sortedStops);
        } else {
          setStops([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (routeId) {
      fetchStops();
    }
  }, [routeId, token]);

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find active stop
  const activeStop = activeId
    ? stops.find((stop) => stop.id === activeId)
    : null;

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setShowTrashBin(true);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setShowTrashBin(false);

    // If dropped on trash bin, delete the item
    if (over && over.id === "trash-bin") {
      setStops((stops) => stops.filter((stop) => stop.id !== active.id));
      return;
    }

    // Otherwise handle normal reordering
    if (active.id !== over?.id) {
      setStops((stops) => {
        const oldIndex = stops.findIndex((stop) => stop.id === active.id);
        const newIndex = stops.findIndex((stop) => stop.id === over.id);
        const newStops = arrayMove(stops, oldIndex, newIndex);

        newStops.forEach((stop, idx) => {
          console.log(`Thứ tự: ${idx + 1}, idDiemDonTra: ${stop.idDiemDonTra}`);
        });

        return newStops; // chỉ gọi arrayMove 1 lần
      });
    }
  };

  // Handle drag cancel
  const handleDragCancel = () => {
    setActiveId(null);
    setShowTrashBin(false);
  };

  const handleSave = async () => {
    try {
      // Mảng chỉ chứa idDiemDonTra theo thứ tự hiện tại
      const danhSachDiemDonTheoThuTu = stops.map((stop) => stop.idDiemDonTra);
      console.log(routeId);
      // Gọi API cập nhật
      const response = await fetch(
        "http://localhost:8081/api/diem-dung/capNhatDiemDungTrenTuyen",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idTuyen: Number(routeId),
            danhSachDiemDonTheoThuTu, // mảng id điểm đón theo thứ tự
          }),
        },
        console.log(typeof idTuyenXe)
      );

      const data = await response.json();
      if (data.code === 200) {
        toast.success("Cập nhật thứ tự điểm đón thành công!");
      } else {
        toast.error(data.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi lưu!");
    }
  };

  // Handle adding new station
  const handleAddStation = (station) => {
    // Create a new stop object with a temporary ID
    const newStop = {
      id: Date.now(), // temporary ID
      idDiemDonTra: station.id,
      tenDiemDon: station.tenDiemDon,
      diaChi: station.diaChi,
      thoiGianTuDiemDau: stops.length * 30, // temporary time, 30 minutes apart
    };

    setStops((prevStops) => [...prevStops, newStop]);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!routeId)
    return (
      <div className="py-4 text-center text-gray-500">
        Không tìm thấy tuyến xe
      </div>
    );
  if (loading)
    return (
      <div className="py-4 text-center text-gray-500">
        ⏳ Đang tải các điểm dừng...
      </div>
    );
  if (error)
    return <div className="text-red-500 py-4 text-center">Lỗi: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 mt-14 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-3 text-orange-500 hover:text-orange-600 flex items-center font-medium"
          >
            <MoveLeft size={20} className="mr-1" />
            <span>Quay lại</span>
          </button>
        </div>

        <h2 className="text-xl text-orange-400 font-bold text-center flex-1">
          Chỉnh sửa lịch trình tuyến xe : {tenTuyen}
        </h2>

        {/* Add Station Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-orange-50 text-orange-500 rounded-md hover:bg-orange-100 text-sm font-medium"
        >
          Thêm điểm đón
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium ml-2"
        >
          Lưu
        </button>
      </div>

      <div className="relative">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={stops.map((stop) => stop.id)}
            strategy={verticalListSortingStrategy}
          >
            {stops.map((stop) => (
              <SortableItem key={stop.id} id={stop.id} stop={stop} />
            ))}
          </SortableContext>

          {/* Trash bin that appears when dragging */}
          <TrashBin isActive={showTrashBin} />

          {/* Drag overlay for the item being dragged */}
          <DragOverlay>
            {activeId ? <DragItemPreview stop={activeStop} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Add Station Form Modal */}
      <AddStationForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={handleAddStation}
        token={token}
      />
    </div>
  );
};

export default RouteScheduleEdit;
