// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import axios from 'axios';
import './AdminDashboard.css';  // Đảm bảo rằng bạn đã import đúng file CSS


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Quản Lý Hệ Thống</h1>
        <button className="btn btn-danger" onClick={handleLogout}>Đăng xuất</button>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>Danh Sách Người Dùng</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ Tên</th>
                  <th>Email</th>
                  <th>Số Điện Thoại</th>
                  <th>Vai Trò</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.hoTen}</td>
                    <td>{user.email}</td>
                    <td>{user.SDT}</td>
                    <td>{user.vaiTro}</td>
                    <td>{user.trangThai}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-1">Sửa</button>
                      <button className="btn btn-sm btn-danger">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;