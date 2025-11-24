import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import BookBus from "./pages/BookBus";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ManageBuses from "./pages/ManageBuses";
import ManageUsers from "./pages/ManageUsers";
import ManageBookings from "./pages/ManageBookings";
// import BusDetails from "./pages/BusDetails";
import SearchResults from "./pages/SearchResults";
import HomePage from "./pages/HomePage";

import NavbarLanding from "./components/NavbarLanding";
import NavbarUser from "./components/NavbarUser";
import NavbarAdmin from "./components/NavbarAdmin";

function NavbarSelector() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return <NavbarAdmin />;
  if (location.pathname.startsWith("/user") || location.pathname.startsWith("/book") || location.pathname.startsWith("/my-bookings") || location.pathname.startsWith("/profile")) return <NavbarUser />;
  return <NavbarLanding />;
}

function App() {
  return (
    <BrowserRouter>
      <NavbarSelector />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/user" element={<UserDashboard />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book/:busId" element={<BookBus />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/buses" element={<ManageBuses />} />
        {/* <Route path="/admin/buses/:id" element={<BusDetails />} /> */}
        <Route path="/admin/bookings" element={<ManageBookings />} />
        <Route path="/admin/users" element={<ManageUsers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
