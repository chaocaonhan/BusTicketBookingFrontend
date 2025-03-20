// src/components/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import axios from 'axios';

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/tickets', {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách vé:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Quản Lý Vé Xe</h1>
        <button className="btn btn-danger" onClick={handleLogout}>Đăng xuất</button>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h3>Tìm Kiếm Chuyến Xe</h3>
        </div>
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="fromLocation" className="form-label">Điểm đi</label>
                <input type="text" className="form-control" id="fromLocation" />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="toLocation" className="form-label">Điểm đến</label>
                <input type="text" className="form-control" id="toLocation" />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="travelDate" className="form-label">Ngày đi</label>
                <input type="date" className="form-control" id="travelDate" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Tìm kiếm</button>
          </form>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>Vé Của Tôi</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Chuyến Xe</th>
                  <th>Ngày</th>
                  <th>Điểm Đi</th>
                  <th>Điểm Đến</th>
                  <th>Số Ghế</th>
                  <th>Giá</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length > 0 ? (
                  tickets.map(ticket => (
                    <tr key={ticket.id}>
                      <td>{ticket.id}</td>
                      <td>{ticket.chuyenXe}</td>
                      <td>{ticket.ngay}</td>
                      <td>{ticket.diemDi}</td>
                      <td>{ticket.diemDen}</td>
                      <td>{ticket.soGhe}</td>
                      <td>{ticket.gia.toLocaleString()} VNĐ</td>
                      <td>{ticket.trangThai}</td>
                      <td>
                        <button className="btn btn-sm btn-primary me-1">Chi tiết</button>
                        <button className="btn btn-sm btn-danger">Hủy vé</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">Bạn chưa có vé nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;