import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./Login.css"; // Create this file for styles

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await API.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <h1 className="login-title">Bus Booking System</h1>
        <h2 className="login-subtitle">Login</h2>
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="login-footer">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="login-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
