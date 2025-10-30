import React from "react";
import { Bus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import "./NavbarLanding.css";

export default function NavbarLanding() {
  return (
    <nav className="navbar-landing">
      <div className="navbar-landing-left">
        <div className="navbar-landing-logo-container">
          <Bus className="navbar-landing-logo-icon" />
        </div>
        <span className="navbar-landing-title">Smartify</span>
      </div>
      <div className="navbar-landing-right">
        <Link to="/login">
          <Button className="navbar-landing-login-button">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="outline" className="navbar-landing-signup-button">Sign Up</Button>
        </Link>
      </div>
    </nav>
  );
}
