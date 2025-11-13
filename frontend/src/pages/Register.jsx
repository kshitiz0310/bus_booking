import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./Register.css"; // Create this file for styles

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError("");
    try {
      await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        age: parseInt(formData.age),
      });
      navigate("/login");
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-overlay" />
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-title">Join BusKaro</h1>
          <p className="register-subtitle">Create your account to start booking buses</p>
        </div>
        <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
          <div className="register-field">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="register-field">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="register-form-row">
            <div className="register-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            <div className="register-field">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
                min="1"
                max="120"
                required
              />
            </div>
          </div>
          <div className="register-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
          </div>
          <div className="register-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && <p className="register-error">{error}</p>}
          <button type="submit" className={`register-btn ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
