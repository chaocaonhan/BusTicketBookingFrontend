import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const TuyenXe = () => {
  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const columns = [
    {
      name: (
        <div className="text-orange-400 font-bold text-lg text-center w-full">
          Tuyến đường
        </div>
      ),
      selector: (row) => row.tenTuyen,
      width: "20rem",
      cell: (row) => <div className="text-center w-full">{row.tenTuyen}</div>,
    },
    {
      name: (
        <div className="text-orange-400 font-bold text-lg text-center w-full">
          Quãng đường
        </div>
      ),
      selector: (row) => row.khoangCach,
      width: "15rem",
      cell: (row) => (
        <div className="text-center w-full">{row.khoangCach} km</div>
      ),
    },
    {
      name: (
        <div className="text-orange-400 font-bold text-lg text-center w-full">
          Thời gian đi
        </div>
      ),
      selector: (row) => row.thoiGianDiChuyen,
      width: "15rem",
      cell: (row) => (
        <div className="text-center w-full">{row.thoiGianDiChuyen}</div>
      ),
    },
    {
      name: (
        <div className="text-orange-400 font-bold text-lg text-center w-full">
          Giá vé
        </div>
      ),
      width: "10rem",
      cell: () => <div className="text-center w-full">---</div>,
    },
    {
      cell: (row) => (
        <div className="text-center w-full">
          <button
            className="px-4 py-2 rounded-lg text-white bg-orange-400 font-semibold hover:bg-orange-500"
            onClick={() => handleSearchRouteClick(row)}
          >
            Tìm tuyến xe
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/tuyen-xe");
      const result = await response.json();
      if (result.code === 200 && Array.isArray(result.result)) {
        setData(result.result);
        setRecords(result.result);
      } else {
        console.error("Dữ liệu API không hợp lệ:", result);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleStartFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setRecords(
      data.filter((row) =>
        row.tinhDi.tenTinhThanh.toLowerCase().includes(value)
      )
    );
  };

  const handleEndFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setRecords(
      data.filter((row) =>
        row.tinhDen.tenTinhThanh.toLowerCase().includes(value)
      )
    );
  };

  const handleSearchRouteClick = (route) => {
    const today = new Date();
    const queryParams = new URLSearchParams();
    queryParams.append("departure", route.tinhDi.tenTinhThanh);
    queryParams.append("destination", route.tinhDen.tenTinhThanh);
    queryParams.append("departureDate", formatDate(today));
    queryParams.append("returnDate", "");
    queryParams.append("isReturn", "false");

    navigate(`/dat-ve?${queryParams.toString()}`);
  };

  return (
    <section className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="text-2xl font-bold text-gray-700 mb-4">
          Các chuyến đi phổ biến
        </div>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            onChange={handleStartFilter}
            placeholder="Tìm kiếm điểm đi"
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
          />
          <input
            type="text"
            onChange={handleEndFilter}
            placeholder="Tìm kiếm điểm đến"
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
          />
        </div>
        <div className="border-b mb-4"></div>
        <DataTable columns={columns} data={records} />
      </div>
    </section>
  );
};

export default TuyenXe;
