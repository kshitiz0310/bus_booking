import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
      <div className="background-img">
    <div className="homepage-container">
        <div className="overlay">

        <div className="homepage-hero">
        <h1>Bus Booking</h1>
        <p>Book buses easily. Manage bookings effortlessly.</p>
        <Link to="/login" className="homepage-btn">Get Started</Link>
      </div>

      <div className="homepage-features" id="features">
        <h2>🚀 Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚌</div>
            <h3>Easy Booking</h3>
            <p>Search buses and book your seat instantly. Fast and reliable.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Admin Dashboard</h3>
            <p>Manage buses, users, and bookings with detailed analytics.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>User Dashboard</h3>
            <p>View your bookings, track seats, and cancel if needed.</p>
          </div>
        </div>
       </div>
        </div>
      </div>

      <div className="homepage-footer">
        <div className="footer-grid">
          <div>
            <h3>Smart Bus Booking</h3>
            <p>Your reliable partner for bus bookings. Easy, fast, and secure.</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
              <li><a href="#features">Features</a></li>
            </ul>
          </div>
          <div>
            <h3>Contact Us</h3>
            <p>Email: support@smartbusbooking.com</p>
            <p>Phone: +91 1234567890</p>
            <p>Address: 123 Bus Street, City, State 12345</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            {new Date().getFullYear()} Smart Bus Booking | All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
