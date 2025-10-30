import React from "react";
import { Link } from "react-router-dom";
import { Bus } from "lucide-react";
import "./NavbarUser.css";

export default function NavbarUser() {
  return (
    <nav className="navbar-user">
      <div className="navbar-user-left">
        <div className="navbar-user-logo-container">
          <Bus className="navbar-user-logo-icon" />
        </div>
        <span className="navbar-user-title">Smart Bus</span>
      </div>
      <div className="navbar-user-right">
        <Link to="/user" className="navbar-user-link">Dashboard</Link>
        <Link to="/book/1" className="navbar-user-link">Book Bus</Link>
        <Link to="/my-bookings" className="navbar-user-link">My Bookings</Link>
        <Link to="/" className="navbar-user-logout-link">Logout</Link>
      </div>
    </nav>
  );
}
