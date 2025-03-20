// src/components/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    const role = authService.getUserRole();
    if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (role === 'DRIVER') {
      navigate('/driver/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h2 className="text-center">Không Được Phép Truy Cập</h2>
            </div>
            <div className="card-body text-center">
              <p>Bạn không có quyền truy cập trang này.</p>
              <button className="btn btn-primary me-2" onClick={handleGoBack}>
                Quay lại trang chính
              </button>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;