import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/register', { username, password, role });
            alert('Đăng ký thành công!');
            navigate('/login');
        } catch (error) {
            alert('Đăng ký thất bại!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
            </select>
            <button type="submit">Đăng ký</button>
        </form>
    );
};

export default Register;