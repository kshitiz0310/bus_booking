import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./UserDashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState({
    from: "",
    to: "",
    date: "",
    ac: true,
    nonAc: true,
  });
  const [error, setError] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      setSearch((s) => ({ ...s, [name]: checked }));
    } else {
      setSearch((s) => ({ ...s, [name]: value }));
    }
    setError("");
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!search.from.trim() || !search.to.trim()) {
      setError("Please enter both starting point and destination.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const params = new URLSearchParams({
        from: search.from,
        to: search.to,
        date: search.date || "",
        ac: search.ac ? "1" : "0",
        nonAc: search.nonAc ? "1" : "0",
      }).toString();
      const { data } = await API.get(`/buses?${params}`);
      setBuses(data);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setError("Failed to load buses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-img">
      <div className="overlay" />
      <div className="dashboard-content">
        <h2>Welcome, {user ? user.name : "User"}!</h2>

        <form className="search-bus-form" onSubmit={handleSearchSubmit} aria-label="Search buses">
          <input
            name="from"
            type="text"
            className="search-bus-input"
            placeholder="Starting point"
            value={search.from}
            onChange={handleChange}
            aria-label="Starting point"
          />

          <input
            name="to"
            type="text"
            className="search-bus-input"
            placeholder="Destination"
            value={search.to}
            onChange={handleChange}
            aria-label="Destination"
          />

          <input
            name="date"
            type="date"
            className="search-bus-input"
            value={search.date}
            onChange={handleChange}
            aria-label="Travel date"
          />

          <div className="search-filters" role="group" aria-label="Filters">
            <label className="filter-checkbox">
              <input
                name="ac"
                type="checkbox"
                checked={search.ac}
                onChange={handleChange}
              />
              AC
            </label>
            <label className="filter-checkbox">
              <input
                name="nonAc"
                type="checkbox"
                checked={search.nonAc}
                onChange={handleChange}
              />
              Non-AC
            </label>

            <button type="submit" className="search-bus-button">Search</button>
          </div>
        </form>

        {error && <p className="search-error">{error}</p>}

        {loading && <p>Loading buses...</p>}

        {buses.length > 0 && (
          <div className="buses-list">
            {buses.map((bus) => (
              <div key={bus._id} className="bus-card">
                <div className="bus-info">
                  <h3>{bus.busNumber}</h3>
                  <p><strong>Route:</strong> {bus.startPoint} → {bus.destination}</p>
                  <p><strong>Date:</strong> {bus.date}</p>
                  <p><strong>Time:</strong> {bus.departureTime} - {bus.arrivalTime}</p>
                  <p><strong>Type:</strong> {bus.ac ? "AC" : "Non-AC"}</p>
                  <p><strong>Capacity:</strong> {bus.capacity}</p>
                  <p><strong>Available Seats:</strong> {bus.seatsAvailable}</p>
                  <p><strong>Fare:</strong> ₹{bus.fare}</p>
                  <p><strong>Driver:</strong> {bus.driverName} ({bus.driverPhone})</p>
                  {bus.notes && <p><strong>Notes:</strong> {bus.notes}</p>}
                </div>
                <button
                  className="book-btn"
                  onClick={() => navigate(`/book/${bus._id}`)}
                  disabled={bus.seatsAvailable <= 0}
                >
                  {bus.seatsAvailable > 0 ? "Book Now" : "No Seats"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
