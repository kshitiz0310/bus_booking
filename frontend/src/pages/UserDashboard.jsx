import React from "react";
import { Link } from "react-router-dom";
import "./UserDashboard.css"; // Create this file for styles

export default function UserDashboard() {
  const stats = [
    { emoji: "🚌", title: "Book a Bus", desc: "Easily book your tickets online", link: "/book/1" },
    { emoji: "⏰", title: "My Bookings", desc: "Check your current and past bookings", link: "/my-bookings" },
    { emoji: "🛡️", title: "Profile", desc: "Manage your account settings", link: "/user" },
  ];

  return (
    <div className="user-dashboard-container">
      <h2>Welcome, User!</h2>
      <div className="dashboard-grid">
        {stats.map((stat, idx) => (
          <div className="dashboard-card" key={idx}>
            <div className="dashboard-icon">{stat.emoji}</div>
            <h3>{stat.title}</h3>
            <p>{stat.desc}</p>
            <Link className="dashboard-btn" to={stat.link}>Go</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
